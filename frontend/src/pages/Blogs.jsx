import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import React from "react";
import Home from "./Home";
import { useState } from "react";
import { useEffect } from "react";
import { getAllBlogs } from "../routes/api";
import blogTitleBg from "../assets/blogTitleBG.jpg";


const Blogs = ()=>{
    const [blogs,setBlogs] = useState({
        pagination:{},
        rows:[]
    })
    const [loading,setLoading] = useState(false)
        // const [featuredBlogLike,setFeaturedBlogLike] = useState(0)
    const [form,setForm] = useState({
            page:1,
            limit:10,
            query:"",
            sortBy:"createdAt",
            sortType:"desc"
        })
    
    const handleChange = (e)=>{
        setForm({
            ...form,[e.target.name]:e.target.value
        })
    }

    const handleReset = ()=>{
        setForm((prev)=>({
            ...prev,
            query:"",
            sortBy:"createdAt",
            sortType:"desc"
        }))
    }

    useEffect(()=>{
        const handleFetchingBlogs = async()=>{
            try {
                setLoading(true)
                const res = await getAllBlogs(form)
                setBlogs({
                    pagination:res.data.data.pagination,
                    rows:res.data.data.rows
                })
            } catch (error) {
                console.log("err:" ,error)
            }finally{
                setLoading(false)
            }
        }
        handleFetchingBlogs()
    },[form]);

    const blogSkeleton = ()=>{
        return (
            <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mx-7 lg:mx-32 xl:mx-44 my-12">
            {Array.from({ length: 6 }).map((_, index) => (
                <div
                key={index}
                className="card card-compact bg-base-100 shadow-xl"
                >
                <div className="px-5 pt-5">
                    <div className="skeleton h-36 w-full rounded-xl"></div>
                </div>

                <div className="card-body space-y-3">
                    <div className="skeleton h-6 w-3/4"></div>

                    <div className="space-y-2">
                    <div className="skeleton h-4 w-full"></div>
                    <div className="skeleton h-4 w-5/6"></div>
                    <div className="skeleton h-4 w-2/3"></div>
                    </div>

                    <div className="mt-4 space-y-2">
                    <div className="skeleton h-4 w-1/2"></div>
                    <div className="skeleton h-4 w-1/3"></div>
                    </div>
                </div>
                </div>
            ))}
            </div>

            <div className="join justify-center my-4">
            {Array.from({ length: 5 }).map((_, index) => (
                <div
                key={index}
                className="join-item skeleton h-10 w-10 rounded-md"
                ></div>
            ))}
            </div>
            </>
        )
    }
        
    return(
        <div className="flex flex-col justify-center items-center text-3xl">
            <div className="hero min-h-[35rem] bg-base-200 "
            style={{
                backgroundImage:
                `url(${blogTitleBg})`,
            }}>
                <div className="hero-content text-center text-primary">
                    <div className="max-w-md">
                        <h1 className="text-5xl font-bold ">Explore Blogs</h1>
                        <p className="py-6">
                            Discover articles from developers around the world..
                        </p>
                    </div>
                </div>
            </div>
            <div className="flex flex-wrap items-center gap-3 p-3 bg-base-100  rounded-lg shadow-md my-3">

            {/* Search */}
            <div className="relative flex-1 min-w-[220px]">
                <FontAwesomeIcon
                icon={faMagnifyingGlass}
                className="absolute text-lg left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                type="search"
                name="query"
                onChange={handleChange}
                placeholder="Search..."
                className="input input-bordered w-full pl-10 pr-2  focus:border-[#FF2DAA] focus:outline-none focus:ring-1 focus:ring-[#FF2DAA]"
                />
            </div>

            {/* Sort Field */}
            <select
                defaultValue="" name="sortBy"
                className="select select-bordered w-40" onChange={handleChange}
            >
                <option value="" >
                Sort By
                </option>
                <option value="createdAt">Created At</option>
                <option value="publishedAt">Published At</option>
                <option value="views">Views</option>
            </select>

            {/* Sort Order */}
            <select
                defaultValue="" name="sortType"
                className="select select-bordered w-32" onChange={handleChange}
            >
                <option value="" disabled>
                Order
                </option>
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
            </select>

            {/* Reset Button */}
            <button className="btn btn-outline btn-primary" onClick={handleReset}>
                Reset
            </button>

            </div>

            {/* home section */}{loading ? blogSkeleton():
            (<>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mx-7 lg:mx-32 xl:mx-44 my-12">
                {blogs.rows.map((blog)=>(
                <div key={blog.id} className="card card-compact bg-base-100 shadow-xl">
                    <figure className="px-5 pt-5">
                        <img
                        src={blog.coverImageUrl}
                        alt="Shoes" 
                        className="rounded-xl h-36 w-full object-cover"
                        />
                    </figure>
                    <div className="card-body">
                        <h2 className="card-title text-lg hover:underline hover:cursor-pointer">{blog.title}</h2>
                        <p >{blog.excerpt}</p>
                        <div className="flex flex-col justify-start text-base-content/60 mt-2 font-semibold">
                            <p>{blog.authorDetails.fullName}</p>
                            <p>{new Date(blog.createdAt).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            })}</p>
                        </div>
                    </div>
                </div>))}
            </div>

            <div className="join justify-center my-2">
                {
                    Array.from(
                        {length: blogs?.pagination?.totalPages || 0},
                        (_,index)=>{
                            const page = index + 1;

                            return (
                                <button key={page} name="page" value={page} className={`join-item btn ${page === blogs.pagination?.currentPage? "btn-active": ""}`}
                                onClick={handleChange}>
                                    {page}
                                </button>
                            )
                        }
                    )
                }
            </div>
            </>)
            
            }
        </div>
    )
}

export default Blogs