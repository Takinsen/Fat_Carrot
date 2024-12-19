import express from 'express'
import cors from 'cors'
import router from './routes/Routes.js';
import dotenv from 'dotenv';
import bodyParser from 'body-parser'; 
import mongoose from 'mongoose';
import path from 'path';
import compressImages from './controller/imageCompressor.js';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//----------------------------------------------------------------//

const PORT = 84;

//----------------------------------------------------------------//

mongoose.connect(process.env.MONGO_URL)
.then(()=>console.log('Connected to MongoDB Complete!'))
.catch((err)=>console.error('Error connecting to MongoDB :', err));

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use('/api' , router);  
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));     
compressImages(`./uploads`);
app.listen(PORT , ()=>{
        console.log(`Backend Server is running on http://localhost:${PORT}`);
})