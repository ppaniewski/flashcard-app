import express from 'express';
import connectDb from './config/dbConnect.js';
import dotenv from 'dotenv';
import errorHandler from './middleware/errorHandler.js';
import userRoutes from './routes/userRoutes.js';
import flashcardRoutes from './routes/flashcardRoutes.js';

dotenv.config();
const app = express();
connectDb();

app.set("views", "views");
app.set("view engine", "ejs");

// Middlewares
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/sets", flashcardRoutes);

app.use(errorHandler);

export default app;