import axios from "axios"

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:8002/api/v2",
    withCredentials: true
});

/* Auth is carried entirely by httpOnly cookies (see backend/utils/cookieOptions.js) —
   no token is ever stored in localStorage/JS-readable state, so there's nothing to
   attach here. On a 401, silently try one refresh and retry the original request;
   a single-flight queue avoids firing multiple parallel refreshes when several
   requests 401 at once. */
let isRefreshing = false;
let refreshSubscribers = [];

const subscribeTokenRefresh = (cb) => refreshSubscribers.push(cb);
const onRefreshed = () => {
    refreshSubscribers.forEach((cb) => cb());
    refreshSubscribers = [];
};

API.interceptors.response.use(
    (res) => res,
    async (error) => {
        const originalRequest = error.config;
        const status = error.response?.status;
        const isAuthEndpoint =
            originalRequest?.url?.includes("/users/login") ||
            originalRequest?.url?.includes("/users/register") ||
            originalRequest?.url?.includes("/users/refresh-token");

        if (status === 401 && originalRequest && !originalRequest._retry && !isAuthEndpoint) {
            originalRequest._retry = true;

            if (!isRefreshing) {
                isRefreshing = true;
                try {
                    await API.post("/users/refresh-token");
                    isRefreshing = false;
                    onRefreshed();
                } catch (refreshError) {
                    isRefreshing = false;
                    refreshSubscribers = [];
                    window.dispatchEvent(new CustomEvent("auth:sessionExpired"));
                    return Promise.reject(refreshError);
                }
            }

            return new Promise((resolve, reject) => {
                subscribeTokenRefresh(() => {
                    API(originalRequest).then(resolve).catch(reject);
                });
            });
        }

        return Promise.reject(error);
    }
)

//user route
export const loginUser = (data)=> API.post("/users/login",data);
export const registerUser = (data)=> API.post("/users/register",data);
export const logoutUser = ()=> API.post("/users/logout");
export const refreshToken = ()=> API.post("/users/refresh-token");
export const changePassword = (data)=> API.post("/users/change-password",data);
export const getCurrentUser = ()=> API.get("/users/current-user");

//blog route
export const createBlog = (formData)=> API.post("/blogs/upload-blog", formData);
export const deleteBlog = (blogId)=> API.delete(`/blogs/delete-blog/${blogId}`);
export const updateBlog = (blogId,formData)=> API.patch(`/blogs/${blogId}`, formData);
export const updateBlogStatus = (blogId,status)=> API.patch(`/blogs/${blogId}/status`, status);
export const incrementBlogView = (blogId) => API.patch(`/blogs/${blogId}/view`);
export const getAllBlogs = (params)=> API.get("/blogs",{params});
export const getBlogById = (params)=> API.get(`/blogs/id/${params}`)
export const getBlogBySlug = (params)=> API.get(`/blogs/s/${params}`)
export const getMyBlogs = (query)=> API.get(`/blogs/me`,{params:query})



//tags route
export const getAllTags = () => API.get("/tags");

//likes route
export const getBlogLikeCount = (blogId) => API.get(`/likes/${blogId}/count`);
export const getBlogLikeStatus = (blogId) => API.get(`/likes/${blogId}/status`);
export const toggleBlogLike = (blogId) => API.post(`/likes/toggle/${blogId}/like`);
export const toggleBlogUnlike = (blogId) => API.delete(`/likes/toggle/${blogId}/unlike`);
export default API
