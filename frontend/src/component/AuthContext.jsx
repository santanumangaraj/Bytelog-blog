import { createContext , useContext , useState  } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children })=>{
    
    const [user, setUser] = useState(()=>{
        try {
            const storedUser = localStorage.getItem("user");
            
            if(!storedUser || storedUser == "undefined"){
                return null;
            }

            return JSON.parse(storedUser)
        } catch (err) {
            return null;
        }
    })

    const login = (data)=>{
        localStorage.setItem("token",data.data.accessToken)
        localStorage.setItem("user", JSON.stringify(data.data.user));
        setUser(data.data.user)
        return user
    };

    const logout = ()=>{
        localStorage.removeItem("token")
        localStorage.removeItem("user");
        setUser(null);
    };

    return(
        <AuthContext.Provider value={{user, login,logout}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = ()=> useContext(AuthContext);