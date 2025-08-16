import express from 'express';
import { SignIn, SignUp } from '../controllers/auth.controller.js';
const authRouter = express.Router()

authRouter
.post('/signin', SignIn)
.post('/signup', SignUp)

export { authRouter }