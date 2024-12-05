import jwt from 'jsonwebtoken';
require('dotenv').config();

const secretKey = process.env.JWT_SECRET as string;

export function generateAccessToken(payload: any): string {
    return jwt.sign(payload, secretKey, { expiresIn: '15m' });
}

export function generateRefreshToken(payload: any): string {
    return jwt.sign(payload, secretKey, { expiresIn: '7d' });
}

export function verifyToken(token: string): any {
    try {
        return jwt.verify(token, secretKey);
    } catch (error) {
        throw new Error('Invalid token');
    }
}