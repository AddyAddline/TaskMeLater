const SubTask = require("../models/subtask.model")
const ApiError = require("../utils/ApiError")
const asyncHandler = require("../utils/asyncHandler")
const {SubTaskStatus}= require("../utils/enums")
const {updateTaskStatus}= require("./task.controllers")

const getSubTasks = asyncHandler(async (req, res) => {
    const user_id = req.user.user_id
    let subtasksQuery= {created_by: user_id, isDeleted: false};
    if (req.query.status) {
        subtasksQuery.status = parseInt(req.query.status);
      }
        if(req.query.task_id){
            subtasksQuery.task_id = parseInt(req.query.task_id);
        }
        const subtasks = await SubTask.find(subtasksQuery);
        if(subtasks.length===0){
            throw new ApiError(404, "No subtasks found with the given filters")
        }
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.limit) || 10;
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const totalSubTasks = subtasks.length;
        const totalPages = Math.ceil(totalSubTasks / pageSize);

        const subtasksToReturn = subtasks.slice(startIndex, endIndex);
        res.status(200).json({
            success: true,
            message: "Subtasks retrieved successfully",
            data: {
                subtasks:subtasksToReturn,
                pagination: {
                    totalSubTasks,
                    totalPages,
                    currentPage: page,
                    pageSize
                }
            },
        });


    
})

const createSubTask = asyncHandler(async (req, res) => {
    const { task_id } = req.body;
    
    if(!task_id){
        throw new ApiError(400, "Task ID is required")
    }
    if(typeof task_id !== "number" || isNaN(task_id)){
        throw new ApiError(400, "Task ID must be a number")
    }
    const subtask = new SubTask({
        task_id,
        created_by: req.user.user_id
    });
    await subtask.save().then( async (subtask) => {
       await updateTaskStatus(task_id);
        res.status(201).json({
            success: true,
            message: "Subtask created successfully",
            data:{
                subtask_id: subtask.subtask_id,
                task_id: subtask.task_id,
                status: subtask.status
            }
        })
    }
    ).catch((error) => {
        throw new ApiError(500, "Could not create subtask due to an unknown error")
    }
    );

})

const updateSubTaskStatus = asyncHandler(async (req, res) => {
    const subtask_id = req.params.subtaskId;
    const { status } = req.body;
    if(status===undefined || status===null){
        throw new ApiError(400, "Status is required")
    }
    if(typeof status !== "number" || isNaN(status)){
        throw new ApiError(400, "Status must be a number")
    }
    if(status!==0 && status!==1){
        throw new ApiError(400, "Status must be 0 or 1 (0 for incomplete and 1 for complete)")
    }
    if(!Object.values(SubTaskStatus).includes(status)){
        throw new ApiError(400, "Status must be 0 or 1 (0 for incomplete and 1 for complete)")
    }
    const subtask = await SubTask.findOne({subtask_id, isDeleted: false});
    if(!subtask){
        throw new ApiError(404, "Subtask not found")
    }
    if(subtask.status === status){
        throw new ApiError(400, "Subtask is already in this status")
    }
    subtask.status = status;
    await subtask.save().then(async (subtask) => {
        await updateTaskStatus(subtask.task_id);
        res.status(200).json({
            success: true,
            message: "Subtask status updated successfully",
            data:{
                subtask_id: subtask.subtask_id,
                task_id: subtask.task_id,
                status: subtask.status
            }
        })
    }
    ).catch((error) => {
        throw new ApiError(500, "Could not update subtask status due to an unknown error")
    }
    );

})

const softDeleteSubTask= asyncHandler(async (req, res) => {
    const subtask_id = req.params.subtaskId;

if(!subtask_id){
    throw new ApiError(400, "Subtask ID is required")
}
if(typeof subtask_id !== "number" || isNaN(subtask_id)){
    throw new ApiError(400, "Subtask ID must be a number")
}

    const subtask = await SubTask.findOne({subtask_id });
    if(!subtask){
        throw new ApiError(404, "Subtask not found")
    }
    if(subtask.isDeleted){
        throw new ApiError(400, "Subtask is already deleted")
    }
     subtask.isDeleted = true;
     subtask.deleted_at = new Date();

    await subtask.save().then(async (subtask) => {
        await updateTaskStatus(subtask.task_id);
        res.status(200).json({
            success: true,
            message: "Subtask deleted successfully",
            data:{
                subtask_id: subtask.subtask_id,
                isDeleted: subtask.isDeleted
            }
        })
    }
    ).catch((error) => {
        throw new ApiError(500, "Could not delete subtask due to an unknown error")
    }
    );

})
module.exports = {
    createSubTask,
    updateSubTaskStatus,
    softDeleteSubTask,
    getSubTasks
}