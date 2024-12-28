import express from 'express'
import alluser from '../model/user';

const User_API = express.Router();

User_API.get('/role/:rolename' , async(req , res) =>{

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

User_API.post('/register' , async(req , res) =>{

    try{
        const information = {
            username : req.body.username,
            email : req.body.email,
            password : req.body.password,
        }
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

User_API.post('/login' , async(req , res) =>{

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

export default User_API;