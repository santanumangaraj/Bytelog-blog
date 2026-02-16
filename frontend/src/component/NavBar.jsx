import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faAngleRight , faArrowRightToBracket, faBarsStaggered, faMagnifyingGlass, faXmark} from "@fortawesome/free-solid-svg-icons"
import {faAddressBook, faHouse, faNewspaper, faUser} from "@fortawesome/free-regular-svg-icons"
import { NavLink } from "react-router-dom";
import { useAuth } from "./AuthContext.jsx";

const NavBar = ()=>{
    const [showBar,setShowBar] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const {user, logout} = useAuth();

    return(
        <div className="flex sticky top-0 justify-between items-center  border-2 shadow-md">
            {!showBar && (
            <picture>
                <source srcSet="/ByteLog.svg" media="(min-width: 640px)" />
                <img src="/WebLogo.png" className="h-12" alt="ByteLog logo" />
            </picture>
            )}
            <div className="hidden lg:flex justify-between gap-x-5 mx-8 w-full">
                <ul className=" flex justify-center items-center gap-x-7 text-lg font-semibold">
                    {
                        [
                            { to:"/", label: "Home"},
                            { to:"/blogs", label: "Blogs"},
                            { to:"/about", label: "About me"},
                            { to:"/contact", label: "Contact"},
                        ].map(({to,label})=>(
                            <li key={to}>
                                <NavLink to={to} className={({ isActive})=> `group relative pb-2 transition-all duration-300 ${isActive? "text-[#FF2DAA]":"text-gray-700 hover:text-[#FF2DAA]"}`}>
                                    {({isActive})=>(
                                    <>
                                        {label}
                                        <span className={` absolute left-0 bottom-0 h-[2px] bg-[#FF2DAA] w-full transform origin-left transition-transform duration-300 ${isActive? "scale-x-100":"scale-x-0 group-hover:scale-x-100"} `}></span>
                                    </>)}
                                </NavLink>
                            </li>
                        ))}
                </ul>
                <ul className="flex justify-center items-center gap-x-2 py-2 text-xl  font-semibold">
                    <li className=" border-r-2 pr-2">
                        <div className="relative ">
                            <FontAwesomeIcon icon={faMagnifyingGlass} className="text-lg absolute left-3 top-1/2 -translate-y-1/2"/>
                            <input type="search" placeholder="Search..." className="w-full pl-10 pr-2 py-2 rounded-full border focus:outline-none focus:ring-1 focus:ring-[#FF2DAA] focus:border-[#FF2DAA] transition-all duration-200" />
                        </div>
                    </li>
                    {!user ?<li className="border-2 rounded-md px-2 py-1.5 text-center bg-[#f844b0] text-[#6fd6dc] hover:bg-[#da2090]"><NavLink to={"/login"}>Log in</NavLink></li>:
                    <li><img src={user.avatar} onClick={()=>setShowProfileMenu(!showProfileMenu)} className="shadow-xl rounded-3xl h-12 z-40"/>
                    {showProfileMenu &&(
                        <div className="fixed top-16 right-12 py-2 shadow-xl border rounded-xl bg-white ">
                            <nav className="flex flex-col text-2xl shadow-sm  font-semibold ">
                                <NavLink to="" onClick={() => setShowBar(false)} className="flex justify-between items-center px-6 py-2 text-gray-500 text-xl hover:text-white hover:bg-slate-400">
                                <div className="flex justify-center items-center gap-x-1 font-semibold">
                                    Your profile
                                </div>
                            </NavLink>
                            <button type="reset" onClick={logout} className="flex justify-between items-center text-xl font-semibold px-6 py-2 text-gray-500 hover:text-white hover:bg-slate-400">Log out</button>
                            </nav>
                        </div>
                    )}
                    </li>
                    }
                </ul>
            </div>

            {/* Smaller Screen */}
            {!showBar && <div className="relative lg:hidden mx-5 my-2 sm:mx-10 flex-1">
                <FontAwesomeIcon icon={faMagnifyingGlass} className="text-lg absolute left-3 top-1/2 -translate-y-1/2"/>
                <input type="search" placeholder="Search..." className="w-full pl-10 pr-2 py-2 rounded-full border focus:outline-none focus:ring-1 focus:ring-[#FF2DAA] focus:border-[#FF2DAA] transition-all duration-200" />
            </div>}

            <button onClick={()=>setShowBar(true)} className="lg:hidden text-2xl mr-2"><FontAwesomeIcon icon={faBarsStaggered}/></button>

            {showBar && (
            <div className="fixed inset-0 z-50 bg-white flex flex-col border-2 lg:hidden">
                
                {/* Top bar */}
                <div className="flex justify-between items-center px-2 py-3 gap-x-3 border-b">
                    <picture>
                        <source srcSet="/ByteLog.svg" media="(min-width: 640px)" />
                        <img src="/WebLogo.png" className="h-12" alt="ByteLog logo" />
                    </picture>
                    <div className="relative lg:hidden  sm:mx-10 flex-1">
                        <FontAwesomeIcon icon={faMagnifyingGlass} className="text-lg absolute left-3 top-1/2 -translate-y-1/2"/>
                        <input type="search" placeholder="Search..." className="w-full pl-10 pr-2 py-2 rounded-full border focus:outline-none focus:ring-1 focus:ring-[#FF2DAA] focus:border-[#FF2DAA] transition-all duration-200" />
                    </div>

                    <button onClick={() => setShowBar(false)} className="text-2xl border-2 rounded-md shadow-md transition-all duration-300 hover:bg-gray-200 ">
                        <FontAwesomeIcon icon={faXmark}/>
                    </button>
                </div>

                {/* Menu */}.
                <nav className="flex flex-col gap-y-5 mx-4 py-5 text-2xl border-b-2 font-semibold ">
                    {[
                        { to:"/",icon:faHouse,label:"Home"},
                        { to:"/blogs",icon:faNewspaper,label:"Blogs"},
                        { to:"/about",icon:faUser,label:"About Me"},
                        { to:"/contact",icon:faAddressBook,label:"Contact"},
                    ].map(({to,icon,label})=>(
                        <NavLink key={to} to={to} onClick={() => setShowBar(false)} className={({isActive})=>`group transition-all duration-300 py-3 px-3 flex justify-between items-center rounded-sm ${isActive?"bg-[#84f4f8] text-[#0c7b7f] border-l-[6px] shadow-sm shadow-gray-500 border-[#00b4bb]":" text-gray-500 border shadow-xl hover:text-white hover:bg-gray-300 hover:border-l-[6px] hover:border-gray-400"}`}>
                            <div className="flex justify-center items-center gap-x-1">
                                <FontAwesomeIcon icon={icon} className="text-xl"/>
                                {label}
                            </div>
                            <FontAwesomeIcon icon={ faAngleRight } />
                        </NavLink>
                    ))}
                </nav>

                {
                !user ? (
                    <NavLink to="/login" onClick={() => setShowBar(false)} className={({isActive})=>`group transition-all duration-300 py-3 px-3 my-5 mx-4 text-2xl font-semibold flex justify-between items-center rounded-sm ${isActive?"bg-[#84f4f8] text-[#0c7b7f] border-l-[6px] shadow-sm shadow-gray-500 border-[#00b4bb]":" text-gray-500 border shadow-xl hover:text-white hover:bg-gray-300 hover:border-l-[6px] hover:border-gray-400"}`}>
                            <div className="flex justify-center items-center gap-x-1">
                                <FontAwesomeIcon icon={faArrowRightToBracket} className="text-xl"/>
                                Login
                            </div>
                            <FontAwesomeIcon icon={ faAngleRight} />
                    </NavLink>
                ):
                (<div className="flex flex-col mt-5  ">
                    <div className="flex justify-start items-center gap-3 mx-5">
                        <img src={user.avatar} className="shadow-xl rounded-3xl h-12 "/>

                        <ul className=" sm:text-lg">
                            <li className="text-[#FF2DAA] font-semibold">{user.fullName}</li>
                            <li className="text-gray-500">{user.email}</li>
                        </ul>
                    </div>
                    <NavLink to="" onClick={() => setShowBar(false)} className="flex justify-between items-center px-6 py-2 mt-3 text-gray-500 text-xl hover:text-white hover:bg-slate-400">
                            <div className="flex justify-center items-center gap-x-1 font-semibold">
                                Your profile
                            </div>
                    </NavLink>
                    <button type="reset" onClick={logout} className="flex justify-between items-center text-xl font-semibold px-6 py-2 text-gray-500 hover:text-white hover:bg-slate-400">Log out</button>
                </div>)
                }

            </div>
            )}
        </div>
        
    )
}


export default NavBar