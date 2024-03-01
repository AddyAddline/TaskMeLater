require('dotenv').config();
const mongoose = require('mongoose');
const connectDB= require('./db/index');
const app = require('./app');

// Connect to database
connectDB().then(() => {
    // Start the server
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    });
   
    app.on('error', (err) => {
        console.log('Error in server', err);
    });
}
).catch((err) => {
    console.log('Error connecting to database', err);
}
);