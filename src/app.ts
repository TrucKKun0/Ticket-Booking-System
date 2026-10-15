
import express from "express";
import cors from "cors";
import { apiRouter } from "./router"; "./router/index";
export function createApp (){
    const app = express();
    app.use(express.json());
    app.use(express.urlencoded({extended : true}));
    app.use(cors());

    app.use(apiRouter);

    return app;

}