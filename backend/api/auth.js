import express from 'express';
import bcrypt from 'bcrypt';
import alluser from '../model/user.js';

const Auth_API = express.Router();

Auth_API.get('/role/:rolename' , async(req , res) =>{

    try{
        const filter = req.params.rolename ? {role : req.params.rolename} : {};
        const users = await alluser.find(filter);
        res.status(200).json({
            message : "Fetch all user data completed!",
            userData : users
        })
    }
    catch(err){
        res.status(500).json({
            message : "User API Error!",
            error : err.message
        })
    }

})

Auth_API.post('/register' , async(req , res) =>{

    const {username , email , password} = req.body;

    try{
        // Check if empty
        if(!username || username.trim === ''){
            return res.status(400).json({ error: 'Username is required' });
        }
        if(!email || email.trim === ''){
            return res.status(400).json({ error: 'Email is required' });
        }
        if(!password || password.trim === ''){
            return res.status(400).json({ error: 'Password is required' });
        }

        // Check if exist
        const existingUser = await alluser.findOne({
            $or: [
              { username: username },
              { email: email }
            ]
        });
        if (existingUser) {
            if (existingUser.email === email) {
                return res.status(400).json({ error: 'Email already in use' });
            }
              if (existingUser.username === username) {
                return res.status(400).json({ error: 'Username already taken' });
            }
        }

        // Hash the password
        const saltRounds = 8;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create new user
        const user = new alluser({ username, email, password: hashedPassword });
        await user.save();

        res.status(201).json({
            newUser : user,
            message : "Register completed!"
        })
    }
    catch(err){
        res.status(500).json({
            message : "Register error!",
            error : err.message
        })
    }

})

Auth_API.post('/login' , async(req , res) =>{

    const {username , email , password} = req.body;

    try{
        const existingUser = await alluser.findOne({
            $or: [
              { username: username },
              { email: email }
            ]
        });

        //Check if not exist
        if (!existingUser) {
            return res.status(400).json({error : 'The account is not existed'});
        }

        //Check if password is not matched
        const match = await bcrypt.compare(password , existingUser.password);
        if(!match){
            return res.status(400).json({error : 'Incorrect password'});
        }
        
        res.status(200).json({
            message : "Login completed!",
            user : existingUser
        })
    }
    catch(err){
        res.status(500).json({
            message : "Login error!",
            error : err.message
        })
    }

})

export default Auth_API;