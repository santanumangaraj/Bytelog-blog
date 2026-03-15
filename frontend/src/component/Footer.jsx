import React from "react";

const Footer = ()=>{
    return(
        <footer className="footer bg-base-200 text-base-content p-10">
            <aside>
                <img src="/Bytelog-logo.png" className="h-20" alt="ByteLog logo" />
                <p className="footer-title">Providing Blogs On Tech,Market,Public</p>
            </aside>
            <nav>
                <h6 className="footer-title">Company</h6>
                <a href="/about" className="link link-hover">About me</a>
                <a href="/contact" className="link link-hover">Contact</a>
                <a href="/blogs" className="link link-hover">Blogs</a>
            </nav>
            <nav>
                <h6 className="footer-title">Legal</h6>
                <a className="link link-hover">Terms of use</a>
                <a className="link link-hover">Privacy policy</a>
                <a className="link link-hover">Cookie policy</a>
            </nav>
            <nav>
                <h6 className="footer-title">Social</h6>
                <div className="grid grid-flow-col gap-4">
                <a href="https://github.com/santanumangaraj" target="_blank">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        className="fill-current">
                        <path d="M12 .5C5.73.5.99 5.24.99 11.51c0 4.87 3.15 9 7.52 10.46.55.1.75-.24.75-.53 0-.26-.01-1.13-.02-2.05-3.06.66-3.7-1.3-3.7-1.3-.5-1.25-1.22-1.58-1.22-1.58-1-.68.08-.67.08-.67 1.11.08 1.7 1.14 1.7 1.14.98 1.68 2.58 1.19 3.21.91.1-.71.38-1.19.69-1.46-2.44-.28-5.01-1.22-5.01-5.43 0-1.2.43-2.18 1.14-2.95-.11-.28-.49-1.41.11-2.94 0 0 .93-.3 3.05 1.13a10.58 10.58 0 0 1 5.56 0c2.12-1.43 3.05-1.13 3.05-1.13.6 1.53.22 2.66.11 2.94.71.77 1.14 1.75 1.14 2.95 0 4.22-2.57 5.14-5.02 5.41.39.34.74 1.01.74 2.03 0 1.47-.01 2.65-.01 3.01 0 .29.2.64.76.53 4.36-1.46 7.5-5.59 7.5-10.46C23.01 5.24 18.27.5 12 .5z"/>
                    </svg>
                </a>
                <a href="https://x.com/SMangaraj09?t=lk1ENaO0Vu9oMmpRwviqPw&s=08" target="_blank">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        className="fill-current">
                        <path d="M18.244 2H21.5l-7.19 8.21L22.5 22h-6.41l-5.02-6.56L5.4 22H2.14l7.69-8.78L1.5 2h6.59l4.54 5.96L18.244 2zm-1.13 18h1.8L7.12 3.9H5.18L17.114 20z"/>
                    </svg>
                </a>
                <a href="https://www.facebook.com/share/1EC6LDL3RW/" target="_blank">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        className="fill-current">
                        <path
                            d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path>
                    </svg>
                </a>
                <a href="https://www.instagram.com/santanu_.x09/profilecard/?igsh=MTR3aXVieWg1d2JrNg==" target="_blank" >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        className="fill-current">
                        <path d="M7.75 2C4.57 2 2 4.57 2 7.75v8.5C2 19.43 4.57 22 7.75 22h8.5C19.43 22 22 19.43 22 16.25v-8.5C22 4.57 19.43 2 16.25 2h-8.5zm0 2h8.5C18.01 4 20 5.99 20 7.75v8.5C20 18.01 18.01 20 16.25 20h-8.5C5.99 20 4 18.01 4 16.25v-8.5C4 5.99 5.99 4 7.75 4zm9.25 1.5a1.25 1.25 0 1 0 .001 2.501A1.25 1.25 0 0 0 17 5.5zM12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6z"/>
                    </svg>
                </a>
                <a href="www.linkedin.com/in/santanudev" target="_blank">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        className="fill-current">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.036-1.849-3.036-1.851 0-2.134 1.445-2.134 2.939v5.666H9.356V9h3.414v1.561h.049c.476-.9 1.637-1.849 3.37-1.849 3.601 0 4.267 2.37 4.267 5.455v6.285zM5.337 7.433a2.063 2.063 0 1 1 0-4.126 2.063 2.063 0 0 1 0 4.126zM7.119 20.452H3.553V9h3.566v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                </a>
                </div>
            </nav>

        </footer>
    )
}

export default Footer