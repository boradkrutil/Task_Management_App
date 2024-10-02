import Notice from "../models/notificationModel.js";
import Task from "../models/taskModel.js";

export const createTask = async (req, res) => {
    try {
      const { userId } = req.user;
  
      const { title, team, stage, date, priority, assets } = req.body;
  
      let text = "New task has been assigned to you";
      if (team?.length > 1) {
        text = text + ` and ${team?.length - 1} others.`;
      }
  
      text =
        text +
        ` The task priority is set a ${priority} priority, so check and act accordingly. The task date is ${new Date(
          date
        ).toDateString()}. Thank you!!!`;
  
      const activity = {
        type: "assigned",
        activity: text,
        by: userId,
      };
  
      const task = await Task.create({
        title,
        team,
        stage: stage.toLowerCase(),
        date,
        priority: priority.toLowerCase(),
        assets,
        activities: activity,
      });
  
      await Notice.create({
        team,
        text,
        task: task._id,
      });
  
      res
        .status(200)
        .json({ status: true,task, message: "Task created successfully." });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ status: false, message: error.message });
    }
  };
  
  export const duplicateTask = async (req, res) => {
    try {
      const { id } = req.params;
  
      const task = await Task.findById(id);
  
      const newTask = await Task.create({
        ...task,
        title: task.title + " - Duplicate",
      });
  
      newTask.team = task.team;
      newTask.subTasks = task.subTasks;
      newTask.assets = task.assets;
      newTask.priority = task.priority;
      newTask.stage = task.stage;
  
      await newTask.save();
  
      //alert users of the task
      let text = "New task has been assigned to you";
      if (task.team.length > 1) {
        text = text + ` and ${task.team.length - 1} others.`;
      }
  
      text =
        text +
        ` The task priority is set a ${
          task.priority
        } priority, so check and act accordingly. The task date is ${task.date.toDateString()}. Thank you!!!`;
  
      await Notice.create({
        team: task.team,
        text,
        task: newTask._id,
      });
  
      res
        .status(200)
        .json({ status: true, message: "Task duplicated successfully." });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ status: false, message: error.message });
    }
  };
  
  export const postTaskActivity = async (req, res) => {
    try {
      const { id } = req.params;
      const { userId } = req.user;
      const { type, activity } = req.body;
  
      const task = await Task.findById(id);
  
      const data = {
        type,
        activity,
        by: userId,
      };
  
      task.activities.push(data);
  
      await task.save();
  
      res
        .status(200)
        .json({ status: true, message: "Activity posted successfully." });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ status: false, message: error.message });
    }
  };
  
  export const getTasks = async (req, res) => {
    try {
      const { stage, isTrashed } = req.query;
  
      let query = { isTrashed: isTrashed ? true : false };
  
      if (stage) {
        query.stage = stage;
      }
  
      let queryResult = Task.find(query)
        .populate({
          path: "team",
          select: "name title email",
        })
        .sort({ _id: -1 });
  
      const tasks = await queryResult;
  
      res.status(200).json({
        status: true,
        tasks,
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ status: false, message: error.message });
    }
  };
  
  export const getTask = async (req, res) => {
    try {
      const { id } = req.params;
  
      const task = await Task.findById(id)
        .populate({
          path: "team",
          select: "name title role email",
        })
        .populate({
          path: "activities.by",
          select: "name",
        });
  
      res.status(200).json({
        status: true,
        task,
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ status: false, message: error.message });
    }
  };
  
  export const createSubTask = async (req, res) => {
    try {
      const { title, tag, date } = req.body;
  
      const { id } = req.params;
  
      const newSubTask = {
        title,
        date,
        tag,
      };
  
      const task = await Task.findById(id);
  
      task.subTasks.push(newSubTask);
  
      await task.save();
  
      res
        .status(200)
        .json({ status: true, message: "SubTask added successfully." });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ status: false, message: error.message });
    }
  };
  
  export const updateTask = async (req, res) => {
    try {
      const { id } = req.params;
      const { title, date, team, stage, priority, assets } = req.body;
  
      const task = await Task.findById(id);
  
      task.title = title;
      task.date = date;
      task.priority = priority;
      task.assets = assets;
      task.stage = stage;
      task.team = team;
  
      await task.save();
  
      res
        .status(200)
        .json({ status: true, message: "Task duplicated successfully." });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ status: false, message: error.message });
    }
  };
  
  export const trashTask = async (req, res) => {
    try {
      const { id } = req.params;
  
      const task = await Task.findById(id);
  
      task.isTrashed = true;
  
      await task.save();
  
      res.status(200).json({
        status: true,
        message: `Task trashed successfully.`,
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ status: false, message: error.message });
    }
  };
  
  export const deleteRestoreTask = async (req, res) => {
    try {
      const { id } = req.params;
      // const { actionType } = req.query;
      await Task.findByIdAndDelete(id);

      res.status(200).json({
        status: true,
        message: `Operation performed successfully.`,
      });

      // if (actionType === "delete") {
      // } else if (actionType === "deleteAll") {
      //   await Task.deleteMany({ isTrashed: true });
      // } else if (actionType === "restore") {
      //   const resp = await Task.findById(id);
  
      //   resp.isTrashed = false;
      //   resp.save();
      // } else if (actionType === "restoreAll") {
      //   await Task.updateMany(
      //     { isTrashed: true },
      //     { $set: { isTrashed: false } }
      //   );
      // }
  
      
    } catch (error) {
      console.log(error);
      return res.status(400).json({ status: false, message: error.message });
    }
  };