import express from 'express';
import path from 'path';
import allfood from '../model/foodData.js';
import typefood from '../model/foodType.js';
import * as Image from '../script/imageScript.js';

const Test_API = express.Router();

Test_API.get('/' , async(req , res) =>{

    try{

        res.status(200).json({
            message : "Test API Success!",
        })
    }
    catch(err){
        res.status(500).json({
            message : "Test API Error!",
            error : err.message
        })
    }

})

Test_API.get('/fix' , async(req , res) =>{

    try{

        res.status(200).json({
            message : "Test API fix Success!",
        })
    }
    catch(err){
        res.status(500).json({
            message : "Test API fix Error!",
            error : err.message
        })
    }

})

export default Test_API;