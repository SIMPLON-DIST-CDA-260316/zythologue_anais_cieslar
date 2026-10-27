import { createContext, useContext, useState } from "react"

type AuthContextType = {
    isAuth: boolean
    login: (token: string) => void
    logout: () => void
    token: string | null
}

const AuthContext = createContext<AuthContextType| null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [token, setToken] = useState<string | null>(localStorage.getItem("token"))
    const isAuth = token !== null

    function login(token: string) {
        localStorage.setItem("token", token)
        setToken(token)
    }
    function logout() {
        localStorage.removeItem("token")
        setToken(null)
    }

    return (
        <AuthContext.Provider value={{isAuth, login, logout, token}}>
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