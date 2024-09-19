require("dotenv").config({path : "../.env"});
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URL).then(()=>{
    console.log('Connected to MongoDB')
}).catch((err)=>{
    console.error('Error connecting to MongoDB:', err);
    process.exit(1); //it the process with an error code
})