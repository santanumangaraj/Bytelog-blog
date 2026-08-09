import Redis from "ioredis";

let isInitialConnectErrorLogged = false;

const redisUrl = process.env.IS_DOCKER === "true"
    ? process.env.REDIS_URL_DOCKER
    : process.env.REDIS_URL;

const redis = new Redis(redisUrl, {
    maxRetriesPerRequest: null,
    enableReadyCheck: true,
    retryStrategy(times) {
        const delay = Math.min(times * 500, 3000);
        return delay;
    }
});

redis.on("connect", () => {
    isInitialConnectErrorLogged = false;
    console.log("✅ REDIS CONNECTED!!");
});

redis.on("error", (err) => {
    if (err.code === "ECONNREFUSED") {
        if (!isInitialConnectErrorLogged) {
            console.warn(`⚠️ Cannot connect to Redis at ${process.env.REDIS_URL}. Retrying connection...`);
            isInitialConnectErrorLogged = true;
        }
    } else {
        console.error("Redis Error:", err.message);
    }
});

export default redis;
