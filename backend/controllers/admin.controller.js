import { getAdminBlogsList, getAdminUsersList } from "../services/admin.service.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const fetchedAdminBlogs = asyncHandler(async(req,res)=>{

    const data = await getAdminBlogsList(req.query)

    return res
    .status(200)
    .json(
        new ApiResponse(200,data,
            !data.rows?.length? "No blogs found!!":"Blogs loaded successfully"
        )
    )
})

const fetchedAdminUsers = asyncHandler(async(req,res)=>{

    const data = await getAdminUsersList(req.query)

    return res
    .status(200)
    .json(
        new ApiResponse(200,data,
            !data.rows?.length? "No users found!!":"Users loaded successfully"
        )
    )
})

export {
    fetchedAdminBlogs,
    fetchedAdminUsers
}
