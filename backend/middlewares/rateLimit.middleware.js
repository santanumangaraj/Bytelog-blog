import rateLimit from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";
import redis from "../config/redis.js";

const buildLimiter = ({ windowMs, max, message, keyPrefix, skipSuccessfulRequests }) =>
    rateLimit({
        windowMs,
        max,
        standardHeaders: true,
        legacyHeaders: false,
        skipSuccessfulRequests: Boolean(skipSuccessfulRequests),
        store: new RedisStore({
            sendCommand: (...args) => redis.call(...args),
            prefix: keyPrefix,
        }),
        message: { success: false, message, errors: [] },
    });

// Keyed by IP (express-rate-limit's default keyGenerator — already handles
// IPv4/IPv6 correctly without a custom override) — this is the layer that
// slows down one source hitting many accounts. Per-account brute force is
// handled separately by the DB-backed lockout in auth.service.js, so this
// doesn't need to double as account-level protection.
//
// skipSuccessfulRequests is the important part for a real deployment:
// only FAILED attempts count toward the budget. Without it, a shared IP
// (corporate NAT, campus wifi, a mobile carrier) can get every user behind
// it rate-limited by nothing more than their own normal successful logins,
// which is a real, common false-positive in production, not a hypothetical.
const loginRateLimiter = buildLimiter({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: "Too many failed login attempts. Please try again in 15 minutes.",
    keyPrefix: "rl:login:",
    skipSuccessfulRequests: true,
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
