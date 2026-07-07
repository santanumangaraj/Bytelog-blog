import { createClient} from "redis"

const client = createClient({
    url: process.env.REDIS_URL
});

client.on("error",err=>console.log("Redis error: ",err))

const connectRedis = async()=>{
    await client.connect();
    console.log("Redis connected successfully")
}

export {
    client,
    connectRedis
}