require("dotenv").config({path: "./.env"});
const express = require('express')
const morgan = require('morgan');
const userRouter = require("./routes/userRoutes");
const passport = require('passport')
const session = require('express-session');
const cors = require('cors')
const cookieParser = require('cookie-parser');
const User = require("./models/userSchema");
const friendRouter = require("./routes/friendRoutes");
const searchRouter = require("./routes/searchRoutes");

//ccongiure db
const db = require("./models/dbConfig");

const app = express();
app.use(cors());
app.use(cookieParser());

app.use(express.json()); 

app.use(morgan('dev')); 


app.use(session({
    saveUninitialized: true,
    resave: true,
    secret: process.env.SESSION_SECRET
}));
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use("/user", userRouter); 
app.use("/friend", friendRouter); 
app.use("/search", searchRouter); 
 
// app.use('/public/images/employeesDp', express.static(path.join(__dirname, 'public/images/employeesDp')));

app.listen(process.env.PORT, ()=>{
    try{
        console.log(`Server is running at ${process.env.PORT}`);
    }
    catch(error){
        console.error('Error starting server:', error);
    }
})

