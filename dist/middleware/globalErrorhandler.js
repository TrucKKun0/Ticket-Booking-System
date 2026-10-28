"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const logger_1 = require("../lib/logger");
const appError_1 = require("../error/appError");
function errorHandler(error, req, res, next) {
    logger_1.logger.error({ error }, "Unhandled Error");
    if (error instanceof appError_1.AppError) {
        res.status(error.statusCode).json({
            success: false,
            message: error.message
        });
    }
    res.status(500).json({
        success: false,
        message: "Internal Server Error"
    });
}
