import mongoose, {Schema} from "mongoose";

const likeSchema = new Schema({
    blog:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Blog",
        required: true
    },
    likedBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
},{timestamps: true})

export const Like = mongoose.model("Like",likeSchema)
