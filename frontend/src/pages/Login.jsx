import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../routes/api.js";

const Login=()=>{
    const [err,setErr] = useState("")
    const [loading,setLoading] = useState(false)
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

        try{
            const res = await loginUser(form)
            localStorage.setItem("token",res.data.data.accessToken)
            navigate("/")
        }catch(err){
            setErr(err.response?.data?.message || "Login failed")
        }finally{
            setLoading(false)
        }
    }

    return(
        <div className="flex flex-col justify-center items-center">
            <div className="text-center flex flex-col gap-2 my-10">
                <img src="/ByteLog.svg" className="h-16 sm:h-20 md:h-24 mx-auto" alt="bytelog"/>
                <h3 className="text-2xl sm:text-3xl font-semibold">Sign in</h3>
                <p className="text-sm sm:text-base">or <a onClick={()=>navigate("/register")} className="text-cyan-500 cursor-pointer hover:underline">Create an account</a></p>
            </div>npm 
            <form className="w-full max-w-sm sm:max-w-md flex flex-col gap-3 py-4 px-4" onSubmit={handleSubmit}>
                {err && 
                <p className=" border-2 border-red-300 p-3 bg-red-100 text-sm rounded">
                    {err}
                </p>
                }
                <label htmlFor="identifier" className="font-semibold text-base">Email or Username</label>
                <input type="text" id="identifier" name="identifier" placeholder="Enter your email or username" onChange={handleChange} className="p-2 border-2 border-cyan-500  rounded-sm outline-none" required/>

                <label htmlFor="password" className="block font-semibold text-base">Password</label>
                <input type="password" id="password" name="password" placeholder="Enter your password" onChange={handleChange} className="p-2 border-2 border-cyan-500 rounded-sm outline-none" required/>

                <button type="submit" disabled={loading} className="bg-[#f999d3] rounded-sm p-2 mt-6 text-base sm:text-lg hover:bg-[#ee68b8] disabled:opacity-60">Continue</button>
            </form>
        </div>
    )
}

export default Login