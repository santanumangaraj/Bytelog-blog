import React from "react";
import {useNavigate} from "react-router-dom"

const Home=()=>{
    const navigate = useNavigate();
    return(
        <div>
            <h2>Welcome to ByteLog - A Public blog website</h2>
            <button onClick={()=>navigate("/Login")} className="border-2 px-2 py-3 bg-slate-500 rounded-md">Login</button>
        </div>
    )
}

export default Home