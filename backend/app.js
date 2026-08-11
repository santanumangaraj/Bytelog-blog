import "dotenv/config";
import path from "path";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser"
// import swaggerUi from "swagger-ui-express"
// import swaggerDocument from "./swagger-output.json" with { type: "json" };
import redis from "./config/redis.js";
import db from "./models/index.js";

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
        return callback(new Error("Not allowed by CORS"))
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

        app.listen(PORT, () => {
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

