// utils/jsonwebtoken.js
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { JWT_EXPIRES_IN, JWT_SECRET } from '../config/env.js';

// Hash a password
export async function hashPassword(password) {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
}

// Compare password and hash
export async function verifyPassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
}

// Generate JWT with user details
export function generateToken(id, email, role) {
    const payload = {
        id,
        email,
        role,
        datetime: new Date().toISOString(),
    };
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

// Generate short-lived JWT for forgot password
export function generateForgotPasswordToken(email) {
    const payload = {
        email,
        datetime: new Date().toISOString(),
    };
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '5m' });
}

// Verify token (returns payload or null)
export function verifyToken(token) {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        console.error('JWT verification error:', error);
        return null;
    }
}

// Decode token (without verifying)
export function decodeToken(token) {
    return jwt.decode(token);
}