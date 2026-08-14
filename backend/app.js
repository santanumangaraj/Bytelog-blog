import "dotenv/config";
import "./config/validateEnv.js";
import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser"
// import swaggerUi from "swagger-ui-express"
// import swaggerDocument from "./swagger-output.json" with { type: "json" };
import redis from "./config/redis.js";
import db from "./models/index.js";

// A single unguarded async error outside the Express request lifecycle
// (e.g. a fire-and-forget call, an event-handler throw) would otherwise
// crash the whole process with no trace of why.
process.on("unhandledRejection", (reason) => {
    console.error("💥 Unhandled Rejection:", reason);
});

process.on("uncaughtException", (err) => {
    console.error("💥 Uncaught Exception:", err);
    // process state is undefined after this — exit and let the process
    // manager (Docker/PM2/systemd) restart cleanly rather than limp on.
    process.exit(1);
});

const app = express()

// Only trust the reverse proxy's headers (X-Forwarded-For, etc.) when actually
// deployed behind one — needed for correct rate-limiter IPs and secure cookies.
app.set("trust proxy", process.env.TRUST_PROXY === "true" ? 1 : 0)

const allowedOrigins = (process.env.CORS_ORIGIN || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean)

app.use(helmet())

app.use(cors({
    origin: (origin, callback) => {
        // no Origin header (curl, server-to-server, same-origin) is always allowed
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true)
        }
        // Log the exact rejected origin and the current allowlist — without
        // this, a CORS misconfiguration is a guessing game from the client
        // side alone (the browser's console never reveals what the server
        // actually compared against).
        console.warn(`CORS: rejected origin "${origin}" — not in CORS_ORIGIN allowlist [${allowedOrigins.join(", ") || "empty"}]`)
        const corsError = new Error("Not allowed by CORS")
        corsError.statusCode = 403
        return callback(corsError)
    },
    credentials: true
}))

app.use(express.json({
    limit: "16kb"
}))//for parsing application/json

app.use(express.urlencoded({extended: true,limit: "16kb"}))//for parsing application/x-www-form-urlencoded or url encoded or form-data
app.use(express.static("public"))
app.use(cookieParser())

//routes import 

import userRouter from "./routes/auth.route.js"
import blogRouter from "./routes/blog.route.js"
import likeRouter from "./routes/like.route.js"
import { errorHandler } from "./middlewares/error.middleware.js";

app.use("/home",(req,res)=>{
    res.send("Welcome")
})

app.get("/health", async (req, res) => {
    try {
        await db.sequelize.authenticate();
        if (redis.status !== "ready") {
            throw new Error("redis not ready");
        }
        return res.status(200).json({ status: "ok", db: "up", redis: "up" });
    } catch (error) {
        return res.status(503).json({ status: "error", message: error.message });
    }
})
app.use("/api/v2/users",userRouter)
app.use("/api/v2/blogs",blogRouter)
app.use("/api/v2/likes",likeRouter)
// app.use("/api-docs",swaggerUi.serve, swaggerUi.setup(swaggerDocument))


app.use(errorHandler)

const PORT = process.env.PORT || 8000;

// Helper to wait for Redis connection with timeout
const waitForRedis = (timeoutMs = 5000) => {
    return new Promise((resolve, reject) => {
        if (redis.status === "ready") return resolve();

        const timeout = setTimeout(() => {
            reject(new Error(`Redis connection timed out after ${timeoutMs}ms`));
        }, timeoutMs);

        redis.once("ready", () => {
            clearTimeout(timeout);
            resolve();
        });
    });
};

let server;

// Test DB & Redis Connections before starting the server
const startServer = async () => {
    try {
        await db.sequelize.authenticate();
        console.log("✅ Database connected successfully!!");

        try {
            await waitForRedis(5000);
            console.log("✅ Redis connected successfully!!");
        } catch (redisErr) {
            console.warn("⚠️  Redis is not available. Run 'docker compose up -d' to start Redis container.");
            console.warn(`   Connection URL: ${process.env.REDIS_URL}`);
        }

        server = app.listen(PORT, () => {
            console.log(`⚙ Server is running at port ${PORT}`);
        });
    } catch (error) {
        console.error("❌ Fatal Database connection error:", error.message);
        process.exit(1);
    }
};

startServer();

app.on("error", (error)=>{
    console.log(`Err: ${error}`)
})

// Stop accepting new connections, let in-flight requests finish, then close
// the DB/Redis connections before exiting — without this, every restart
// (deploy, `docker compose restart`, orchestrator reschedule) hard-kills
// whatever request happened to be in flight. Deliberately does NOT call
// process.exit itself — the caller (this file when run standalone, or a
// combined entrypoint importing multiple modules) decides when it's safe
// to actually end the process, once every module's cleanup has finished.
const shutdown = async (signal) => {
    console.log(`${signal} received: starting graceful shutdown`);

    if (server) {
        await new Promise((resolve) => server.close(resolve));
    }

    try {
        await db.sequelize.close();
    } catch (error) {
        console.error("Error closing database connection:", error.message);
    }

    try {
        await redis.quit();
    } catch (error) {
        console.error("Error closing Redis connection:", error.message);
    }

    console.log("👋 API shutdown complete");
};

// Only self-register signal handlers when this file is run directly
// (`node app.js`) — when imported by a combined entrypoint instead, that
// entrypoint owns signal handling so multiple modules' shutdowns don't race
// to exit the process before each other finishes cleaning up.
const isMainModule = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];

if (isMainModule) {
    process.on("SIGTERM", async () => {
        await shutdown("SIGTERM");
        process.exit(0);
    });
    process.on("SIGINT", async () => {
        await shutdown("SIGINT");
        process.exit(0);
    });
}

export { shutdown as shutdownApi };

