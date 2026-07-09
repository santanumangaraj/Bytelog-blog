import crypto from "crypto";
import redis from '../config/redis.js';

export const acquireLock = async(lockKey,ttl=5)=>{

    const token = crypto.randomUUID();

    const acquired = await redis.set(
        lockKey,
        token,
        "NX",
        "EX",
        ttl
    );

    return {
        acquired: acquired === "OK",
        token
    };
};


export const releaseLock = async(lockKey,token)=>{

    const lua = `
        if redis.call("GET", KEYS[1]) == ARGV[1]
        then
            return redis.call("DEL", KEYS[1])
        else
            return 0
        end
    `;

    await redis.eval(
        lua,
        1,
        lockKey,
        token
    )
}