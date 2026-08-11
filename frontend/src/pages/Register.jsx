import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../routes/api.js";
import { getApiErrorMessage, getFieldErrors } from "../components/addBlog/apiError.js";
import PasswordField from "../components/common/PasswordField.jsx";

const Register=()=>{
    const [err,setErr] = useState("")
    const [fieldErrors,setFieldErrors] = useState({})
    const [loading,setLoading] = useState(false)
    const [success,setSuccess] = useState(false)
    const navigate = useNavigate()
    const [form,setForm] = useState({
        fullName:"",
        email:"",
        username:"",
        password:"",
        confirmPassword:"",
    })
    const [avatarFile,setAvatarFile] = useState(null)

    const setField = (key, value) => {
        setForm((prev) => ({ ...prev, [key]: value }))
        setFieldErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev))
    }

    const handleChange=(e)=>{
        setField(e.target.name, e.target.value)
    }

    const handleFileChange = (e)=>{
        setAvatarFile(e.target.files?.[0] ?? null)
        setFieldErrors((prev) => (prev.avatar ? { ...prev, avatar: undefined } : prev))
    }

    const validate = () => {
        const next = {}
        if (!form.fullName.trim()) next.fullName = "Full name is required."
        if (!form.email.trim()) next.email = "Email is required."
        if (!form.username.trim()) next.username = "Username is required."
        if (!avatarFile) next.avatar = "Please select an avatar image."
        if (!form.password) next.password = "Password is required."
        else if (form.password.length < 8) next.password = "Password must be at least 8 characters."
        if (!form.confirmPassword) next.confirmPassword = "Confirm your password."
        else if (form.confirmPassword !== form.password) next.confirmPassword = "Passwords do not match."
        setFieldErrors(next)
        return Object.keys(next).length === 0
    }

    const handleSubmit =async (e)=>{
        e.preventDefault();
        setErr("")
        if (!validate()) return
        setLoading(true)


        try{
            const formData = new FormData();

            formData.append("fullName",form.fullName)
            formData.append("email",form.email)
            formData.append("username",form.username)
            formData.append("password",form.password)
            formData.append("avatar",avatarFile)

            await registerUser(formData)
            setSuccess(true)
            setTimeout(()=>{
                navigate("/login")
                setSuccess(false)
            },2000)
        }catch(err){
            const serverFieldErrors = getFieldErrors(err)
            if (Object.keys(serverFieldErrors).length) setFieldErrors((prev) => ({ ...prev, ...serverFieldErrors }))
            setErr(getApiErrorMessage(err))
            setSuccess(false)
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
                    <span>{err}</span>
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
                {fieldErrors.fullName && <p className="text-xs font-medium text-error">{fieldErrors.fullName}</p>}

                <label htmlFor="email" className="font-semibold text-base">Email:</label>
                <input type="email" id="email" name="email" placeholder="Enter your Email" className="p-2 border-2 border-cyan-500  rounded-md outline-none" onChange={handleChange} required/>
                {fieldErrors.email && <p className="text-xs font-medium text-error">{fieldErrors.email}</p>}

                <label htmlFor="username" className="font-semibold text-base">Username:</label>
                <input type="text" id="username" name="username" placeholder="Enter your Username" className="p-2 border-2 border-cyan-500  rounded-md outline-none" onChange={handleChange} required/>
                {fieldErrors.username && <p className="text-xs font-medium text-error">{fieldErrors.username}</p>}

                <label htmlFor="avatar" className="font-semibold text-base">Upload a avatar file:</label>
                <input type="file" accept="image/*" className="file-input file-input-bordered file-input-sm w-full max-w-xs" id="avatar" name="avatar" onChange={handleFileChange}/>
                {fieldErrors.avatar && <p className="text-xs font-medium text-error">{fieldErrors.avatar}</p>}

                <PasswordField
                    id="password"
                    label="Password:"
                    autoComplete="new-password"
                    value={form.password}
                    onChange={(v) => setField("password", v)}
                    error={fieldErrors.password}
                />

                <PasswordField
                    id="confirmPassword"
                    label="Confirm Password:"
                    autoComplete="new-password"
                    value={form.confirmPassword}
                    onChange={(v) => setField("confirmPassword", v)}
                    error={fieldErrors.confirmPassword}
                />

                <button type="submit" disabled={loading} className="bg-[#f999d3] rounded-md p-2 mt-6 text-base sm:text-lg hover:bg-[#ee68b8] disabled:opacity-60">
                    {loading?<span className="loading loading-bars bg-white loading-lg"></span>:"Create"}

                </button>
            </form>
            <p className="text-sm sm:text-base">Have an Account?<a className="text-cyan-500 cursor-pointer font-semibold" onClick={()=>navigate("/login")}>Sign in</a></p>
        </div>
    )
}


export default Register
