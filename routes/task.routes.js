const {Router} = require('express');
const { createTask,getUserTasks,softDeleteTask, updateTaskData } = require('../controllers/task.controllers');
const verifyJWT = require('../middlewares/auth.middleware');

const router=Router();
router.route("/").get(verifyJWT,getUserTasks);
router.route("/create").post(verifyJWT,createTask);
router.route("/:taskId")
.patch(verifyJWT,updateTaskData)
.delete(verifyJWT,softDeleteTask);


module.exports=router;