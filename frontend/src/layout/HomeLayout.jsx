import React from "react";
import { Outlet } from "react-router-dom";
import NavBar from "../component/NavBar";

const HomeLayout=()=>{
    return(
        <div>
            <NavBar/>
            <Outlet/>
        </div>
    )
}

export default HomeLayout