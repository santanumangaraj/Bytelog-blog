import axios from "axios"

const API = axios.create({
    baseURL:"http://localhost:8002/api/v2",
    withCredentials: true
});

API.interceptors.request.use((req)=>{
    const token = localStorage.getItem("token")

    if(token){
        req.headers.Authorization = `Bearer ${token}`
    }

    return req
})

//user route
export const loginUser = (data)=> API.post("/users/login",data);
export const registerUser = (data)=> API.post("/users/register",data);
export const changePassword = (data)=> API.post("/users/change-password",data);
export const getCurrentUser = ()=> API.get("/users/current-user");

//blog route
export const createBlog = (formData)=> API.post("/blogs/upload-blog", formData);
export const getAllBlogs = (params)=> API.get("/blogs",{params});
export const getBlogById = (params)=> API.get(`/blogs/id/${params}`)
export const getBlogBySlug = (params)=> API.get(`/blogs/s/${params}`)
export const getMyBlogs = (query)=> API.get(`/blogs/me`,{params:query})



//likes route
export const getBlogLikeCount = (params) => API.get(`/likes/count/${params}`);
export const toggleBlogLike = (params) => API.patch("/toggle/:blogId/like",{params})
export default API
