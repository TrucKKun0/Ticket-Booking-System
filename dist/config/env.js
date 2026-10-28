"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function checkEnvVariable(key) {
    const value = process.env[key];
    if (!value) {
        throw new Error("No env varibale is configured.");
    }
    return value;
}
exports.env = {
    port: process.env.PORT,
    log_level: checkEnvVariable("LOG_LEVEL"),
    isProduction: (process.env.NODE_ENV ?? "development") === "prodcution",
    nodeEnv: process.env.NODE_ENV,
    databaseurl: process.env.DATABASE_URL,
    jwtAccessSecret: process.env.JWT_SECRET,
    jwtAccessSecretExpiresIn: process.env.JWT_EXPIRES_IN
};
