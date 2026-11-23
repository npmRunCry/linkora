import {Link} from "react-router-dom"
import {ArrowRight, Sparkle} from "lucide-react"
import {Button} from "@/components/ui/button"

export default function ForgotPasswordPage(){
    return(
        <main className="min-h-screen bg-[#f5f5f5]">
            <nav className="mx-auto flex items-center justify-between px-6 py-6 max-w-6xl">
                <Link to='/' className="text-xl font-black tracking-tight">Linkora</Link>

                <div className="flex items-center gap-2">
                    <Button asChild variant="ghost">
                        <Link to='/'>Login</Link>
                    </Button>
                    <Button className='rounded-full' asChild>
                        <Link to='/register'>Get Started</Link>
                    </Button>
                </div>
            </nav>

            <section className="mx-auto flex max-w-6xl flex-col items-center px-6 py-24 text-center">
                <div className="mb-6 flex items-center gap-2 rounded-full border bg-white px-4 py-2 text-sm">
                    <Sparkle className="size-4" />
                    One page for everything you create
                </div>

                <h1 className="max-w-4xl text-5xl font-black tracking-tight sm:text-7xl">
                    Forgot Password Page
                </h1>

                <p className="mt-6 max-w-2xl text-lg text-neutral-600">Build a beautiful link-in-bio page, customize every detail,
share it anywhere, and understand what your audience clicks.</p>

                <Button className='mt-8 rounded-full px-7' asChild size='lg'>
                    <Link>Get Started <ArrowRight/></Link>
                </Button>
            </section>
        </main>
    )
}