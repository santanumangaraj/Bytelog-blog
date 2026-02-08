import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../routes/api";

const Register=()=>{
    const [err,setErr] = useState("")
    const [loading,setLoading] = useState(false)
    const navigate = useNavigate()
    const [form,setForm] = useState({
        fullName:"",
        email:"",
        username:"",
        password:""
    })
    const [avatarFile,setAvatarFile] = useState({
        avatar:null
    })

    const handleChange=(e)=>{
        setForm({
            ...form,[e.target.name]:e.target.value
        })
    }

    const handleFileChange = (e)=>{
        setAvatarFile({...File,[e.target.name]:e.target.files[0]})
    }

    const handleSubmit =async (e)=>{
        e.preventDefault();
        setErr("")
        setLoading(true)

        try{
            const formData = new FormData();

            formData.append("fullName",form.fullName)
            formData.append("email",form.email)
            formData.append("username",form.username)
            formData.append("password",form.password)

            if(avatarFile.avatar){
                formData.append("avatar",avatarFile.avatar)
            }

            const res = await registerUser(formData)
            navigate("/login")
            console.log(res)
        }catch(err){
            setErr(err.response?.data.message || "Signup failed")
        }finally{
            setLoading(false)
        }
    }
    return(
        <div className="flex flex-col justify-center items-center">
            <div className="text-center flex flex-col gap-2 my-10">
                <img src="/ByteLog.svg" className="h-16 sm:h-20 md:h-20 mx-auto"/>
                <h3 className="text-2xl sm:text-3xl font-semibold">Create your Free account</h3>
            </div>
            <form className="w-full max-w-sm sm:max-w-md flex flex-col gap-3 py-4 px-4" onSubmit={handleSubmit} >
                {
                    err &&
                    <p className=" border-2 border-red-300 p-3 bg-red-100 text-sm rounded">
                        {err}
                    </p>
                }
                <label htmlFor="fullName" className="font-semibold text-base">fullName:</label>
                <input type="text" id="fullName" name="fullName" placeholder="Enter your Full name" className="p-2 border-2 border-cyan-500  rounded-sm outline-none" onChange={handleChange} required/>

                <label htmlFor="email" className="font-semibold text-base">Email:</label>
                <input type="email" id="email" name="email" placeholder="Enter your Email" className="p-2 border-2 border-cyan-500  rounded-sm outline-none" onChange={handleChange} required/>

                <label htmlFor=" username" className="font-semibold text-base">Username:</label>
                <input type="text" id="username" name="username" placeholder="Enter your Username" className="p-2 border-2 border-cyan-500  rounded-sm outline-none" onChange={handleChange} required/>

                <label htmlFor="avatar" className="font-semibold text-base">Upload a avatar file:</label>
                <input type="file" id="avatar" name="avatar" onChange={handleFileChange}/>

                <label htmlFor="password" className="font-semibold text-base">Password:</label>
                <input type="password" id="password" name="password" placeholder="Enter your Password" className="p-2 border-2 border-cyan-500  rounded-sm outline-none" onChange={handleChange} required/>

                <button type="submit" disabled={loading} className="bg-[#f999d3] rounded-sm p-2 mt-6 text-base sm:text-lg hover:bg-[#ee68b8] disabled:opacity-60">Create</button>
            </form>
            <p className="text-sm sm:text-base">Have an Account?<a className="text-cyan-500 cursor-pointer font-semibold" onClick={()=>navigate("/login")}>Sign in</a></p>
        </div>
    )
}


export default Register