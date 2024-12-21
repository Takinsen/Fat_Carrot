import express from 'express'

const User_API = express.Router();

User_API.get('/' , async(req , res) =>{

    try{
        res.status(200).json({
            message : "This is User API"
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