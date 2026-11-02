import Router,{Request,Response,NextFunction} from "express";
import { logger } from "../lib/logger";
import { loginUser, registerUser } from "../service/auth.service";


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
        res.status(200).json({
            success : true,
            message:"User logged in successfully",
            data : {
                accessToken,
                refreshToken
            }
        });
    } catch (error) {
        next(error);
    }

})
