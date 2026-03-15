import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../routes/api.js";
import { useAuth } from "../component/AuthContext.jsx";

const Login=()=>{
    const { login } = useAuth();
    const [err,setErr] = useState("")
    const [loading,setLoading] = useState(false)
    const [success,setSuccess] = useState(false)
    const [form,setForm] = useState({
        identifier:"",
        password:""
    })

    const navigate = useNavigate()

    const handleChange = (e)=>{
        setForm({
            ...form,[e.target.name]:e.target.value
        })
    }

    const handleSubmit =async (e)=>{
        e.preventDefault();
        setErr("")
        setLoading(true)
        setSuccess(true)

        try{
            const res = await loginUser(form)
            login(res.data)
            setTimeout(()=>{
                navigate("/")
                setSuccess(false)
            },2000)
        }catch(err){
            setErr(err.response?.data?.message || "Login failed")
        }finally{
            setLoading(false)
        }
    }

    const loadingIcon = ()=>{
        return(
            <span className="loading loading-bars bg-white loading-lg"></span>
        )
    }

    return(
        <div className="flex flex-col justify-center items-center">
            <div className="text-center flex flex-col gap-2 my-10">
                <img src="/ByteLog.svg" className="h-16 sm:h-20 md:h-24 mx-auto" alt="bytelog"/>
                <h3 className="text-2xl sm:text-3xl font-semibold">Sign in</h3>
                <p className="text-sm sm:text-base">or <a onClick={()=>navigate("/register")} className="text-cyan-500 cursor-pointer hover:underline">Create an account</a></p>
            </div>
            <form className="w-full max-w-sm sm:max-w-md flex flex-col gap-3 py-4 px-4" onSubmit={handleSubmit}>
                {err &&
                <div role="alert" className="flex alert alert-warning">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span>Warning: {err}!</span>
                </div>}
                {success &&
                <div className="toast toast-top toast-start">
                    <div className="alert alert-info">
                        <span>Succssfully Login!!</span>
                    </div>
                    <div className="alert alert-success">
                        <span>Redirecting to Home page...</span>
                    </div>
                </div>}
                <label htmlFor="identifier" className="font-semibold text-base">Email or Username</label>
                <input type="text" id="identifier" name="identifier" placeholder="Enter your email or username" onChange={handleChange} className="p-2 border-2 border-cyan-500  rounded-sm outline-none" required/>

                <label htmlFor="password" className="block font-semibold text-base">Password</label>
                <input type="password" id="password" name="password" placeholder="Enter your password" onChange={handleChange} className="p-2 border-2 border-cyan-500 rounded-sm outline-none" required/>

                <button type="submit" disabled={loading} className="bg-[#f999d3] rounded-sm p-2 mt-6 sm:text-lg hover:bg-[#ee68b8] disabled:opacity-60">{loading?loadingIcon():"Continue"}</button>
            </form>
        </div>
    )
}

export default Login