import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Prosím vložte jméno"],
        unique: true,
    },
    email: {
        type: String,
        required: [true, "Prosím vložte e-mail"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Prosím vložte heslo"],
    },
    // isVerfied: {
    //     type: Boolean,
    //     default: false,
    // },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    forgotPasswordToken: String,
    forgotPasswordTokenExpiry: Date,
    verifyToken: String,
    verifyTokenExpiry: Date,
})

const User = mongoose.models.users || mongoose.model("users", userSchema);

export default User;