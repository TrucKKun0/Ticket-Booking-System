"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.urlNotFoundHandler = urlNotFoundHandler;
function urlNotFoundHandler(_req, res, next) {
    res.status(404).json({
        success: false,
        message: "URL not found. Please try again with valid url."
    });
}
