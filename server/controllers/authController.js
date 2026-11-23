import crypto from "crypto"
import User from "../models/User.js"
import { sendTokenResponse } from "../utils/sendTokenResponse.js"
import Profile from "../models/Profile.js"
import {sendEmail} from "../utils/sendEmail.js"

function normalizeUsername(value = ""){
    return value.trim().toLowerCase()
}

export async function register(req, res){
    try{
        const {name, email, username, password} = req.body;

        if(!name || !email || !username || !password){
            return res.status(400).json({
                success:false,
                message: " Please fill all the fields"
            })
        }

        if(password.length < 6){
            return res.status(400).json({
                success: false,
                message: "Password must be atleast 6 characters"
            })
        }

        const cleanEmail = email.trim().toLowerCase()
        const cleanUsername = normalizeUsername(username)

        const existingUser = await User.findOne({
            $or: [{email: cleanEmail}, {username: cleanUsername}],
        })

        if(existingUser){
            return res.status(409).json({
                success:false,
                message: existingUser.email === cleanEmail ? "An account with this email already exists" : "this username is taken",
            })
        }

        const user = await User.create({
            name: name.trim(),
            email: cleanEmail,
            username: cleanUsername,
            password
        })
        await Profile.create({
            user:user._id,
            displayName: user.name
        })

        sendTokenResponse(user, 201, res)

    }catch(error){
        res.status(500).json({
            success: false,
            message: error.message || "Could not create account"
        })
    }
}


export async function login(req, res) {
    try{
        const {email, password} = req.body

        if(!email || !password){
            return res.status(400).json({
                success:false,
                message: "Email and password are required"
            })
        }

        const user = await User.findOne({
            email: email.trim().toLowerCase(),
        }).select("+password")

        if(!user || !(await user.comparePassword(password))){
            return res.status(401).json({
                success:false,
                message: "Invalid email or password",
            })
        }

        sendTokenResponse(user, 200, res)
    }catch(error){
        res.status(500).json({
            success: false,
            message: "Could not login"
        })
    }
}

export function logout(req, res){
    res.status(200).cookie("token", "", {
        httpOnly: true,
        expires: new Date(0),
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    }).json({
        success: true,
        message: " Logged out"
    })
}

export async function getMe(req, res){
    res.status(200).json({
        success: true,
        user: req.user,
    })
}