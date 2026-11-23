import { createContext, useContext, useEffect, useState, useMemo } from "react";
import api from "@/lib/api"

const AuthContext = createContext(null)

export function AuthProvider({children}) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(()=> {
        async function loadUser() {
            try{
                const {data} = await api.get(("/auth/me"))
                setUser(data.user)
            }catch(error){
                setUser(null)
            }finally{
                setLoading(false)
            }
        }

        loadUser()
    }, [])

    async function register(formData){
        const {data} = await api.post("/auth/register", formData)
        setUser(data.user)
        return data.user
    }

    async function login(formData){
        const {data} = await api.post("/auth/login", formData)
        setUser(data.user)
    }

    async function logout(){
        await api.post("/auth/logout")
        setUser(null)
    }

    const value = useMemo(()=> ({
        user, loading, register, login, logout, setUser,
    }), [user, loading])

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
    const context = useContext(AuthContext)

    if(!context){
        throw new Error("useAuth must be used inside AuthProvider")
    }

    return context
}