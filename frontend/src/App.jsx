import {Route , RouterProvider, createBrowserRouter,createRoutesFromElements} from "react-router-dom"
import RootLayout from "../src/layout/RootLayout"
import HomeLayout from "../src/layout/HomeLayout"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"

const App=()=>{
  const routes = createBrowserRouter(createRoutesFromElements(
    <Route path="/" element={<RootLayout/>}>
      <Route path="/" element={<HomeLayout/>}>
        <Route index element={<Home/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
      </Route>
    </Route>
  ))

  return(
    <RouterProvider router={routes}/>
  )
}

export default App