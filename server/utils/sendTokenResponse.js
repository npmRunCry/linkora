import { generateToken } from "./generateToken.js";

export function sendTokenResponse(user, statusCode, res){
    const token = generateToken(user._id)

    res.status(statusCode).cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    }).json({
        success:true,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            username: user.username,
            avatar: user.avatar,
        },
    })
}