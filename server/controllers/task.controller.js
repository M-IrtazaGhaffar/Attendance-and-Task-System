import { prisma } from "../config/prisma.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Assign a task to a user by User ID
export const createTask = async (req, res) => {
    const { title, description, dueDate, userId } = req.body;
    if (!title || !description || !dueDate || !userId) return ApiResponse.validationError(res, 'All fields are required.');

    try {
        const task = await prisma.task.create({
            data: {
                title: title,
                description: description,
                dueDate: new Date(dueDate),
                userId: parseInt(userId),
            },
        });

        return ApiResponse.success(res, 'Task created successfully.', task);
    } catch (error) {
        return ApiResponse.error(res, 'An unexpected error occurred while creating the task. Please try again.', 500);
    }
}

// Get all tasks assigned to users
export const getAllTasks = async (req, res) => {
    try {
        const tasks = await prisma.task.findMany({
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                assignedTo: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });

        return ApiResponse.success(res, 'Tasks retrieved successfully.', tasks);
    } catch (error) {
        return ApiResponse.error(res, 'An unexpected error occurred while retrieving tasks. Please try again.', 500);
    }
}

// Get a specific task by ID
export const getTaskById = async (req, res) => {
    const { id } = req.body;
    if (!id) return ApiResponse.validationError(res, 'Task ID is required.');
    try {
        const task = await prisma.task.findUnique({
            where: {
                id: parseInt(id)
            },
            include: {
                assignedTo: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });

        return ApiResponse.success(res, 'Task retrieved successfully.', task);
    } catch (error) {
        return ApiResponse.error(res, 'An unexpected error occurred while retrieving the task. Please try again.', 500);
    }
}

// Get tasks assigned to a specific user by User ID
export const getTasksByUserId = async (req, res) => {
    const { userId } = req.body;
    if (!userId) return ApiResponse.validationError(res, 'User ID is required.');
    try {
        const tasks = await prisma.task.findMany({
            where: {
                userId: parseInt(userId)
            },
            include: {
                assignedTo: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });

        return ApiResponse.success(res, 'Tasks retrieved successfully.', tasks);
    } catch (error) {
        return ApiResponse.error(res, 'An unexpected error occurred while retrieving tasks. Please try again.', 500);
    }
}

export const getTasksByIdandUserId = async (req, res) => {
    const { id } = req.body;
    const { id: userId } = req.user;
    if (!userId) return ApiResponse.validationError(res, 'User ID is required.');
    try {
        const tasks = await prisma.task.findMany({
            where: {
                id: parseInt(id),
                userId: parseInt(userId),
            },
            include: {
                assignedTo: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });

        return ApiResponse.success(res, 'Tasks retrieved successfully.', tasks);
    } catch (error) {
        return ApiResponse.error(res, 'An unexpected error occurred while retrieving tasks. Please try again.', 500);
    }
}

// Update a task by Task ID
export const updateTask = async (req, res) => {
    const { id, title, description, dueDate, userId } = req.body;
    if (!id) return ApiResponse.validationError(res, 'Id and some fields are required.');

    try {
        const task = await prisma.task.update({
            where: {
                id: parseInt(id)
            },
            data: {
                title: title ? title : undefined,
                description: description ? description : undefined,
                dueDate: dueDate ? new Date(dueDate) : undefined,
                userId: userId ? parseInt(userId) : undefined,
            }
        });

        return ApiResponse.success(res, 'Task updated successfully.', task);
    } catch (error) {
        return ApiResponse.error(res, 'An unexpected error occurred while updating the task. Please try again.', 500);
    }
}

// Get tasks for CURRENT USER
export const getTasks = async (req, res) => {
    const id = req.user.id;

    if (!id) return ApiResponse.validationError(res, 'Task ID is required.');
    try {
        const task = await prisma.task.findMany({
            where: {
                userId: parseInt(id)
            },
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                assignedTo: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });

        return ApiResponse.success(res, 'Task retrieved successfully.', task);
    } catch (error) {
        return ApiResponse.error(res, 'An unexpected error occurred while retrieving the task. Please try again.', 500);
    }
}
// Get tasks for CURRENT USER for today
export const getTasksToday = async (req, res) => {
    const id = req.user.id;

    if (!id) return ApiResponse.validationError(res, 'User authentication required.');

    try {
        // Get start and end of today
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const tasks = await prisma.task.findMany({
            where: {
                userId: parseInt(id),
                dueDate: {
                    gte: startOfDay,
                    lte: endOfDay  // Use lte instead of lt for clarity
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                assignedTo: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });

        if (tasks.length === 0) {
            return ApiResponse.success(res, 'No tasks found for today.');
        }

        return ApiResponse.success(res, 'Tasks retrieved successfully.', tasks);

    } catch (error) {
        console.error('Error fetching today\'s tasks:', error);
        return ApiResponse.error(res, 'An unexpected error occurred while retrieving tasks. Please try again.', 500);
    }
}

// Submit a task by Task ID
export const submitTask = async (req, res) => {
    const { taskId, submitComment } = req.body;
    const userId = req.user.id;
    if (!userId) return ApiResponse.validationError(res, 'Task ID is required.');

    try {
        const task = await prisma.task.update({
            where: {
                id: parseInt(taskId),
                userId: parseInt(userId)
            },
            data: {
                submitComment: submitComment,
                submittedAt: new Date(),
            }
        });

        return ApiResponse.success(res, 'Task submitted successfully.', task);
    } catch (error) {
        return ApiResponse.error(res, 'An unexpected error occurred while submitting the task. Please try again.', 500);
    }
}

// Approve a task by Task ID
export const approveTask = async (req, res) => {
    const { taskId, adminComment } = req.body;
    if (!taskId) return ApiResponse.validationError(res, 'Task ID is required.');

    try {
        const task = await prisma.task.update({
            where: {
                id: parseInt(taskId)
            },
            data: {
                status: 'APPROVED',
                adminComment: adminComment,
                updatedAt: new Date(),
            }
        });

        return ApiResponse.success(res, 'Task approved successfully.', task);
    } catch (error) {
        return ApiResponse.error(res, 'An unexpected error occurred while approving the task. Please try again.', 500);
    }
}

// Reject a task by Task ID
export const rejectTask = async (req, res) => {
    const { taskId, adminComment } = req.body;
    const userId = req.user.id;
    if (!taskId) return ApiResponse.validationError(res, 'Task ID is required.');

    try {
        const task = await prisma.task.update({
            where: {
                id: parseInt(taskId)
            },
            data: {
                status: 'REJECTED',
                adminComment: adminComment,
                updatedAt: new Date(),
            }
        });

        return ApiResponse.success(res, 'Task rejected successfully.', task);
    } catch (error) {
        return ApiResponse.error(res, 'An unexpected error occurred while rejecting the task. Please try again.', 500);
    }
}