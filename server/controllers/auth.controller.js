import { ApiResponse } from "../utils/ApiResponse.js";
import { hashPassword, generateToken, verifyPassword } from "../utils/jsonwebtoken.js";
import { prisma } from "../config/prisma.js";

// SignIn for user authentication
export const SignIn = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) return ApiResponse.validationError(res, 'All required fields must be provided.', 400);

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) return ApiResponse.validationError(res, 'Please provide a valid email address.', 400);

        const user = await prisma.user.findFirst({
            where: {
                email: email
            }
        })

        if (!user) return ApiResponse.error(res, 'No User was found. Please try again.', 500);

        const isValid = await verifyPassword(password, user.password)

        if (!isValid) return ApiResponse.error(res, 'Incorrect Email or Password. Please try again.', 500);

        const token = generateToken(user.id, user.email, user.role);

        return ApiResponse.success(res, 'User Logged in Successfully.', {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: `Bearer ${token}`
        })
    } catch (error) {
        return ApiResponse.error(res, 'An unexpected error occurred while signing in. Please try again.', 500);
    }
}

// SignUp for user authentication
export const SignUp = async (req, res) => {
    try {
        const { name, email, password, address, phone, role, image } = req.body;

        // Validation
        if (!name || !email || !password || !address || !phone) return ApiResponse.validationError(res, 'All required fields must be provided.', 400);

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) return ApiResponse.error(res, 'Please provide a valid email address.', 400);

        // Password validation (minimum 6 characters)
        if (password.length < 6) return ApiResponse.error(res, 'Password must be at least 6 characters long.', 400);

        // Phone validation (basic)
        const phoneRegex = /^[\+]?[1-9][\d]{3,14}$/;
        if (!phoneRegex.test(phone.replace(/\s|-/g, ''))) return ApiResponse.error(res, 'Please provide a valid phone number.', 400);

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: email.toLowerCase() }
        });

        if (existingUser) return ApiResponse.error(res, 'User with this email already exists.', 409);

        // Hash password
        const hashedPassword = await hashPassword(password)

        // Create user
        const user = await prisma.user.create({
            data: {
                name: name.trim(),
                email: email.toLowerCase().trim(),
                password: hashedPassword,
                address: address.trim(),
                phone: phone.trim(),
                role: role, // Default to USER if not specified
                image: image
            },
            select: {
                id: true,
                uuid: true,
                name: true,
                email: true,
                role: true,
                address: true,
                phone: true,
                image: true,
                createdAt: true
            }
        });

        return ApiResponse.success(res, 'User registered successfully.', user, 201);

    } catch (error) {
        // Handle Prisma unique constraint violation
        if (error.code === 'P2002') return ApiResponse.error(res, 'User with this email already exists.', 409);
        return ApiResponse.error(res, 'An unexpected error occurred while signing up. Please try again.', 500);
    }
};