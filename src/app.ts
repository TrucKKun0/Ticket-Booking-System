
import express from "express";
import cors from "cors";
import { apiRouter } from "./router";import { errorHandler } from "./middleware/globalErrorhandler";
import cookieParser from "cookie-parser";
import { urlNotFoundHandler } from "./middleware/urlNotFound";
 "./router/index";
export function createApp (){
    const app = express();
    app.use(express.json());
    app.use(express.urlencoded({extended : true}));
    app.use(cookieParser());
    app.use(cors());
    // single entry route to whole api of system 
    app.use("/api",apiRouter);
    app.use(urlNotFoundHandler);
    app.use(errorHandler);
    
    return app;

}