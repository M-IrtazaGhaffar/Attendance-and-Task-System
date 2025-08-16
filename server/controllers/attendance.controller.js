import { prisma } from "../config/prisma.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Mark attendance for the CURRENT USER
export const markAttendance = async (req, res) => {
    try {
        const userId = req.user.id;
        const attendance = await prisma.attendance.create({
            data: {
                userId: parseInt(userId),
                status: 'PRESENT'
            }
        })

        return ApiResponse.success(res, 'Attendance marked successfully.', attendance);

    } catch (error) {

        if (error.code === 'P2002') return ApiResponse.error(res, 'Attendance for today has already been marked.', 409);

        return ApiResponse.error(res, 'An unexpected error occurred while marking attendance. Please try again.', 500);
    }
}

// Get attendance records for the CURRENT USER of all time
export const getAttendance = async (req, res) => {
    try {
        const userId = req.user.id;
        const attendanceRecords = await prisma.attendance.findMany({
            where: {
                userId: parseInt(userId)
            },
            orderBy: {
                createdAt: 'desc'
            },
            select: {
                id: true,
                status: true,
                createdAt: true,
                updatedAt: true,
                date: true,
                user: {
                    select: {
                        id: true,
                        uuid: true,
                        name: true
                    }
                }
            }
        });

        return ApiResponse.success(res, 'Attendance records retrieved successfully.', attendanceRecords);

    } catch (error) {
        return ApiResponse.error(res, 'An unexpected error occurred while retrieving attendance records. Please try again.', 500);
    }
}

// Get attendance records for CURRENT USER for today
export const getAttendanceToday = async (req, res) => {
    try {
        const userId = req.user.id;

        // const now = new Date();
        // const startOfTodayUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0, 0));
        // const endOfTodayUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 23, 59, 59, 999));

        // const attendanceRecords = await prisma.attendance.findMany({
        //   where: {
        //     userId: parseInt(userId),
        //     date: {
        //       gte: startOfTodayUTC,
        //       lt: endOfTodayUTC
        //     }
        //   },
        //   orderBy: { createdAt: 'desc' },
        //   select: {
        //     id: true,
        //     status: true,
        //     date: true,
        //     user: {
        //       select: {
        //         id: true,
        //         uuid: true,
        //         name: true
        //       }
        //     },
        //     createdAt: true,
        //     updatedAt: true
        //   }
        // });

        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        const todayString = `${yyyy}-${mm}-${dd}T00:00:00.000Z`;

        const attendanceRecords = await prisma.attendance.findMany({
            where: {
                userId: parseInt(userId),
                date: new Date(todayString)
            },
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                status: true,
                date: true,
                user: {
                    select: {
                        id: true,
                        uuid: true,
                        name: true
                    }
                },
                createdAt: true,
                updatedAt: true
            }
        });


        return ApiResponse.success(res, 'Attendance records retrieved successfully.', attendanceRecords);
    } catch (error) {
        return ApiResponse.error(res, 'An unexpected error occurred while retrieving attendance records. Please try again.', 500);
    }
}


// Get attendance record by ID
export const getAttendanceById = async (req, res) => {
    try {
        const { id } = req.body;

        if (!id) return ApiResponse.validationError(res, 'Attendance ID is required.');
        const attendanceRecord = await prisma.attendance.findUnique({
            where: {
                id: parseInt(id)
            },
            select: {
                id: true,
                uuid: true,
                date: true,
                user: {
                    select: {
                        id: true,
                        uuid: true,
                        name: true,
                    }
                },
                status: true,
                createdAt: true,
                updatedAt: true,
            }
        });

        if (!attendanceRecord) return ApiResponse.error(res, 'Attendance record not found.', 404);

        return ApiResponse.success(res, 'Attendance record retrieved successfully.', attendanceRecord);

    } catch (error) {
        return ApiResponse.error(res, 'An unexpected error occurred while retrieving the attendance record. Please try again.', 500);
    }
}

// Get all attendance records by user ID
export const getAttendanceByUserId = async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) return ApiResponse.validationError(res, 'User ID is required.');
        const attendanceRecord = await prisma.attendance.findMany({
            where: {
                userId: parseInt(userId)
            },
            orderBy: {
                createdAt: 'desc'
            },
            select: {
                id: true,
                uuid: true,
                date: true,
                user: {
                    select: {
                        id: true,
                        uuid: true,
                        name: true,
                    }
                },
                status: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        if (!attendanceRecord) return ApiResponse.error(res, 'Attendance record not found.', 404);

        return ApiResponse.success(res, 'Attendance record retrieved successfully.', attendanceRecord);

    } catch (error) {
        return ApiResponse.error(res, 'An unexpected error occurred while retrieving the attendance record. Please try again.', 500);
    }
}

// Get all attendance records for all users of all time
export const getAttendanceOfAllTime = async (req, res) => {
    try {
        const attendanceRecords = await prisma.attendance.findMany({
            orderBy: {
                createdAt: 'desc'
            },
            select: {
                id: true,
                status: true,
                date: true,
                user: {
                    select: {
                        id: true,
                        uuid: true,
                        name: true
                    }
                },
                createdAt: true,
                updatedAt: true
            }
        });

        return ApiResponse.success(res, 'All attendance records retrieved successfully.', attendanceRecords);

    } catch (error) {
        return ApiResponse.error(res, 'An unexpected error occurred while retrieving all attendance records. Please try again.', 500);
    }
}

// Get all attendance records for today for all users
export const getAllAttendanceToday = async (req, res) => {
    try {
        // Get today's date in YYYY-MM-DD format
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        const todayString = `${yyyy}-${mm}-${dd}T00:00:00.000Z`;

        const attendanceRecords = await prisma.attendance.findMany({
            where: {
                date: new Date(todayString)
            },
            orderBy: {
                createdAt: 'desc'
            },
            select: {
                id: true,
                status: true,
                date: true,
                user: {
                    select: {
                        id: true,
                        uuid: true,
                        name: true
                    }
                },
                createdAt: true,
                updatedAt: true
            }
        });

        return ApiResponse.success(
            res,
            'All attendance records for today retrieved successfully.',
            attendanceRecords
        );
    } catch (error) {
        return ApiResponse.error(
            res,
            'An unexpected error occurred while retrieving all attendance records for today. Please try again.',
            500
        );
    }
};


// Get all attendance records for all users by date
export const getAllAttendanceByDate = async (req, res) => {
    try {
        const { date } = req.body;

        if (!date) return ApiResponse.validationError(res, 'Date is required.');

        // Normalize provided date to UTC midnight
        const targetDate = new Date(date);
        const yyyy = targetDate.getFullYear();
        const mm = String(targetDate.getMonth() + 1).padStart(2, '0');
        const dd = String(targetDate.getDate()).padStart(2, '0');
        const targetDateString = `${yyyy}-${mm}-${dd}T00:00:00.000Z`;

        const attendanceRecords = await prisma.attendance.findMany({
            where: {
                date: new Date(targetDateString)
            },
            orderBy: {
                createdAt: 'desc'
            },
            select: {
                id: true,
                uuid: true,
                status: true,
                date: true,
                user: {
                    select: {
                        id: true,
                        uuid: true,
                        name: true,
                        email: true
                    }
                },
                createdAt: true,
                updatedAt: true
            }
        });

        return ApiResponse.success(
            res,
            `Attendance records for ${targetDate.toDateString()} retrieved successfully.`,
            attendanceRecords
        );
    } catch (error) {
        console.error('Error retrieving attendance records:', error);
        return ApiResponse.error(
            res,
            'An unexpected error occurred while retrieving attendance records. Please try again.',
            500
        );
    }
};


// Get all ABSENT attendance records for today for all users
export const getAllAbsentAttendanceToday = async (req, res) => {
    try {
        const date = new Date(new Date().setHours(0, 0, 0, 0))

        const absentStudents = await prisma.$queryRaw`
SELECT u."id", u."name", u."email" FROM Users u LEFT JOIN Attendance a ON u."id" = a."userId" WHERE a."id" IS NULL OR a."status" = 'ABSENT' AND a."date" = CURRENT_DATE;
`;


        return ApiResponse.success(res, 'All attendance absent records for today retrieved successfully.', absentStudents);

    } catch (error) {
        return ApiResponse.error(res, 'An unexpected error occurred while retrieving all attendance records for today. Please try again.', 500);
    }
}

// Get all ABSENT attendance records for all users by date
export const getAllAbsentAttendanceByDate = async (req, res) => {
    try {
        const { date } = req.body;

        if (!date) return ApiResponse.validationError(res, 'Date is required.')

        const absentStudents = await prisma.user.findMany({
            where: {
                OR: [
                    {
                        Attendance: {
                            none: {
                                date: new Date(date)
                            }
                        }
                    },
                    {
                        Attendance: {
                            some: {
                                date: new Date(date),
                                status: 'ABSENT'
                            }
                        }
                    }
                ]
            },
            select: {
                id: true,
                name: true,
                email: true,
            }
        });

        return ApiResponse.success(res, 'All attendance absent records for today retrieved successfully.', absentStudents);

    } catch (error) {
        return ApiResponse.error(res, 'An unexpected error occurred while retrieving all attendance records for today. Please try again.', 500);
    }
}

// Attendance Grade of CURRENT USER
export const attendanceGrade = async (req, res) => {
    try {
        const { startDate, endDate } = req.body
        const userId = req.user.id

        if (!userId) return ApiResponse.validationError(res, 'User ID is required.');
        if (!startDate || !endDate) return ApiResponse.validationError(res, 'Start Date and End Date is required.');

        // Convert input strings to Date objects
        const start = new Date(startDate);
        const end = new Date(endDate);

        // user ki attendance leni ha start date se end date tak

        const userAttendance = await prisma.attendance.findMany({
            where: {
                userId: parseInt(userId),
                status: 'PRESENT',
                createdAt: {
                    gte: new Date(start.setHours(0, 0, 0, 0)),
                    lte: new Date(end.setHours(23, 59, 59, 999))
                }
            }
        })

        // Calculate total days between start and end
        const diffMs = end.getTime() - start.getTime();
        const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24)); // +1 if inclusive

        // Example: percentage calculation
        const presentCount = userAttendance.length;
        const percentage = (presentCount / diffDays) * 100;

        let grade = '';
        switch (true) {
            case (percentage > 90):
                grade = 'A'
                break;
            case (percentage > 80):
                grade = 'B'
                break;
            case (percentage > 70):
                grade = 'C'
                break;
            case (percentage > 60):
                grade = 'D'
                break;
            case (percentage > 50):
                grade = 'E'
                break;

            default:
                grade = 'F'
                break;
        }

        return ApiResponse.success(res, 'Attendance grade calculated successfully.', { percentage, presentCount, totalDays: diffDays, grade });
    } catch (error) {
        return ApiResponse.error(res, 'An unexpected error occurred while calculating attendance grade. Please try again.', 500);
    }
}

// Attendance Grade of CURRENT USER
export const attendanceGradeByUserId = async (req, res) => {
    try {
        const { startDate, endDate, userId } = req.body

        if (!userId || !startDate || !endDate) return ApiResponse.validationError(res, 'User ID, Start and End Dates are required.');

        // Convert input strings to Date objects
        const start = new Date(startDate);
        const end = new Date(endDate);

        // user ki attendance leni ha start date se end date tak

        const userAttendance = await prisma.attendance.findMany({
            where: {
                userId: parseInt(userId),
                status: 'PRESENT',
                createdAt: {
                    gte: new Date(start.setHours(0, 0, 0, 0)),
                    lte: new Date(end.setHours(23, 59, 59, 999))
                }
            }
        })

        // Calculate total days between start and end
        const diffMs = end.getTime() - start.getTime();
        const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24)); // +1 if inclusive

        // Example: percentage calculation
        const presentCount = userAttendance.length;
        const percentage = (presentCount / diffDays) * 100;

        let grade = '';
        switch (true) {
            case (percentage > 90):
                grade = 'A'
                break;
            case (percentage > 80):
                grade = 'B'
                break;
            case (percentage > 70):
                grade = 'C'
                break;
            case (percentage > 60):
                grade = 'D'
                break;
            case (percentage > 50):
                grade = 'E'
                break;

            default:
                grade = 'F'
                break;
        }

        return ApiResponse.success(res, 'Attendance grade calculated successfully.', { percentage, presentCount, totalDays: diffDays, grade });
    } catch (error) {
        return ApiResponse.error(res, 'An unexpected error occurred while calculating attendance grade. Please try again.', 500);
    }
}