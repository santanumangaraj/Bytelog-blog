import axios from "axios"

const API = axios.create({
    baseURL:"http://localhost:8000/api/v2",
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

export default API
