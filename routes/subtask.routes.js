const {Router} = require('express');
const { createSubTask, softDeleteSubTask ,updateSubTaskStatus, getSubTasks} = require('../controllers/subtask.controllers');
const verifyJWT = require('../middlewares/auth.middleware');


const router=Router();
router.route("/").get(verifyJWT,getSubTasks);
router.route("/create").post(verifyJWT,createSubTask);
router.route("/:subtaskId")
.patch(verifyJWT,updateSubTaskStatus)
.delete(verifyJWT,softDeleteSubTask);
module.exports=router;