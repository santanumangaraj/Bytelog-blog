import { Outlet } from "react-router-dom";

const BlogsLayout = () => {
    return (
        <>
        {/* shared blog layout/header if you have one */}

        <Outlet />
        </>
    );
};

export default BlogsLayout;