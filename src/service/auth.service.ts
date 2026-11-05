

import { MINIMUM_PASSWORD_LENGTH } from "../const/authConst";
import { AppError } from "../error/appError";
import {logger} from "../lib/logger";
import { comparePassword, hashPassword } from "../lib/passwordHashFunction";
import { signAccessToken, signRefreshToken } from "../lib/token";
import { createUser, findRefreshToken, findUserByEmail, findUserByEmailAndPassword, findUserById } from "../repository/auth.repository";
import {RegisterUserResponse } from "../types/auth.types";


export const registerUser = async function(email: string,password : string):Promise<RegisterUserResponse>{
    logger.info(`Registering user with email: ${email}`);
    if(!email || !password){
        throw new AppError("Email and password are required",400);
    }
    if (password.length < MINIMUM_PASSWORD_LENGTH){
        throw new AppError(`Password must be at least ${MINIMUM_PASSWORD_LENGTH} characters long`,400);
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await findUserByEmail(normalizedEmail);

    if (existingUser) {
        throw new AppError("User with this email already exists", 400);
    }

    const hashedPassword = await hashPassword(password);

    const registeredUser =  await createUser(normalizedEmail,hashedPassword);
    return registeredUser;

}

export const loginUser = async function(email : string, password : string):Promise<{accessToken : string, refreshToken : string}>{
    if(!email || !password){
        throw new AppError("Email and password are required",400);
    }
    const normalizedEmail = email.toLowerCase().trim();
    const user = await findUserByEmailAndPassword(normalizedEmail);
    if(!user){
        throw new AppError("User not found",404);
    }

    if(!user.passwordHash){
        throw new AppError("Incorrect email or password",401);
    }
    const isPasswordValid = await comparePassword(password,user.passwordHash);
    if(!isPasswordValid){
        throw new AppError("Incorrect email or password",401);
    }

     const accessToken = await signAccessToken({
        userId : user.id, 
        email : user.email, 
        role : user.role,
        created_at : user.created_at
    });

    const refreshToken = await signRefreshToken(user.id);
    return {accessToken,refreshToken};

}

export const generateNewAccessToken = async function(refreshToken : string):Promise<string>{
    const storedRefreshToken = await findRefreshToken(refreshToken);
    if(!storedRefreshToken){
        throw new AppError("Refresh token not found. Please login again.",401);
    }
    if(storedRefreshToken.expires_at < new Date()){
        throw new AppError("Refresh token has expired. Please login again.",401);
    }

    const newAccessToken = await signAccessToken({
        userId : storedRefreshToken.user_id,
        email : storedRefreshToken.email,
        role : storedRefreshToken.role,
        created_at : storedRefreshToken.created_at
    })
    return newAccessToken;
}