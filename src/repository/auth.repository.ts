

import {pool} from "../lib/db"
import {DBUserRow, DBUserRowWithPassword, RefreshTokenPayload, RefreshTokenRow, User } from "../types/auth.types"



export const findUserByEmail = async function (email : string):Promise<User | null>{

    const result = await pool.query<DBUserRow>(`
        SELECT id , email,role,created_at,updated_at FROM users WHERE email = $1
        `,[email]);

        return result.rows[0] || null;
}


export const createUser = async function(email : string, pasword: string):Promise<User >{

    const result = await pool.query<DBUserRow>(`
        
        INSERT INTO users (email,passowrd) VALUES ($1,$2) 
        RETURNING id,email,role,created_at,updated_at
        `,[email,pasword]);

        return result.rows[0];

}

export const findUserByEmailAndPassword = async function(email : string):Promise<DBUserRowWithPassword>{

    const result = await pool.query<DBUserRowWithPassword>(`
        SELECT id,email,role,created_at,updated_at,passwordHash FROM users WHERE email = $1
        `,[email]);
    return result.rows[0] ?? null;
}

export const  createRefreshToken = async(payload : RefreshTokenPayload):Promise<boolean> =>{
    const {hashedToken,userId,expiresAt} = payload;
    const result = await pool.query<RefreshTokenRow>(`
        INSERT INTO refreshToken(hashedToken,userId,expiresAt) VALUES ($1,$2,$3)
        `,[hashedToken,userId,expiresAt]);

    if(result){
        return true;
    }else{
        return false;
    }
}