import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBarsStaggered, faMagnifyingGlass} from "@fortawesome/free-solid-svg-icons"
import {faAddressBook, faHouse, faNewspaper, faUser} from "@fortawesome/free-regular-svg-icons"
import { NavLink } from "react-router-dom";
import { useAuth } from "./AuthContext.jsx";

const NavBar = ()=>{
    const {user, logout} = useAuth();
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem("theme") === "night" ? "night" : "cupcake";
    });

    useEffect(()=>{
        const savedTheme = localStorage.getItem("theme") || 'cupcake'
        document.documentElement.setAttribute("data-theme",savedTheme)
    },[])

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = (e) => {
        setTheme(e.target.value === "cupcake" ? "night" : "cupcake");
    };

    const themeToggler = ()=>{
        return(
            <div className="dropdown dropdown-end ">
                <div tabIndex={0} role="button" className="btn m-1 shadow-md shadow-base-300">
                    Theme
                    <svg
                    width="12px"
                    height="12px"
                    className="inline-block h-2 w-2 fill-current opacity-60"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 2048 2048">
                    <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path>
                    </svg>
                </div>
                <ul tabIndex={0} className="dropdown-content bg-base-300 rounded-box z-[1] w-40 p-2 shadow-2xl" onChange={(e)=>toggleTheme(e)} >
                    <li>
                    <input
                        type="radio"
                        name="theme-dropdown"
                        className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                        aria-label="Light"
                        value="cupcake" />
                    </li>
                    <li>
                    <input
                        type="radio"
                        name="theme-dropdown"
                        className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                        aria-label="Dark"
                        value="night" />
                    </li>
                </ul>
            </div>
        )
    }

    
    return(
        <div className="flex sticky top-0 z-50 justify-between items-center border-b shadow-md bg-base-100 ">
            <div className="hidden lg:flex justify-between gap-x-5 lg:mx-32  xl:mx-44 w-full">
                <div className="flex gap-5">
                    <picture className="flex justify-center items-center">
                        <img src="/ByteLog.svg" className="h-12" alt="ByteLog logo" />
                    </picture>
                    <ul className=" flex justify-center items-center gap-x-5 text-sm xl:text-lg font-semibold">
                        {
                            [
                                { to:"/", label: "Home"},
                                { to:"/blogs", label: "Blogs"},
                                { to:"/about", label: "About"},
                                { to:"/contact", label: "Contact"},
                            ].map(({to,label})=>(
                                <li key={to}>
                                    <NavLink to={to} className={({ isActive})=> `group relative pb-2 transition-all duration-300 ${isActive? "text-[#FF2DAA]":"text-primary hover:text-[#FF2DAA]"}`}>
                                        {({isActive})=>(
                                        <>
                                            {label}
                                            <span className={`absolute left-0 bottom-0 h-[2px] bg-[#FF2DAA] w-full transform origin-left transition-transform duration-300 ${isActive? "scale-x-100":"scale-x-0 group-hover:scale-x-100"} `}></span>
                                        </>)}
                                    </NavLink>
                                </li>
                            ))
                        }
                    </ul>
                </div>
                <ul className="flex justify-center items-center gap-x-2 py-2 xl:text-xl font-semibold ">
                    <li className=" border-r-2 pr-2">
                        <div className="relative ">
                            <FontAwesomeIcon icon={faMagnifyingGlass} className="text-lg absolute left-3 top-1/2 -translate-y-1/2"/>
                            <input type="search" placeholder="Search..." className="w-full pl-10 pr-2 py-2 rounded-full border bg-base-100 focus:outline-none focus:ring-1 focus:ring-[#FF2DAA] focus:border-[#FF2DAA] transition-all duration-200" />
                        </div>
                    </li>
                    {!user ?<li className="border-2 rounded-md px-2 py-1.5 text-center bg-[#f844b0] text-base-100 hover:bg-[#da2090]"><NavLink to={"/login"}>Login</NavLink></li>:
                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                            <div className="w-10 rounded-full">
                            <img
                                alt="user avatar"
                                src={user.avatar} />
                            </div>
                        </div>
                        <ul
                            tabIndex={0}
                            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-1 w-40 p-2 shadow-md shadow-base-300">
                            <li>
                                <NavLink to="/profile">
                                    Your profile
                                </NavLink>
                            </li>
                            <li>
                                <button onClick={logout}>Log out</button>
                            </li>
                        </ul>
                    </div>
                    }
                    {themeToggler()}
                </ul>
            </div>

            <div className="navbar sticky top-0 z-50 bg-base-100  shadow-sm lg:hidden">
                <div className="drawer lg:drawer-open">

                <input id="mobile-drawer" type="checkbox" className="drawer-toggle" />

                <div className="drawer-content flex flex-col">

                    {/* Navbar */}
                    <div className="navbar bg-base-100 ">
                        <picture>
                            <source srcSet="/ByteLog.svg" media="(min-width: 640px)" />
                            <img src="/WebLogo.png" className="h-12" alt="ByteLog logo" />
                        </picture>

                        <div className="relative lg:hidden  sm:mx-10 flex-1">
                            <FontAwesomeIcon icon={faMagnifyingGlass} className="text-lg absolute left-3 top-1/2 -translate-y-1/2"/>
                            <input type="search" placeholder="Search..." className="w-full pl-10 pr-2 py-2 rounded-full bg-base-100 border focus:outline-none focus:ring-1 focus:ring-[#FF2DAA] focus:border-[#FF2DAA] transition-all duration-200" />
                        </div>

                        <div className="flex-none lg:hidden">
                            <label htmlFor="mobile-drawer" className="btn btn-square btn-ghost">
                            <FontAwesomeIcon icon={faBarsStaggered}/>
                            </label>
                        </div>
                    </div>
                </div>


                {/* Sidebar */}
                <div className="drawer-side z-40">
                    <label htmlFor="mobile-drawer" className="drawer-overlay"></label>

                    <ul className="menu p-4 gap-1 w-72 min-h-full bg-base-100 text-base-content">

                    <li className="text-lg font-bold mb-4">Menu</li>
                    {[
                        { to:"/",icon:faHouse,label:"Home"},
                        { to:"/blogs",icon:faNewspaper,label:"Blogs"},
                        { to:"/about",icon:faUser,label:"About Me"},
                        { to:"/contact",icon:faAddressBook,label:"Contact"},
                    ].map(({to,icon,label})=>(
                    <li className="text-base" key={to}>
                        <NavLink to={to}>
                        <FontAwesomeIcon icon={icon}/> {label}
                        </NavLink>
                    </li>
                    ))}

                    {!user ? (
                        <li className="mt-4">
                        <NavLink to="/login" className="btn btn-primary">
                            Login
                        </NavLink>
                        </li>
                    ) : (
                        <> 
                            <div className="flex flex-col mt-5">
                                <div className="flex justify-start items-center gap-3 mx-5">
                                    <div className="avatar">
                                        <div className="ring-primary ring-offset-base-100 h-10 rounded-full ring ring-offset-2">
                                            <img src={user.avatar}/>
                                        </div>
                                    </div>

                                    <ul className="text-base">
                                        <li className="text-primary font-semibold">{user.fullName}</li>
                                        <li className="text-base-400">{user.email}</li>
                                    </ul>
                                </div>
                                <ul className="menu gap-1 p-4 text-base ">
                                    <li>
                                        <NavLink to="/profile">
                                            Your profile
                                        </NavLink>
                                    </li>
                                    <li>
                                        <button onClick={logout}>Log out</button>
                                    </li>
                                </ul>
                            </div>
                        </>
                    )}
                    {themeToggler()}
                    </ul>
                </div>
                </div>
            </div>
        </div>
    )
}


export default NavBar