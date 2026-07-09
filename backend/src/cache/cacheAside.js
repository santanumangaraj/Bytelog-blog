import redis from "../config/redis.js";
import { createCacheData, getCacheData } from "../services/redisCache.js";
import { acquireLock, releaseLock } from "./redisLock.js";

const sleep = (ms) =>
    new Promise(resolve => setTimeout(resolve, ms));

export const cacheAside = async ({
    key,
    ttl = 60,
    loader,
}) => {

    const cached = await getCacheData(key);

    if (cached) {

        console.log("Redis HIT");

        return cached;

    }

    const lockKey = `lock:${key}`;

    const {
        acquired,
        token,
    } = await acquireLock(lockKey);


    if (!acquired) {

        const MAX_WAIT = 2000;

        const POLL_INTERVAL = 50;

        const start = Date.now();

        while (true) {

            const retryCache = await getCacheData(key);

            if (retryCache) {

                console.log("Redis HIT after waiting");

                return retryCache;

            }

            const lockExists = await redis.exists(lockKey);

            if (!lockExists)
                break;

            if (
                Date.now() - start >= MAX_WAIT
            )
                break;

            await sleep(POLL_INTERVAL);

        }

        const finalCache = await getCacheData(key);

        if (finalCache) {

            return JSON.parse(finalCache);

        }

    }
    try {

        const data = await loader();

        const randomTTL =
            ttl + Math.floor(Math.random() * 30);

        await createCacheData(
            key,
            data,
            randomTTL
        );

        console.log("Database HIT");

        return data;

    }
    finally {

        if (acquired) {

            await releaseLock(
                lockKey,
                token
            );

        }

    }

};