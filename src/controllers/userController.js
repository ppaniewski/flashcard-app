import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_EXPIRATION } from "../constants.js";
import User from '../models/userModel.js';

// @route POST /api/users/register
export const registerUser = asyncHandler(async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        res.status(400);
        throw new Error("All fields are mandatory");
    }
    
    // Check if username is not taken
    const userAvailable = await User.findOne({username});
    if (userAvailable) {
        res.status(400);
        throw new Error("Username already taken");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await User.create({
        username,
        password: hashedPassword
    });

    res.status(201).json({
        id: user._id,
        username
    });
});

// @route POST /api/users/login
export const loginUser = asyncHandler(async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        res.status(400);
        throw new Error("All fields are mandatory");
    }

    const user = await User.findOne({username});
    if (!user) {
        res.status(401);
        throw new Error("Incorrect username");
    }

    // Compare passwords
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        res.status(401);
        throw new Error("Password is incorrect");
    }

    // Create access token
    const accessToken = jwt.sign(
        {id: user._id}, 
        process.env.JWT_SECRET, 
        {expiresIn: JWT_EXPIRATION}
    );

    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 1000 * 60 * 60 * 24
    }).status(200).send();
});

// @route POST /api/users/logout
export const logoutUser = asyncHandler(async (req, res) => {
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: true,
        sameSite: "strict"
    }).status(200).send();
}); 