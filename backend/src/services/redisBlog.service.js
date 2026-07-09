import redis from "../config/redis.js";


export const getCacheData = async(cacheKey)=>{

    const cacheData = await redis.get(cacheKey)
    return cacheData ? JSON.parse(cacheData) : null;
}

export const createCacheData = async(cacheKey,pagination,expiryTime)=>{
    return await redis.set(cacheKey,JSON.stringify(pagination),"EX",expiryTime)
}

export const deleteCache = async (cacheKey) => {
    await redis.del(key);
};