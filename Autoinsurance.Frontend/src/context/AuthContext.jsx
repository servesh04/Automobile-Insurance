import { createContext, useContext, useState, useCallback } from "react";
import { parseJwt } from "../utils/jwt";

const AuthContext = createContext(null)

export function AuthProvider({children}){
    const [auth,setAuth] = useState(() => {
        const token = localStorage.getItem('token')
        if(!token) return null
        const parsed = parseJwt(token)
        return parsed ? {token, ...parsed} : null
    })

    const login = useCallback((token) => {
        localStorage.setItem('token', token)
        const parsed = parseJwt(token)
        setAuth({token, ...parsed})
    }, [])

    const logout = useCallback(() => {
        localStorage.removeItem('token')
        setAuth(null)

    },[])

    const isStaff = auth?.roles?.some( r=> r==='Admin' || r==='Agent') ?? false
    const isAdmin = auth?.roles?.includes('Admin') ?? false

    return (
        <AuthContext.Provider value={{auth,login,logout,isStaff,isAdmin}}>
            {children}
        </AuthContext.Provider>
    )

}

export function useAuth() {
    return useContext(AuthContext)
}