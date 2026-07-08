import "dotenv/config"
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser"
import swaggerUi from "swagger-ui-express"
import swaggerDocument from "./swagger-output.json" with { type: "json" };
import redis from "./src/config/redis.js";
const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({
    limit: "16kb"
}))//for parsing application/json

app.use(express.urlencoded({extended: true,limit: "16kb"}))//for parsing application/x-www-form-urlencoded or url encoded or form-data
app.use(express.static("public"))
app.use(cookieParser())

//routes import 

import userRouter from "./src/routes/auth.route.js"
import blogRouter from "./src/routes/blog.route.js"
import likeRouter from "./src/routes/like.route.js"
import { errorHandler } from "./src/middlewares/error.middleware.js";

app.use("/api/v2/users",userRouter)
app.use("/api/v2/blogs",blogRouter)
app.use("/api/v2/likes",likeRouter)
app.use("/api-docs",swaggerUi.serve, swaggerUi.setup(swaggerDocument))


app.use(errorHandler)


app.listen(process.env.PORT || 8000,()=>{
    console.log(`⚙ Server is running at port ${process.env.PORT}`);
})

app.on("error", (error)=>{
    console.log(`Err: ${error}`)
})