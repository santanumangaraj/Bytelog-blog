import mongoose,{Schema} from "mongoose"


const blogSchema = new Schema({
    title:{
        type:String,
        required: true,
        trim:true
    },
    tags:{
        type:[String],
        required: true,
        lowercase:true
    },
    content:{
        type:String,
        required: true
    },
    image:String,
    status:{
        type:String,
        enum:['draft', 'published'], 
        default:"draft"
    },
    isPublished:{
        type:Boolean,
        default:true
    },
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required:true
    }
},{timestamps: true})


export const Blog = mongoose.model("Blog",blogSchema)