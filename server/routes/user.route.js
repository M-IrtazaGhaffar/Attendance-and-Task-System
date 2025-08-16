import express from 'express';
import { getUser, updateUser } from '../controllers/user.controller.js';
import { attendanceGrade, getAttendance, getAttendanceToday, markAttendance } from '../controllers/attendance.controller.js';
import { getUserLeaveRequest, requestLeave } from '../controllers/leave.controller.js';
import { getTaskById, getTasks, getTasksByIdandUserId, getTasksToday, submitTask } from '../controllers/task.controller.js';
const userRouter = express.Router()

userRouter
    .post('/update', updateUser)
    .post('/getuser', getUser)
    .post('/markattendance', markAttendance)
    .post('/getattendance', getAttendance)
    .post('/getattendancetoday', getAttendanceToday)
    .post('/requestleave', requestLeave)
    .post('/getuserleaverequest', getUserLeaveRequest)
    .post('/gettasks', getTasks)
    .post('/gettaskstoday', getTasksToday)
    .post('/gettaskbyid', getTaskById)
    .post('/gettaskbyidanduserid', getTasksByIdandUserId)
    .post('/submittask', submitTask)
    .post('/attendancegrade', attendanceGrade)

export { userRouter }