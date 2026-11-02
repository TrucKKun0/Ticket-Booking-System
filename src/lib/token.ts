import { env } from "../config/env";
import { AccessTokenPayload, RefreshTokenPayload } from "../types/auth.types";
import jwt,{SignOptions} from "jsonwebtoken";
import crypto from "crypto";
import { createRefreshToken } from "../repository/auth.repository";


export const signAccessToken = async(payload : AccessTokenPayload):Promise<string> =>{
    const options : SignOptions = {
        expiresIn : env.jwtAccessSecretExpiresIn as SignOptions["expiresIn"]
    }

    const accessToken = jwt.sign(payload,env.jwtAccessSecret, options);
    return accessToken;
}

export const signRefreshToken  = async (userId : string):Promise<string> =>{

    const token = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // Set expiration to 7 days from now
    const payload : RefreshTokenPayload = {
        userId,
        hashedToken,
        expiresAt
    }
    const isTokenCreated =await createRefreshToken(payload);
    if(!isTokenCreated){
        throw new Error("Failed to create refresh token");
    }
    return hashedToken;
}