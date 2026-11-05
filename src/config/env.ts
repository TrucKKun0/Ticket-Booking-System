import dotenv from "dotenv";
dotenv.config();

function checkEnvVariable(key:string):string{
    const value = process.env[key];
    if(!value){
        throw new Error("No env varibale is configured.");
    }
    return value;
}

export const env = {
    port : process.env.PORT,
    log_level : checkEnvVariable("LOG_LEVEL"),
    isProduction : (process.env.NODE_ENV ?? "development") === "production",
    nodeEnv : process.env.NODE_ENV,
    databaseurl:process.env.DATABASE_URL,
    jwtAccessSecret: checkEnvVariable("JWT_ACCESS_SECRET"),
    jwtAccessSecretExpiresIn: checkEnvVariable("JWT_ACCESS_SECRET_EXPIRES_IN")

}