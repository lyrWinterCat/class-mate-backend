"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateRefreshToken = exports.generateAccessToken = void 0;
const tslib_1 = require("tslib");
const jsonwebtoken_1 = (0, tslib_1.__importDefault)(require("jsonwebtoken"));
require('dotenv').config();
const secretKey = process.env.JWT_SECRET;
function generateAccessToken(payload) {
    return jsonwebtoken_1.default.sign(payload, secretKey, { expiresIn: '15m' });
}
exports.generateAccessToken = generateAccessToken;
function generateRefreshToken(payload) {
    return jsonwebtoken_1.default.sign(payload, secretKey, { expiresIn: '7d' });
}
exports.generateRefreshToken = generateRefreshToken;
function verifyToken(token) {
    try {
        return jsonwebtoken_1.default.verify(token, secretKey);
    }
    catch (error) {
        throw new Error('Invalid token');
    }
}
exports.verifyToken = verifyToken;
//# sourceMappingURL=jwt.js.map