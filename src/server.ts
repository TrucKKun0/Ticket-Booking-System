import dotenv from "dotenv"
import express from "express";
import { createApp }   from "./app";
dotenv.config();

const app = createApp();

app.listen(process.env.PORT,()=>{
    console.log(`Server is running on port ${process.env.PORT}`);
})