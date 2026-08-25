import { getAllTags } from "../services/tags.service.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const fetchedAllTags = asyncHandler(async(req,res)=>{

    const tags = await getAllTags()

    return res
    .status(200)
    .json(
        new ApiResponse(200,tags,
            !tags?.length? "No tags found!!":"Tags loaded successfully"
        )
    )
})

export {
    fetchedAllTags
}
