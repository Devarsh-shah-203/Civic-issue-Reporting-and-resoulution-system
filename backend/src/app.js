import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import morgan from "morgan";

import authRoutes from "./routes/authRoutes.js";


const app = express();


app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials:true,
    })
);


app.use(helmet());

app.use(morgan("dev"));

app.use(express.json());

app.use(express.urlencoded({
    extended:true
}));

app.use(cookieParser());



// Routes

app.use("/api/auth", authRoutes);



app.get("/",(req,res)=>{
    res.json({
        success:true,
        message:"Server is running 🚀"
    });
});


export default app;