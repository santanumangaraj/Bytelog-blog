import {Route , RouterProvider, createBrowserRouter,createRoutesFromElements} from "react-router-dom"
import RootLayout from "../src/layout/RootLayout"
import HomeLayout from "../src/layout/HomeLayout"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import About from "./pages/About"
import Blogs from "./pages/Blogs"
import Contact from "./pages/Contact"

const App=()=>{
  const routes = createBrowserRouter(createRoutesFromElements(
    <Route path="/" element={<RootLayout/>}>
      <Route path="/" element={<HomeLayout/>}>
        <Route index element={<Home/>}/>
        <Route path="/about" element={<About/>}/>
        <Route path="/blogs" element={<Blogs/>}/>
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