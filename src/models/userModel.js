import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        unique: [true, "Username already taken"]
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    }
});

export default mongoose.model("User", userSchema);