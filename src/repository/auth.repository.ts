

import {pool} from "../lib/db"
import {DBUserRow, DBUserRowWithPassword, RefreshTokenPayload, RefreshTokenRow, RefreshTokenWithUser, User } from "../types/auth.types"



export const findUserByEmail = async function (email : string):Promise<User | null>{

    const result = await pool.query<DBUserRow>(`
        SELECT id , email,role,created_at,updated_at FROM users WHERE email = $1
        `,[email]);

        return result.rows[0] || null;
}


export const createUser = async function(email : string, hashedPassword: string):Promise<User >{

    const result = await pool.query<DBUserRow>(`
        
        INSERT INTO users (email,passwordHash) VALUES ($1,$2) 
        RETURNING id,email,role,created_at,updated_at
        `,[email,hashedPassword]);

        return result.rows[0];

}

export const findUserByEmailAndPassword = async function(email : string):Promise<DBUserRowWithPassword | null>{

    const result = await pool.query<DBUserRowWithPassword>(`
        SELECT id,email,role,created_at,updated_at,passwordHash FROM users WHERE email = $1
        `,[email]);
    return result.rows[0] ?? null;
}

export const  createRefreshToken = async(payload : RefreshTokenPayload):Promise<boolean> =>{
    const {hashedToken,userId,expiresAt} = payload;
    const result = await pool.query<RefreshTokenRow>(`
        INSERT INTO refreshToken(token,userId,expires_at) VALUES ($1,$2,$3)
        `,[hashedToken,userId,expiresAt]);

    if(result){
        return true;
    }else{
        return false;
    }
}

export async function findRefreshToken(hashedToken : string):Promise<RefreshTokenWithUser| null>{
    const result = await pool.query<RefreshTokenWithUser>(`
        SELECT r.id as refresh_token_id,r.token as hashedToken,r.expires_at,u.id as user_id,u.email,u.role,u.created_at,u.updated_at
        FROM refreshToken r
        INNER JOIN 
        users u  ON r.user_id = u.id
        WHERE r.token = $1
        `,[hashedToken]);
    return result.rows[0] ?? null;
}

export async function findUserById(userId : String): Promise<User | null>{
    const result = await pool.query<DBUserRow>(`
        SELECT id,email,role,created_at,updated_at FROM users WHERE id = $1
        `,[userId]);

    return result.rows[0] ?? null;
}