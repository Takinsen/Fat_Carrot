import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import { v2 as cloudinary } from 'cloudinary'
import Food_API from './api/foodAPI.js';
import Test_API from './api/testAPI.js';
import Auth_API from './api/auth.js';
import * as foodScript from './script/foodScript.js';

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//----------------------------------------------------------------//

const PORT = 84;

cloudinary.config({
    cloud_name: process.env.Cloud_Name,
    api_key: process.env.API_Key,          
    api_secret: process.env.API_Secret,    
});

//----------------------------------------------------------------//

app.use(cors());
app.use(express.json());
app.use('/api' , Food_API);  
app.use('/api' , Test_API);  
app.use('/user' , Auth_API);  
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));    

// ---------------------- Start the Server ---------------------- //

const initializeServer = async () =>{
    try{
        console.log('Backend Server is starting...');

        console.log('Step 1/3 : Connecting to MongoDB...')
        await mongoose.connect(process.env.MONGO_URL)

        console.log('Step 2/3 : MongoDB is verifying data...');
        await foodScript.VerifyFoodType();

        console.log('Step 3/3 : Starting the backend server...');
        app.listen(PORT, () => {
            console.log(`Backend Server is ready at http://localhost:${PORT}`);
        });
    }
    catch(err){
        console.log("Failed to start server:" , err);
    }
}

initializeServer();