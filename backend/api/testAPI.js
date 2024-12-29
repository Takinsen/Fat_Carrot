import express from 'express';
import path from 'path';
import allfood from '../model/foodData.js';
import typefood from '../model/foodType.js';
import alluser from '../model/user.js';
import * as Image from '../script/imageScript.js';
import * as Food from '../script/foodScript.js';

// -------------- Configuration -------------- //

const Test_API = express.Router();

// ------------------------------------------ //

Test_API.get('/' , async(req , res) =>{

    try{
        res.status(200).json({
            message : "Test API Success!"
        })
    }
    catch(err){
        res.status(500).json({
            message : "Test API Error!",
            error : err.message
        })
    }

})

Test_API.post('/' , async(req , res) =>{

    try{
        
        res.status(200).json({
            message : "completed!"
        })
    }
    catch(err){
        res.status(500).json({
            message : "error!",
            error : err.message
        })
    }

})

export default Test_API;