import rateLimit from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";
import redis from "../config/redis.js";

const buildLimiter = ({ windowMs, max, message, keyPrefix }) =>
    rateLimit({
        windowMs,
        max,
        standardHeaders: true,
        legacyHeaders: false,
        store: new RedisStore({
            sendCommand: (...args) => redis.call(...args),
            prefix: keyPrefix,
        }),
        message: { success: false, message, errors: [] },
    });

const loginRateLimiter = buildLimiter({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: "Too many login attempts. Please try again in 15 minutes.",
    keyPrefix: "rl:login:",
});

const registerRateLimiter = buildLimiter({
    windowMs: 60 * 60 * 1000,
    max: 5,
    message: "Too many accounts created from this address. Please try again later.",
    keyPrefix: "rl:register:",
});

const refreshRateLimiter = buildLimiter({
    windowMs: 15 * 60 * 1000,
    max: 30,
    message: "Too many token refresh attempts.",
    keyPrefix: "rl:refresh:",
});

const viewRateLimiter = buildLimiter({
    windowMs: 60 * 1000,
    max: 30,
    message: "Too many view updates. Please slow down.",
    keyPrefix: "rl:view:",
});

const uploadRateLimiter = buildLimiter({
    windowMs: 60 * 60 * 1000,
    max: 20,
    message: "Too many uploads. Please try again later.",
    keyPrefix: "rl:upload:",
});

export {
    loginRateLimiter,
    registerRateLimiter,
    refreshRateLimiter,
    viewRateLimiter,
    uploadRateLimiter,
}
