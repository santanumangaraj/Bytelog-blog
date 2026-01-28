import dotenv from "dotenv"

import {app} from "./app.js"
import connectDB from "./src/db/index.js";

dotenv.config({
    path: "./.env"
})

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000,()=>{
        console.log(`⚙ Server is running at port ${process.env.PORT}`);
    })

    app.on("error", (error)=>{
        console.log(`Err: ${error}`)
    })
})
.catch((err)=>{
    console.log("MONGO DB connection failed!!! ",err);
})