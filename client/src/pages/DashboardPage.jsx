import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/AuthContext"

export default function DashboardPage(){
    const navigate = useNavigate()
    const {user, logout} = useAuth()

    async function handleLogout(){
        try{
            await logout()
            navigate("/login")
        }catch(error){
            toast.error("Could not logout")
        }
    }

    return (
        <main className="min-h-screen bg-[#f7f7f5]">
            <header className="border-b bg-white">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
                    <div>
                        <p className="text-lg font-black">
                            Linkora
                        </p>
                        <p className="text-xs text-neutral-500">@{user.username}</p>
                    </div>

                    <Button variant="outline" onClick={handleLogout}>
                       <LogOut/>
                       Log Out 
                    </Button>
                </div>
            </header>

            <section className="mx-auto max-w-6xl px-6 py-10">
                <p className="text-sm text-neutral-500">Dashboard</p>
                <h1 className="mt-1 text-4xl font-black">
                    Welcome, {user.name}
                </h1>
                <p className="mt-3 text-neutral-600">Authentication is complete. Next we build the creator dashbaord</p>
            </section>
        </main>
    )
}