import React from "react";
import { Outlet } from "react-router-dom";
import NavBar from "../component/NavBar";

const RootLayout = ()=>{
    return(
        <div>
            <Outlet/>
        </div>
    )
}

export default RootLayout