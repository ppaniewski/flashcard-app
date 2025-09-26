import express from 'express';
import connectDb from './config/dbConnect.js';
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";
import errorHandler from './middleware/errorHandler.js';
import userRoutes from './routes/userRoutes.js';
import flashcardRoutes from './routes/flashcardRoutes.js';
import viewRoutes from "./routes/viewRoutes.js";

dotenv.config();
const app = express();
connectDb();

// Middlewares
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended: true}));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/sets", flashcardRoutes);
app.use("/", viewRoutes);

app.use(errorHandler);

export default app;