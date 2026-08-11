import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getCurrentUser, logoutUser as logoutUserApi } from "../routes/api.js";

const AuthContext = createContext();

export const AuthProvider = ({ children })=>{

    const [user, setUser] = useState(null);
    const [initializing, setInitializing] = useState(true);

    /* Auth lives in an httpOnly cookie now, not localStorage — so on every
       fresh load we have to ask the server who (if anyone) is logged in. */
    useEffect(() => {
        let cancelled = false;

        (async () => {
            try {
                const res = await getCurrentUser();
                if (!cancelled) setUser(res?.data?.data ?? null);
            } catch {
                if (!cancelled) setUser(null);
            } finally {
                if (!cancelled) setInitializing(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, []);

    /* api.js dispatches this when a silent refresh attempt fails, so a dead
       session gets reflected in the UI without every page wiring its own check. */
    useEffect(() => {
        const handleSessionExpired = () => setUser(null);
        window.addEventListener("auth:sessionExpired", handleSessionExpired);
        return () => window.removeEventListener("auth:sessionExpired", handleSessionExpired);
    }, []);

    const login = useCallback((data)=>{
        const loggedInUser = data?.data?.user ?? null;
        setUser(loggedInUser);
        return loggedInUser;
    },[]);

    const logout = useCallback(async ()=>{
        try {
            await logoutUserApi();
        } catch {
            /* best-effort: still clear client state even if the network call fails */
        } finally {
            setUser(null);
        }
    },[]);

    return(
        <AuthContext.Provider value={{user, initializing, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = ()=> useContext(AuthContext);
