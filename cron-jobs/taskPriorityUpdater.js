
const cron = require('node-cron');
const Task = require('../models/task.model');
const calculatePriority = require('../utils/calculatePriority');

// Cron job to run daily at midnight
cron.schedule('0 0 0 * * *', async () => {
    try {
        // Query tasks with due dates in the past and not completed
        const overdueTasks = await Task.find({ due_date: { $lt: new Date() }, status: { $ne: 'DONE' } });

        // Update priority of each overdue task based on due date
        for (const task of overdueTasks) {
            const priority = calculatePriority(task.due_date);
            task.priority = priority;
            await task.save();
        }

        console.log('Task priorities updated successfully.');
    } catch (error) {
        console.error('Error updating task priorities:', error);
    }
});

