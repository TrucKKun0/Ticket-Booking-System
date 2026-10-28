"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.healthRouter = void 0;
const express_1 = __importDefault(require("express"));
exports.healthRouter = (0, express_1.default)();
exports.healthRouter.get('/health', (req, res) => {
    return res.status(200).json({
        success: true,
        message: "Server is in healthy condition."
    });
});
