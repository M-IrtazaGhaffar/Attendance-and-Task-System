// Import modules
import chalk from 'chalk';
import express from 'express';
import cors from 'cors';
import cookieParser from "cookie-parser";

import { roleBasedAccess } from './middlewares/auth.js';
import { authRouter } from './routes/auth.route.js';
import { userRouter } from './routes/user.route.js';
import { adminRouter } from './routes/admin.route.js';
import { PORT } from './config/env.js';
import { requestTest } from './utils/requestTest.js';

// Assignments
const server = express()

// Middlewares
server.use(cors({ methods: '*' }))
server.use(express.urlencoded({ extended: true }))
server.use(express.json({ limit: '100mb' }))
server.use(cookieParser());

// Testing Server
server.get("/test", requestTest);
server.use((err, req, res, next) => {
    console.log(chalk.redBright(err.stack));
    res.status(500).json({ message: "Internal Server Error" });
});

// Routes
server.use('/v1/auth', authRouter)
server.use('/v1/user', roleBasedAccess(['USER']), userRouter)
server.use('/v1/admin', roleBasedAccess(['ADMIN']), adminRouter)

// Listening
server.listen(PORT, (err) => {
    if (err) console.log(chalk.redBright('Some Error Occured when starting the Server ::'), err);
    else console.log(chalk.greenBright('Server Started Listening at port ::'), chalk.yellow(PORT));
})