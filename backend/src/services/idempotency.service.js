import { cacheKey } from "../cache/cacheKey.js";
import redis from "../config/redis.js";

const PROCESSING = "PROCESSING";

const startRequest = async (idempotencyKey, ttl = 60 * 5) => {
    const key = cacheKey.idempotency(idempotencyKey);

    const result = await redis.set(
        key,
        PROCESSING,
        "NX",
        "EX",
        ttl
    );

    return result === "OK";
};

const getRequest = async (idempotencyKey) => {
    const key = cacheKey.idempotency(idempotencyKey);

    const value = await redis.get(key);

    if (!value) return null;

    if (value === PROCESSING) {
        return PROCESSING;
    }

    return JSON.parse(value);
};

const completeRequest = async (
    idempotencyKey,
    response,
    ttl = 60 * 60 * 24
) => {
    const key = cacheKey.idempotency(idempotencyKey);

    await redis.set(
        key,
        JSON.stringify(response),
        "EX",
        ttl
    );
};

const deleteRequest = async (idempotencyKey) => {
    const key = cacheKey.idempotency(idempotencyKey);

    await redis.del(key);
};

export {
    PROCESSING,
    startRequest,
    getRequest,
    completeRequest,
    deleteRequest,
};