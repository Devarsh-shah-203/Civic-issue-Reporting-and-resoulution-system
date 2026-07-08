import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import dotenv from "dotenv";

import connectDB from "./config/db.js";

dotenv.config();

const app = express();

// Connect Database
connectDB();

// Middlewares
app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
    })
);

app.use(helmet());

app.use(morgan("dev"));

app.use(express.json());

app.use(
    express.urlencoded({
        extended: true,
    })
);

app.use(cookieParser());

// Health Check Route
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Server is running 🚀",
    });
});

export default app;