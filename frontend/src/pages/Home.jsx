import React from "react";
import {useNavigate} from "react-router-dom"
import NavBar from "../component/NavBar";

const Home=()=>{
    const navigate = useNavigate();
    return(
        <div>
            <h2 className="items-center text-3xl mt-32">Welcome to ByteLog - A Public blog website</h2>
        </div>
    )
}

export default Home