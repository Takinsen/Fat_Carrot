import express from 'express'

const Test_API = express.Router();

Test_API.get('/' , async(req , res) =>{

    try{
        res.status(200).json({
            message : "This is Test API"
        })
    }
    catch(err){
        res.status(500).json({
            message : "Test API Error!",
            error : err.message
        })
    }

})

export default Test_API;