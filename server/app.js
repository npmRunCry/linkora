import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import authRoutes from "./routes/authRoutes.js"
import profileRoutes from "./routes/profileRoutes.js"
import blockRoutes from "./routes/blockRoutes.js"
import uploadRoutes from "./routes/uploadRoutes.js"
import analyticsRoutes from "./routes/analyticsRoutes.js"
import userRoutes from "./routes/userRoutes.js"

const app = express()

app.use(cors({origin: process.env.CLIENT_URL,
    credentials: true,
}))

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())

app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message:"Linkora API is running",
    })
})

app.use("/api/auth", authRoutes)
app.use("/api/profile", profileRoutes)
app.use("/api/blocks", blockRoutes)
app.use("/api/upload", uploadRoutes)
app.use("/api/analytics", analyticsRoutes)
app.use("/api/users", userRoutes)

export default app