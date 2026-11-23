import mongoose from "mongoose";
import bcrypt from "bcryptjs"

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        maxLength: 50,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase:true,
    },
    username: {
        type: String,
        required: [true, "Username is required"],
        unique: true,
        minLength:4,
        maxLength: 30,
        match:[/^[a-z0-9._]+$/, "Username can only contain letters, numbers, dots and underscores"],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minLength: 6,
        select: false
    },
    avatar: {
        type: String,
        default: "",
    },
    resetPasswordToken: {
        type: String,
        select:false,
    },
    resetPasswordExpire: {
        type: Date,
        select: false,
    },
},
{
timestamps: true
}
)

userSchema.pre("save", async function () {
    if(!this.isModified("password")) return
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password)
}

const User = mongoose.model("User", userSchema)

export default User