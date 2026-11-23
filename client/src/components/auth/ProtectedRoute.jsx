import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function ProtectedRoute({children}){
    const {user, loading} = useAuth()

    if(loading){
        return(
            <div className="grid min-h-screen place-items-center bg-[#f7f7f7]">
                <div className="size-8 animate-spin rounded-full border-4 border-neutral-200 border-t-neutral-900" />
            </div>
        )
    }

    if (!user){
        return <Navigate to="/login" replace />
    }

    return children
}