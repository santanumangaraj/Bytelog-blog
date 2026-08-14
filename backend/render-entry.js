import "dotenv/config";

// For hosts that don't offer a free tier for background workers (e.g.
// Render) — importing these three modules runs all of them in one process:
// each one starts its own server/BullMQ workers as a side effect of being
// imported (same code as running them standalone), so nothing about their
// actual logic changes here. This file's only job is to coordinate ONE
// graceful shutdown across all three instead of three independent
// SIGTERM/SIGINT handlers racing to call process.exit before each other's
// cleanup finishes — see the `isMainModule` guard in each of app.js /
// workers/blog.worker.js / workers/like.worker.js.
//
// Known tradeoff of running this way: a free host that sleeps the process
// after HTTP inactivity sleeps the workers too, even mid-queue — any
// enqueued job just waits in Redis until the next request wakes the
// process back up, rather than processing in real time. Acceptable for a
// low-traffic/portfolio deployment; not a substitute for real background
// worker hosting under real load.
import { shutdownApi } from "./app.js";
import { shutdownBlogWorkers } from "./workers/blog.worker.js";
import { shutdownLikeWorker } from "./workers/like.worker.js";

const shutdown = async (signal) => {
    console.log(`${signal} received: shutting down API + both workers together`);
    await Promise.allSettled([
        shutdownApi(signal),
        shutdownBlogWorkers(signal),
        shutdownLikeWorker(signal),
    ]);
    console.log("👋 Combined shutdown complete");
    process.exit(0);
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
