import {Route , RouterProvider, createBrowserRouter,createRoutesFromElements, Navigate} from "react-router-dom"
import RootLayout from "../src/layout/RootLayout"
import HomeLayout from "../src/layout/HomeLayout"
import AdminRoute from "./admin/auth/AdminRoute.jsx"
import AdminLayout from "./admin/layouts/AdminLayout.jsx"
import AdminDashboard from "./admin/pages/AdminDashboard.jsx"
import AdminBlogs from "./admin/pages/AdminBlogs.jsx"
import AdminUsers from "./admin/pages/AdminUsers.jsx"
import AdminReports from "./admin/pages/AdminReports.jsx"
import AdminSettings from "./admin/pages/AdminSettings.jsx"
import AdminProfile from "./admin/pages/AdminProfile.jsx"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import ForgotPassword from "./pages/ForgotPassword.jsx"
import ResetPassword from "./pages/ResetPassword.jsx"
import About from "./pages/About"
import Blogs from "./pages/Blogs"
import Contact from "./pages/Contact"
import AddBlog from "./pages/AddBlog"
import Profile from "./pages/Profile.jsx"
import BlogDetails from "./pages/BlogDetails"
import EditBlog from "./pages/EditBlog.jsx"
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
          <Route path="blog/:slug/edit" element={<EditBlog />} />
        </Route>

        <Route path="/about" element={<About/>}/>

        <Route path="/blogs" element={<BlogsLayout />}>
          <Route index element={<Blogs />} />
        </Route>

        <Route path="blog/:slug" element={<BlogDetails />} />
        <Route path="/contact" element={<Contact/>}/>
      </Route>
      
      <Route path="/login" element={<Login/>}/>
      <Route path="/register" element={<Register/>}/>
      <Route path="/forgot-password" element={<ForgotPassword/>}/>
      <Route path="/reset-password" element={<ResetPassword/>}/>

      <Route path="/admin" element={<AdminRoute><AdminLayout/></AdminRoute>}>
        <Route index element={<Navigate to="dashboard" replace/>}/>
        <Route path="dashboard" element={<AdminDashboard/>}/>
        <Route path="blogs" element={<AdminBlogs/>}/>
        <Route path="users" element={<AdminUsers/>}/>
        <Route path="reports" element={<AdminReports/>}/>
        <Route path="settings" element={<AdminSettings/>}/>
        <Route path="profile" element={<AdminProfile/>}/>
      </Route>
    </Route>
  ))

  return(
    <RouterProvider router={routes}/>
  )
}

export default App