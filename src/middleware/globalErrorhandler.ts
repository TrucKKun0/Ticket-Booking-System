import { NextFunction, Request, Response } from "express";
import { logger } from "../lib/logger";
import { AppError } from "../error/appError";

export function errorHandler(error:Error,req : Request,res : Response,next: NextFunction):void{
    logger.error({error},"Unhandled Error");
    if(error instanceof AppError){
        res.status(error.statusCode).json({
            success : false,
            message : error.message
        })
    }
    res.status(500).json({
        success : false,
        message : "Internal Server Error"
    })
}