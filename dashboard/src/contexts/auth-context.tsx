import { createContext, useContext, useState } from "react"

type AuthContextType = {
    authenticated: boolean
    login: (token: string) => void
    logout: () => void
}

const AuthContext = createContext<AuthContextType| null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [authenticated, setAuthenticated] = useState(localStorage.getItem("token")!==null)

    function login(token: string) {
        localStorage.setItem("token", token)
        setAuthenticated(true)
    }
    function logout() {
        localStorage.removeItem("token")
        setAuthenticated(false)
    }

    return (
        <AuthContext.Provider value={{authenticated, login, logout}}>
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