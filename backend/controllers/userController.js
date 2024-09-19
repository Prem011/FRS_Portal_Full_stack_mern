const User = require("../models/userSchema")
const passport = require("passport");
const LocalStrategy = require("passport-local");
passport.use(new LocalStrategy(User.authenticate()));
const createTokenandSaveCookie = require("../jwt/generateToken");

exports.registerUser =  async function(req, res, next){
    try{
        const {username, password, email} = req.body;
        
        const existingUser = await User.findOne({username});
        if(existingUser){
            return res.status(400).send({error: 'User already exists, Please change your username'});
        }

        const existingEmail = await User.findOne({email});
        if(existingEmail){
            return res.status(400).send({error: 'Email already exists, Please change your email'});
        }

        if(!password){
            return res.status(400).send({error: 'Password is required'});
        }

        const newUser =  new User({ username, email });
        await User.register(newUser, password);

        
            const token = createTokenandSaveCookie(newUser._id, res);
            res.status(200).send({message: 'You have been registered successfully',
                user: {
                email: newUser.email,
                username: newUser.username,
                jwt: token
            }}); 
    

    }
    catch(err){
        console.log("Error in registering user: " + err.message);
            res.status(500).send({error: 'An error occurred while registering user, please try again'});
    }
}

exports.login = async function(req, res, next){
    passport.authenticate('local', (err, user, info) => {
        if(err) {
            console.log("Error in login: " + err);
            return res.status(500).send({message: 'An error occurred while logging in, please try again'});
        }

        // console.log(user)
        if(!user.username){
            // console.log(info.message);
            message = "No user found with this Username, Please Register first.";
        }

        if(!user) {
            let message = "Enter the correct Username and password to login"; //

          if (info && info.message) {
            // console.log("info.message: " + info.message, "info" + info);
              if (info.mesesage === "Missing credentials") {
                  console.log(info.message);
                  message = "Please provide both username and password.";
              } else if (info.message === "Incorrect password") {
                  console.log(info.message);
                  message = "The password you entered is incorrect.";
              } else if (info.message === "No user found with this Username") {
                  console.log(info.message);
                  message = "No account found with this username.";
              }
          }

          return res.status(401).json({ error: message });
        }


        req.login(user, (err) => {
            if(err) {
                console.log("Error in login: " + err);
                return res.status(500).send({error: 'An error occurred while logging in, please try again'});
            }

            const token = createTokenandSaveCookie(user._id, res);


            return res.status(200).json({message: 'Login successful',
                user: {
                    username: user.username,
                    email : user.email,
                    token: token
                }});


        });
    })(req, res, next);
};

exports.logout = function(req, res) {
    try {
        res.clearCookie("jwt");
        res.status(200).json({ message: "User Logged out!" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


exports.getAllUsers = exports.getAllUsers = async (req, res) => {
  try {
    const loggedInId = await req.user._id;

    const loggedInUser = await User.findById(loggedInId).populate('friends', '_id');
    
    if(!loggedInUser){
        return res.status(404).json({ message: 'User not found' });
    }
    
    // Get ids of all friends of logged-in user
    const friendsIds = loggedInUser.friends.map(friend => friend._id);
    
    const users = await User.find({_id : {$nin : [loggedInId, ...friendsIds] }}, 'username email'); // Fetch all users but return only necessary fields
    
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching users' });
  }
};

