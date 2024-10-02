import express from 'express';
import { isAdminRoute, protectRoute } from '../middleware/authMiddleware.js';
import { createSubTask, createTask, deleteRestoreTask, duplicateTask, getTask, getTasks, postTaskActivity, trashTask, updateTask } from '../controllers/taskController.js';

const taskRouter = express.Router()

taskRouter.post("/create", protectRoute, isAdminRoute, createTask);
taskRouter.post("/duplicate/:id", protectRoute, isAdminRoute, duplicateTask);
taskRouter.post("/activity/:id", protectRoute, postTaskActivity);

taskRouter.get("/", protectRoute, getTasks);
taskRouter.get("/:id", protectRoute, getTask);

taskRouter.put("/create-subtask/:id", protectRoute, isAdminRoute, createSubTask);
taskRouter.put("/update/:id", protectRoute, isAdminRoute, updateTask);
taskRouter.put("/:id", protectRoute, isAdminRoute, trashTask);

taskRouter.delete(
  "/delete-restore/:id?",
  protectRoute,
  isAdminRoute,
  deleteRestoreTask
);

export default taskRouter