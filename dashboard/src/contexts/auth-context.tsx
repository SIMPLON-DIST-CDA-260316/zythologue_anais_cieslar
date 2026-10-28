import {createContext, useContext, useEffect, useState} from "react"
import type {User, AuthContextType} from "@/lib/types.ts";


const AuthContext = createContext<AuthContextType| null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [token, setToken] = useState<string | null>(localStorage.getItem("token"))
    const isAuth = token !== null
    const [user, setUser] = useState<User|null>(null)

    function login(token: string) {
        localStorage.setItem("token", token)
        setToken(token)
    }
    function logout() {
        localStorage.removeItem("token")
        setToken(null)
        setUser(null)
    }

    useEffect(() => {
        if (!token) return

        fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
            method: "GET",
            headers: {"Authorization": "Bearer " + token},
        })
            .then(res => {
                if (!res.ok) {
                    logout()
                return null
                }
            return res.json()
            })
            .then(data => {setUser(data)})
    }, [token])



    return (
        <AuthContext.Provider value={{isAuth, login, logout, token, user}}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error("useAuth doit être utilisé dans un AuthProvider")
    }
    return context
}