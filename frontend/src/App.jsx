import {Route , RouterProvider, createBrowserRouter,createRoutesFromElements} from "react-router-dom"
import RootLayout from "../src/layout/RootLayout"
import HomeLayout from "../src/layout/HomeLayout"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import About from "./pages/About"
import Blogs from "./pages/Blogs"
import Contact from "./pages/Contact"
import AddBlog from "./pages/AddBlog"
import Profile from "./pages/Profile.jsx"
import BlogDetails from "./pages/BlogDetails"
import BlogsLayout from "./layout/BlogsLayout"
import ProtectedRoute from "./components/ProtectedRoute.jsx"
import ErrorBoundary from "./components/ErrorBoundary.jsx"

const App=()=>{
  const routes = createBrowserRouter(createRoutesFromElements(
    <Route path="/" element={<RootLayout/>} errorElement={<ErrorBoundary />}>
      <Route path="/" element={<HomeLayout/>}>
        <Route index element={<Home/>}/>
        <Route element={<ProtectedRoute/>}>
          <Route path="/add" element={<AddBlog/>}/>
          <Route path="/profile" element={<Profile/>}/>
        </Route>
        <Route path="/about" element={<About/>}/>
        <Route path="/blogs" element={<BlogsLayout />}>
          <Route index element={<Blogs />} />
          {/* <Route path="id/:blogId" element={<BlogDetails />} /> */}
          <Route path="s/:slug" element={<BlogDetails />} />
        </Route>

        <Route path="/contact" element={<Contact/>}/>
      </Route>
      <Route path="/login" element={<Login/>}/>
      <Route path="/register" element={<Register/>}/>
    </Route>
  ))

  return(
    <RouterProvider router={routes}/>
  )
}

export default App