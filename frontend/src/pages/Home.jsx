import React, { useEffect, useState } from "react";
import { getAllBlogs,getBlogLikeCount } from "../routes/api.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";

const Home=()=>{

    const [blogs,setBlogs] = useState({blogs:[]})
    const featuredBlog = blogs?.blogs[0]
    const [featuredBlogLike,setFeaturedBlogLike] = useState(0)

    useEffect(()=>{
        const handleFetchingBlogs = async()=>{
            try {
                const res = await getAllBlogs(
                //     {
                //     params:{
                //         page:1 , 
                //         limit: 10,
                //         query: "",
                //         author:"",
                //         sortType:"",
                //         sortBy:""
    
                //     }
                // }
            )
                setBlogs(res.data.data)
            } catch (error) {
                console.log("err:" ,error)
            }
        }

        handleFetchingBlogs()
    },[]);
    
    useEffect(()=>{
        
        if(!featuredBlog?._id) return;

        const handleFetchingBlogsLikes = async()=>{
            try{
                const res = await getBlogLikeCount(blogs?.blogs?.[0]._id)
                setFeaturedBlogLike(res.data.data.likedCount)
            }catch(error){
                console.log("err:", error)
            }
        }
        handleFetchingBlogsLikes()
    },[featuredBlog]);

    const blogSkeleton = () =>{
        return(
            <>
            {/* Featured Blog Skeleton */}
            <div className="border rounded-md lg:col-span-2 bg-base-100 shadow-xl">
                
                <div className="skeleton w-full h-52 sm:h-80 rounded-md"></div>

                <div className="flex flex-col gap-6 pb-3 px-5 mt-7">

                <div className="skeleton h-10 w-3/4"></div>

                <div className="skeleton h-5 w-full"></div>
                <div className="skeleton h-5 w-5/6"></div>

                <div className="flex gap-4">
                    <div className="skeleton h-4 w-24"></div>
                    <div className="skeleton h-4 w-20"></div>
                    <div className="skeleton h-4 w-10"></div>
                </div>

                </div>
            </div>

            {/* Featured Posts Skeleton */}
            <div className="flex flex-col w-full">

                <div className="skeleton h-6 w-40"></div>

                <ul className="flex flex-col gap-3 mt-5">

                {[...Array(5)].map((_, index) => (
                    <li key={index} className="border-b-2 border-base-300 py-3 last:border-0">

                    <div className="skeleton h-6 w-5/6"></div>

                    <div className="flex justify-between mt-2">
                        <div className="skeleton h-4 w-24"></div>
                        <div className="skeleton h-4 w-20"></div>
                    </div>

                    </li>
                ))}
                </ul>
            </div>

            <div className="grid col-span-4 gap-2 grid-cols-4">
                {[...Array(4)].map((_,index)=>(
                <div key={index} className="card card-compact bg-base-100 w-full shadow-xl">
                    <div className="skeleton w-full h-36 rounded-md"></div>
                    <div className="card-body">
                        <div className="skeleton h-6 w-5/6"></div>
                        <div className="skeleton h-6 w-5/6"></div>
                        <div className="flex flex-col justify-start text-base-400 mt-2">
                            <div className="skeleton h-4 w-24"></div>
                            <div className="skeleton h-4 w-20"></div>
                        </div>
                    </div>
                </div>
                ))}
            </div>
        </>
        )
    }

    return(
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mx-7 lg:mx-52 my-12">
            {!blogs?.blogs?.length ? blogSkeleton() :
            (<>
            <div className=" card card-compact bg-base-100 shadow-xl  border-base-300 lg:col-span-2">
                <img src={featuredBlog?.image} className="w-full h-52 sm:h-80 object-cover rounded-md" alt="blog image"/>
                <div className="card-body">
                    <p className="card-title text-xl sm:text-4xl lg:text-5xl font-barlow font-medium hover:underline hover:cursor-pointer">{featuredBlog?.title} </p>
                    <p className="text-xs sm:text-lg">{featuredBlog?.content}</p>
                    <div className="flex justify-between gap-3 text-xs sm:text-sm text-base-content/60 font-semibold text-base-400">
                        <div className="flex gap-3">
                            <p>{featuredBlog?.author.fullName}</p>
                            <p>{new Date(featuredBlog?.createdAt).toLocaleDateString()}</p>
                        </div>
                        <span><FontAwesomeIcon icon={faHeart}/>{featuredBlogLike}</span>
                    </div>
                </div>
            </div>
            <div className="flex flex-col w-full">
                <h2 className="text-xl font-semibold  border-b-2 border-[#FF2DAA]">Featured Posts</h2>
                <ul className="flex flex-col gap-3 mt-5">
                {blogs.blogs.slice(1,6).map((blog,_)=>(
                        <li key={blog._id} className="border-b-2 border-base-300 py-3 last:border-0">
                            <p className="text-base sm:text-xl font-barlow font-medium hover:underline hover:cursor-pointer">{blog.title}</p>
                            <div className="flex justify-between text-xs sm:text-sm font-semibold py-2 text-base-content/60">
                                <p>{blog.author.fullName}</p>
                                <p>{new Date(blog.createdAt).toLocaleDateString()}</p>
                            </div>
                        </li>
                ))}
                </ul>
            </div>
            </>)}
            <div className="grid col-span-4 gap-2 grid-cols-4">
                {blogs.blogs.slice(2,6).map((blog,_)=>(
                <div className="card card-compact bg-base-100 w-full shadow-xl">
                    <figure className="px-5 pt-5">
                        <img
                        src={blog.image}
                        alt="Shoes" 
                        className="rounded-xl h-36 w-full object-cover"
                        />
                    </figure>
                    <div className="card-body">
                        <h2 className="card-title text-lg hover:underline hover:cursor-pointer">{blog.title}</h2>
                        <p >{blog.content}</p>
                        <div className="flex flex-col justify-start text-base-content/60 mt-2 font-semibold">
                            <p>{blog.author.fullName}</p>
                            <p>{new Date(blog.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>
                ))}
            </div>

        </div>
    )
}

export default Home

