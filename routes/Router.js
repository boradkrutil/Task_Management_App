import express from 'express';
import userRouter from './userRouter.js';
import taskRouter from './taskRouter.js';

const router = express.Router()

router.use("/user", userRouter) //api user login
router.use("/task", taskRouter)

export default router