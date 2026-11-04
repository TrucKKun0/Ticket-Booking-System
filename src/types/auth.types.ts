export type RegisterUserResponse = {
    id : string,
    email : string,
    role : string,
    created_at : Date,
    updated_at : Date
}

export type User = {
    id : string,
    email : string,
    role : string,
    created_at : Date,
    updated_at : Date
}

export type DBUserRow = RegisterUserResponse

export type AccessTokenPayload = {
    userId : string,
    email : string,
    role : string,
    created_at : Date
}

export type DBUserRowWithPassword  = RegisterUserResponse & {
    password : string
}

export type RefreshTokenPayload = {
    hashedToken : string,
    userId : string,
    expiresAt : Date
}

export type RefreshTokenRow = {
    id : string,
    hashedToken : string,
    userId : string,
    token_expiresAt : Date,
    created_at : Date
}

export type RefreshTokenWithUser = {
    refresh_token_id : string,
    hashedToken : string,
    expires_at : Date,
    user_id : string,
    email : string,
    role : string,
    created_at: Date
    updated_at : Date
}