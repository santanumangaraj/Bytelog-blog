import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../routes/api";

const Register=()=>{
    const [err,setErr] = useState("")
    const [loading,setLoading] = useState(false)
    const [success,setSuccess] = useState(false)
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
        setSuccess(true)

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
            setTimeout(()=>{
                navigate("/")
                setSuccess(false)
            },2000)
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
                    <div role="alert" className="flex alert alert-warning">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span>Warning: {err}!</span>
                </div>
                }
                {success &&
                <div className="toast toast-top toast-start">
                    <div className="alert alert-info">
                        <span>Succssfully Register!!</span>
                    </div>
                    <div className="alert alert-success">
                        <span>Redirecting to Login page...</span>
                    </div>
                </div>}
                <label htmlFor="fullName" className="font-semibold text-base">Full Name:</label>
                <input type="text" id="fullName" name="fullName" placeholder="Enter your Full name" className="p-2 border-2 border-cyan-500  rounded-md outline-none" onChange={handleChange} required/>

                <label htmlFor="email" className="font-semibold text-base">Email:</label>
                <input type="email" id="email" name="email" placeholder="Enter your Email" className="p-2 border-2 border-cyan-500  rounded-md outline-none" onChange={handleChange} required/>

                <label htmlFor=" username" className="font-semibold text-base">Username:</label>
                <input type="text" id="username" name="username" placeholder="Enter your Username" className="p-2 border-2 border-cyan-500  rounded-md outline-none" onChange={handleChange} required/>

                <label htmlFor="avatar" className="font-semibold text-base">Upload a avatar file:</label>
                <input type="file" className="file-input file-input-bordered file-input-sm w-full max-w-xs" id="avatar" name="avatar" onChange={handleFileChange}/>

                <label htmlFor="password" className="font-semibold text-base">Password:</label>
                <input type="password" id="password" name="password" placeholder="Enter your Password" className="p-2 border-2 border-cyan-500  rounded-md outline-none" onChange={handleChange} required/>

                <button type="submit" disabled={loading} className="bg-[#f999d3] rounded-md p-2 mt-6 text-base sm:text-lg hover:bg-[#ee68b8] disabled:opacity-60">
                    {loading?<span className="loading loading-bars bg-white loading-lg"></span>:"Create"}

                </button>
            </form>
            <p className="text-sm sm:text-base">Have an Account?<a className="text-cyan-500 cursor-pointer font-semibold" onClick={()=>navigate("/login")}>Sign in</a></p>
        </div>
    )
}


export default Register