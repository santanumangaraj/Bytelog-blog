import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser"

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

import userRouter from "./src/routes/user.routes.js"
import blogRouter from "./src/routes/blog.routes.js"


app.use("/api/v2/users",userRouter)
app.use("/api/v2/blogs",blogRouter)


export {app}