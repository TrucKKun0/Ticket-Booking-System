"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const router_1 = require("./router");
const globalErrorhandler_1 = require("./middleware/globalErrorhandler");
const urlNotFound_1 = require("./middleware/urlNotFound");
"./router/index";
function createApp() {
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: true }));
    app.use((0, cors_1.default)());
    app.use(globalErrorhandler_1.errorHandler);
    app.use(urlNotFound_1.urlNotFoundHandler);
    // single entry route to whole api of system 
    app.use("/api", router_1.apiRouter);
    return app;
}
