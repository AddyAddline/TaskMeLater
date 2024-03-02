const Task = require("../models/task.model")
const SubTask = require("../models/subtask.model")
const ApiError = require("../utils/ApiError")
const asyncHandler = require("../utils/asyncHandler")
const calculatePriority = require("../utils/calculatePriority")
const { SubTaskStatus , TaskStatus} = require("../utils/enums")

const getUserTasks = asyncHandler(async (req, res) => {
    const user_id = req.user.user_id; 
    
    let tasksQuery= {created_by: user_id, isDeleted: false};
    if (req.query.priority) {
        tasksQuery.priority = parseInt(req.query.priority);
      }
      if(req.query.status){
        tasksQuery.status = req.query.status;
      }
      if(req.query.due_date){
        tasksQuery.due_date = new Date(req.query.due_date);
      }
          // Implement pagination
      const tasks = await Task.find(tasksQuery);

      if(tasks.length===0){
        throw new ApiError(404, "No tasks found with the given filters")
      }
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.limit) || 10;
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const totalTasks = tasks.length;
      const totalPages = Math.ceil(totalTasks / pageSize);

      const tasksToReturn = tasks.slice(startIndex, endIndex);
      res.status(200).json({
        success: true,
        message: "Tasks retrieved successfully",
        data: {
          tasks:tasksToReturn,
          pagination: {
            totalTasks,
            totalPages,
            currentPage: page,
            pageSize
          }
        },
      });
  

    });
      



const createTask = asyncHandler(async (req, res) => {
    const { title, description, due_date } = req.body;

    if(!title || !description || !due_date){
        throw new ApiError(400, "Title, description and due date are required")
    }
    const due_date_obj = new Date(due_date);
    if(due_date_obj < new Date()){
        throw new ApiError(400, "Due date cannot be in the past")
    }

   

   //cacualte priority 
    const priority = calculatePriority(due_date_obj);
    const task = new Task({
        title,
        description,
        due_date: due_date_obj,
        priority,
        created_by: parseInt(req.user.user_id),
    });
    await task.save().then((task) => {
        res.status(201).json({
            success: true,
            message: "Task created successfully",
            data:{
                title: task.title,
                description: task.description,
                due_date: task.due_date,
                priority: task.priority
            }
        });
    }
    );



})
const updateTaskData = asyncHandler(async (req, res) => {
    const task_id = req.params.taskId;
    const { due_date, status } = req.body;
    

    if (!due_date && !status) {
        throw new ApiError(400, "Due date or status is required");
    }
    if (due_date && !due_date.match(/^\d{4}-\d{2}-\d{2}$/)) {
        throw new ApiError(400, "Due date must be in the format YYYY-MM-DD");
    }
    if (status && !Object.values(TaskStatus).includes(status)) {
        throw new ApiError(400, "Status must be TODO, IN_PROGRESS, or DONE");
    }

    const updateFields = { created_by: req.user.user_id };

    if (due_date) {
        const date = new Date(due_date);
        if (date < new Date()) {
            throw new ApiError(400, "Due date cannot be in the past");
        }
        updateFields.due_date = date;
        const priority = calculatePriority(date);
        updateFields.priority = priority;
    }
    if (status) {
        updateFields.status = status;
    }

    const updatedTask = await Task.findOneAndUpdate({ task_id }, updateFields, { new: true });
    if (!updatedTask) {
        throw new ApiError(404, "Task not found");
    }

    res.status(200).json({
        success: true,
        message: "Task updated successfully",
        data: {
            due_date: updatedTask.due_date,
            priority: updatedTask.priority,
            status: updatedTask.status
        }
    });
});


const updateTaskStatus= asyncHandler(async(task_id)=>{
    const task = await Task.findOne({task_id});
    if (!task) {
        throw new ApiError(404, 'Task not found');
    }
    const subtasks = await SubTask.find({ 
        task_id,
        isDeleted: false,
     });

    const isAnySubtaskFinished = subtasks.some(subtask => subtask.status === SubTaskStatus.COMPLETE);
    const areAllSubtasksCompleted = subtasks.every(subtask => subtask.status === SubTaskStatus.COMPLETE);

    if (areAllSubtasksCompleted) {
        task.status = TaskStatus.DONE;
    } else if (isAnySubtaskFinished) {
        task.status = TaskStatus.IN_PROGRESS;
    } else {
        task.status = TaskStatus.TODO;
    }
    await task.save();



});

const softDeleteTask= asyncHandler(async (req, res) => {
    const task_id = req.params.taskId;
    const deletedTask = await Task.findOneAndUpdate
    ({task_id, created_by: req.user.user_id, isDeleted: false},
        {isDeleted: true, deleted_at: new Date()}, {new: true});
    if(!deletedTask){
        throw new ApiError(404, "Task not found")
    }

    //delete associated subtasks
    const deletedSubtasks = await SubTask.updateMany({task_id, isDeleted: false,created_by:req.user_id }, {isDeleted: true, deleted_at: new Date()});
    

    res.status(200).json({
        success: true,
        message: "Task and associated subtasks deleted successfully",
        data:{
            task_id: deletedTask.task_id,
            isDeleted: deletedTask.isDeleted
        }
    });

});
module.exports = {getUserTasks,createTask,updateTaskStatus,updateTaskData,softDeleteTask}

