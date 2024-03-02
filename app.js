const express=require('express');
const app=express();
const {notFound, errorHandler} = require('./middlewares/errorhandler.middleware');


app.use(express.json());
app.use(express.urlencoded({extended:true}));


app.use("/api/v1/user",require('./routes/user.routes'));
app.use("/api/v1/tasks",require('./routes/task.routes'));
app.use("/api/v1/subtasks",require('./routes/subtask.routes'));

// Load cron jobs
require("./cron-jobs/taskPriorityUpdater");
require("./cron-jobs/twilioVoiceCaller");

// Error handling middleware
app.use(notFound);
app.use(errorHandler);
module.exports = app;