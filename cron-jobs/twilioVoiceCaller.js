// Import required modules
const cron = require('node-cron');
const User = require('../models/user.model');
const Task = require('../models/task.model');
const twilio = require('twilio');


const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Cron job to run every day at midnight
cron.schedule('0 0 * * *', async () => {
    try {
        // Query tasks with due dates passed and not completed
        const overdueTasks = await Task.find({ due_date: { $lt: new Date() }, status: { $ne: 'DONE' } });

        // Query users sorted by priority
        const userIds = overdueTasks.map(task => task.created_by);
        const users = await User.find({ user_id: { $in: userIds } }).sort({ priority: 1 });


        let previousUserAttendedCall = false;

        // Iterate through users and attempt to call them
        for (const user of users) {
                if(!previousUserAttendedCall){
                     
                    const call = await twilioClient.calls.create({
                        twiml: `<Response><Say voice="alice">Hello ${user.phone_number}, you have overdue tasks. Please login to your account to complete them.</Say></Response>`,
                        // Add the +91 country code before the phone number
                        to: '+91'+user.phone_number,
                        from: process.env.TWILIO_PHONE_NUMBER,
                    });
                    if (call && call.status === 'queued') {
                        previousUserAttendedCall = true;
                    } else {
                        // If the user didn't answer, break the loop and call the next user
                        console.log(`User ${user.phone_number} didn't answer. Calling the next user.`);
                        break;
                    }
                }
        }
    } catch (error) {
        console.error('Error initiating voice calls:', error);
    }
});
