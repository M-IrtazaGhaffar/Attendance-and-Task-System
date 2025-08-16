import { ApiResponse } from "../utils/ApiResponse.js";
import { prisma } from "../config/prisma.js";

// Update user profile
export const updateUser = async (req, res) => {
    try {
        const { name, address, phone, image } = req.body
        const userId = req.user.id;
        // Validation
        if (!userId) return ApiResponse.validationError(res, 'Id must be provided.', 400);

        await prisma.user.update({
            where: {
                id: parseInt(userId)
            },
            data: {
                name: name ? name.trim() : undefined,
                address: address ? address.trim() : undefined,
                phone: phone ? phone.trim() : undefined,
                image: image ? image : undefined // Only update image if provided
            }
        })
        return ApiResponse.success(res, 'User updated successfully.');

    } catch (error) {
        return ApiResponse.error(res, 'An unexpected error occurred while signing in. Please try again.', 500);
    }
}

// Get user profile for CURRENT USER
export const getUser = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await prisma.user.findUnique({
            where: {
                id: parseInt(userId)
            },
            select: {
                id: true,
                uuid: true,
                name: true,
                email: true,
                role: true,
                address: true,
                phone: true,
                image: true
            }
        });

        if (!user) return ApiResponse.error(res, 'User not found.', 404);

        return ApiResponse.success(res, 'User retrieved successfully.', user);

    } catch (error) {
        return ApiResponse.error(res, 'An unexpected error occurred while retrieving user data. Please try again.', 500);
    }
}

// Get all users
export const getAllUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                uuid: true,
                email: true,
                name: true,
                role: true,
                phone: true,
            }
        });

        if (users.length === 0) return ApiResponse.error(res, 'No users found.', 404);

        return ApiResponse.success(res, 'Users retrieved successfully.', users);

    } catch (error) {
        return ApiResponse.error(res, 'An unexpected error occurred while retrieving users. Please try again.', 500);
    }
}

// Get user by ID
export const getUserById = async (req, res) => {
    try {
        const userId = parseInt(req.body.id);

        if (!userId) return ApiResponse.validationError(res, 'User ID must be provided.', 400);

        const user = await prisma.user.findUnique({
            where: {
                id: parseInt(userId)
            },
            select: {
                id: true,
                uuid: true,
                email: true,
                role: true,
                createdAt: true,
                updatedAt: true,
                name: true,
                address: true,
                phone: true,
                image: true
            }
        });

        if (!user) return ApiResponse.error(res, 'User not found.', 404);

        return ApiResponse.success(res, 'User retrieved successfully.', user);

    } catch (error) {
        return ApiResponse.error(res, 'An unexpected error occurred while retrieving user data. Please try again.', 500);
    }
}