import Router,{Request,Response,NextFunction} from "express";
import { logger } from "../lib/logger";
import { generateNewAccessToken, loginUser, registerUser } from "../service/auth.service";
import { AppError } from "../error/appError";


export const authRouter = Router();


authRouter.post("/register",async (req:Request,res:Response,next:NextFunction)=>{
    logger.info("Register request received");
    try{
        const {email,password} = req.body;
        const user = await registerUser(email,password);
        res.status(201).json({
            success : true,
            message:"User registered successfully",
            data : user.id
        });

    }catch(err){
        next(err);
    }
});


authRouter.post("/login",async (req:Request,res:Response,next:NextFunction)=>{
    logger.info("Login request received");
    try {
        const {email,password} = req.body;
        const {accessToken, refreshToken} = await loginUser(email,password);
        res.cookie("refreshToken",refreshToken,{
            httpOnly : true,
            sameSite : "lax",
            maxAge : 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
            
        });
        res.status(200).json({
            success : true,
            message:"User logged in successfully",
            data : {
                "AccessToken" : accessToken,
                "RefreshToken" : refreshToken
            }
        });
    } catch (error) {
        next(error);
    }

});


authRouter.post("/refresh-access-token", async(req : Request, res : Response, next : NextFunction)=>{
    logger.info("Refresh access token request received");
    try {
        const {refreshToken} = req.cookies;
        if(!refreshToken){
             throw new AppError("Refresh token is required", 401);
        }
        const accessToken = await generateNewAccessToken(refreshToken);
        res.status(200).json({
            success : true,
            message:"New access token generated successfully",
            data : {
                "AccessToken" : accessToken
            }
        });
    } catch (error) {
        next(error);
    }
});


