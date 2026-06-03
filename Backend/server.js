import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import urlRoutes from "./routes/urlRoutes.js";
import { redirectUrl } from "./controllers/urlController.js";


dotenv.config();
const app=express();
app.use(cors());
app.use(express.json());
app.use("/api/auth",authRoutes);
app.use("/api/url",urlRoutes);
app.use("/:shortCode",redirectUrl);
app.get("/",(req,res)=>{
    res.send("URL Shortener API Running...")
});
const PORT=process.env.PORT||5000;
connectDB();
app.listen(PORT,()=>{
    console.log(`Server running on ${PORT}`);
});