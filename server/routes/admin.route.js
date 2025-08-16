import express from 'express';
import { getAllUsers, getUser, getUserById, updateUser } from '../controllers/user.controller.js';
import { attendanceGrade, attendanceGradeByUserId, getAllAbsentAttendanceByDate, getAllAbsentAttendanceToday, getAllAttendanceByDate, getAllAttendanceToday, getAttendance, getAttendanceById, getAttendanceByUserId, getAttendanceOfAllTime, getAttendanceToday, markAttendance } from '../controllers/attendance.controller.js';
import { approveLeaveRequest, getAllLeaveRequests, getLeaveRequestById, getLeaveRequestByUserId, getUserLeaveRequest, rejectLeaveRequest, requestLeave } from '../controllers/leave.controller.js';
import { approveTask, createTask, getAllTasks, getTaskById, getTasks, getTasksByIdandUserId, getTasksByUserId, getTasksToday, rejectTask, submitTask, updateTask } from '../controllers/task.controller.js';
const adminRouter = express.Router()

adminRouter
    .post('/update', updateUser)
    .post('/getuser', getUser)
    .post('/getuserbyid', getUserById)
    .post('/getallusers', getAllUsers)
    .post('/getattendance', getAttendance)
    .post('/getattendancetoday', getAttendanceToday)
    .post('/markattendance', markAttendance)
    .post('/getattendanceofalltime', getAttendanceOfAllTime)
    .post('/getattendancebyid', getAttendanceById)
    .post('/getattendancebyuserid', getAttendanceByUserId)
    .post('/getallattendancetoday', getAllAttendanceToday)
    .post('/getallattendancebydate', getAllAttendanceByDate)
    .post('/getallabsentattendancetoday', getAllAbsentAttendanceToday)
    .post('/getallabsentattendancebydate', getAllAbsentAttendanceByDate)
    .post('/attendancegrade', attendanceGrade)
    .post('/attendancegradebyid', attendanceGradeByUserId)
    .post('/requestleave', requestLeave)
    .post('/getuserleaverequest', getUserLeaveRequest)
    .post('/getallleaverequests', getAllLeaveRequests)
    .post('/getleaverequestbyid', getLeaveRequestById)
    .post('/getleaverequestbyuserid', getLeaveRequestByUserId)
    .post('/approveleaverequest', approveLeaveRequest)
    .post('/rejectleaverequest', rejectLeaveRequest)
    .post('/createTask', createTask)
    .post('/getalltasks', getAllTasks)
    .post('/gettaskbyid', getTaskById)
    .post('/gettaskbyuserid', getTasksByUserId)
    .post('/gettaskbyidanduserid', getTasksByIdandUserId)
    .post('/updatetask', updateTask)
    .post('/gettasks', getTasks)
    .post('/gettaskstoday', getTasksToday)
    .post('/submittask', submitTask)
    .post('/approvetask', approveTask)
    .post('/rejecttask', rejectTask)

export { adminRouter }