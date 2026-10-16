import { NextFunction, Request, Response } from "express";

export function urlNotFoundHandler (_req : Request, res:Response, next : NextFunction):void{
    res.status(404).json({
        success : false,
        message : "URL not found. Please try again with valid url."
    })
}