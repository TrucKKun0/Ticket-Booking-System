

import { MINIMUM_PASSWORD_LENGTH } from "../const/authConst";
import { AppError } from "../error/appError";
import {logger} from "../lib/logger";
import { comparePassword } from "../lib/passwordHashFunction";
import { signAccessToken, signRefreshToken } from "../lib/token";
import { createUser, findUserByEmail, findUserByEmailAndPassword } from "../repository/auth.repository";
import {RegisterUserResponse } from "../types/auth.types";


export const registerUser = async function(email: string,password : string):Promise<RegisterUserResponse>{
    logger.info(`Registering user with email: ${email}`);
    if(!email || !password){
        throw new AppError("Email and password are required",400);
    }
    if (password.length < MINIMUM_PASSWORD_LENGTH){
        throw new AppError(`Password must be at least ${MINIMUM_PASSWORD_LENGTH} characters long`,400);
    }

    const normalizedEmail = email.toLocaleLowerCase().trim();

    const existingUser = await findUserByEmail(normalizedEmail);

    if (existingUser) {
        throw new AppError("User with this email already exists", 409);
    }

    const registeredUser =  await createUser(normalizedEmail,password);
    return registeredUser;

}

export const loginUser = async function(email : string, password : string):Promise<{accessToken : string, refreshToken : string}>{
    if(!email || !password){
        throw new AppError("Email and password are required",400);
    }
    const normalizedEmail = email.toLowerCase().trim();
    const user = await findUserByEmailAndPassword(normalizedEmail);
    if(!user.password){
        throw new AppError("Incorrect email or password",401);
    }
    const isPasswordValid = await comparePassword(password,user.password);
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