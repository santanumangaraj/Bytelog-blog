import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL,{
    maxRetriesPerRequest: null,
    enableReadyCheck: true
});

redis.on("connect",()=>{
    console.log("REDIS CONNECTED!!");
})

redis.on("error",(err)=>{
    console.error("Redis Error:",err);
})

export default redis;