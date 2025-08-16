import { prisma } from "../config/prisma.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Request leave for CURRENT USER
export const requestLeave = async (req, res) => {
    try {
        const id = req.user.id;
        const { reason, date } = req.body;

        const leaveDate = new Date(date)
        if (leaveDate < new Date()) return ApiResponse.validationError(res, 'Leave date cannot be in the past.');
        if (leaveDate.getDay() === 0 || leaveDate.getDay() === 6) return ApiResponse.validationError(res, 'Leave cannot be requested on weekends (Saturday and Sunday).');

        if (!date || !reason) return ApiResponse.validationError(res, 'User ID and reason for leave are required.');

        const leaveRequest = await prisma.leaveRequest.create({
            data: {
                userId: parseInt(id),
                reason: reason,
                date: new Date(date),
                status: 'PENDING'
            }
        });

        return ApiResponse.success(res, 'Leave request submitted successfully.', leaveRequest);
    } catch (error) {
        return ApiResponse.error(res, 'An unexpected error occurred while requesting leave. Please try again.', 500);
    }
}

// Get all leave requests
export const getAllLeaveRequests = async (req, res) => {
    try {
        const leaveRequests = await prisma.leaveRequest.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });

        return ApiResponse.success(res, 'Leave requests retrieved successfully.', leaveRequests);
    } catch (error) {
        return ApiResponse.error(res, 'An unexpected error occurred while retrieving leave requests. Please try again.', 500);
    }
}

// Get leave request by CURRENT USER
export const getUserLeaveRequest = async (req, res) => {
    const { id } = req.user;
    if (!id) return ApiResponse.validationError(res, 'User ID is required.');
    try {
        const leaveRequests = await prisma.leaveRequest.findMany({
            where: {
                userId: parseInt(id)
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });

        return ApiResponse.success(res, 'Leave requests retrieved successfully.', leaveRequests);
    } catch (error) {
        return ApiResponse.error(res, 'An unexpected error occurred while retrieving leave requests. Please try again.', 500);
    }
}

// Get leave request by ID
export const getLeaveRequestById = async (req, res) => {
    const { id } = req.body;
    if (!id) return ApiResponse.validationError(res, 'Request ID is required.');
    try {
        const leaveRequests = await prisma.leaveRequest.findMany({
            where: {
                id: parseInt(id)
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });

        return ApiResponse.success(res, 'Leave requests retrieved successfully.', leaveRequests);
    } catch (error) {
        return ApiResponse.error(res, 'An unexpected error occurred while retrieving leave requests. Please try again.', 500);
    }
}

// Get leave request by user ID
export const getLeaveRequestByUserId = async (req, res) => {
    const { userId } = req.body;
    if (!userId) return ApiResponse.validationError(res, 'User ID is required.');
    try {
        const leaveRequests = await prisma.leaveRequest.findMany({
            where: {
                userId: parseInt(userId)
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });

        return ApiResponse.success(res, 'Leave requests retrieved successfully.', leaveRequests);
    } catch (error) {
        return ApiResponse.error(res, 'An unexpected error occurred while retrieving leave requests. Please try again.', 500);
    }
}

// Approve leave request
export const approveLeaveRequest = async (req, res) => {
    try {
        const { id, adminComment } = req.body;

        if (!id) return ApiResponse.validationError(res, 'Request ID is required.');

        const result = await prisma.$transaction(async (tx) => {
            // Check if leave request exists
            const leaveRequestExists = await tx.leaveRequest.findUnique({
                where: { id: parseInt(id) }
            });

            if (!leaveRequestExists) {
                throw new Error('Leave request not found');
            }

            if (leaveRequestExists.status !== 'PENDING') {
                throw new Error('Leave request is not in PENDING status');
            }

            // Validate leave date
            const leaveDate = new Date(leaveRequestExists.date);
            if (leaveDate < new Date()) {
                throw new Error('Leave date cannot be in the past');
            }

            if (leaveDate.getDay() === 0 || leaveDate.getDay() === 6) {
                throw new Error('Leave cannot be requested on weekends (Saturday and Sunday)');
            }

            // Check if attendance already exists for this date and user
            const existingAttendance = await tx.attendance.findFirst({
                where: {
                    userId: leaveRequestExists.userId,
                    date: leaveDate,
                },
            });

            if (existingAttendance) {
                throw new Error('Attendance record already exists for this date');
            }

            // Approve the leave request
            const leaveRequest = await tx.leaveRequest.update({
                where: { id: parseInt(id) },
                data: {
                    status: 'APPROVED',
                    adminComment: adminComment || 'Leave Granted'
                },
            });

            // Create attendance record
            const addInAttendance = await tx.attendance.create({
                data: {
                    userId: leaveRequest.userId,
                    date: leaveDate,
                    status: 'LEAVE',
                }
            });

            return leaveRequest;
        });

        return ApiResponse.success(res, 'Leave request approved and attendance updated.', result);
    } catch (error) {

        // Handle specific error cases
        if (error.message === 'Leave request not found') return ApiResponse.notFound(res, 'Leave request not found.');


        if (error.message === 'Leave request is not in PENDING status') return ApiResponse.validationError(res, 'Leave request is not in PENDING status.');


        if (error.message === 'Leave date cannot be in the past') return ApiResponse.validationError(res, 'Leave date cannot be in the past.');


        if (error.message === 'Leave cannot be requested on weekends (Saturday and Sunday)') return ApiResponse.validationError(res, 'Leave cannot be requested on weekends (Saturday and Sunday).');


        if (error.message === 'Attendance record already exists for this date') return ApiResponse.validationError(res, 'Attendance record already exists for this date.');


        return ApiResponse.error(
            res,
            'An unexpected error occurred while approving the leave request. Please try again.',
            500
        );
    }
};

// Reject leave request
export const rejectLeaveRequest = async (req, res) => {
    try {
        const { id, adminComment } = req.body;

        if (!id) return ApiResponse.validationError(res, 'Request ID is required.');

        const leave = await prisma.leaveRequest.findUnique({
            where: {
                id: parseInt(id),
                status: 'PENDING'
            }
        })

        if (!leave) return ApiResponse.success(res, "Leave is already approved or rejected.")

        const leaveRequest = await prisma.leaveRequest.update({
            where: { id: parseInt(id) },
            data: { status: 'REJECTED', adminComment: adminComment || "Leave Rejected" }
        });

        return ApiResponse.success(res, 'Leave request rejected successfully.', leaveRequest);
    } catch (error) {
        return ApiResponse.error(res, 'An unexpected error occurred while approving the leave request. Please try again.', 500);
    }
}