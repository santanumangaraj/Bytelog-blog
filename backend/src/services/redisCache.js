import redis from "../config/redis.js";


export const getCacheData = async(cacheKey)=>{

    const cacheData = await redis.get(cacheKey)
    return cacheData ? JSON.parse(cacheData) : null;
}

export const createCacheData = async(cacheKey,pagination,expiryTime)=>{
    return await redis.set(cacheKey,JSON.stringify(pagination),"EX",expiryTime)
}

export const deleteCache = async (pattern) => {
    const stream = redis.scanStream({
        match: pattern,
        count: 100,
    });

    stream.on("data", async (keys) => {
        if (keys.length) {
            await redis.del(...keys);
        }
    });

    return new Promise((resolve, reject) => {
        stream.on("end", resolve);
        stream.on("error", reject);
    });
};