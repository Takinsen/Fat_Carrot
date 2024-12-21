import express from 'express'
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import allfood from '../model/foodData.js';
import typefood from '../model/foodType.js';
import compressImages from '../script/imageCompressor.js';
import * as foodScript from '../script/foodScript.js'

const Food_API = express.Router();

// -------------- Configuration -------------- //

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'uploads/'; // Directory to store uploaded files
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir); // Create the directory if it doesn't exist
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});

const upload = multer({ storage });

// -------------- API -------------- //

Food_API.get('/foodData', async(req , res)=>{

    try{
        const nametag = req.query.search || '';
        const filter = nametag ? {tag : nametag} : {};
        const AllfoodData = await allfood.find(filter);
        res.status(200).json(AllfoodData);
    }
    catch(err){
        res.status(500).json({
            message : "Error Fetching All Food Data",
            error : err.message
        })
    }

});

Food_API.get('/foodType', async(req , res)=>{

    try{
        const namefood = req.query.search || ''; 
        const filter = namefood ? { name: { $regex: namefood, $options: 'i' } } : {};
        const AllfoodType = await typefood.find(filter);
        res.status(200).json(AllfoodType);
    }
    catch(err){
        res.status(500).json({
            message : "Error Fetching All Food Type",
            error : err.message
        })
    }

});

Food_API.post('/addFoodData', upload.single('image') , async(req , res)=>{

    try{
        const { name, cal, loc, tag } = req.body;
        const imagePath = req.file ? `/uploads/${req.file.filename}` : null;
        const calories = parseInt(cal);

        if (!name || !cal || !imagePath) {
            return res.status(400).json({ error: 'Name, calorie data, and image are required.' });
        }
        if (typeof calories !== 'number') {
            return res.status(400).json({ error: 'Calories is not valid' });
        }

        const foodType = await typefood.findOne({name : tag});

        if(!foodType){
            return res.status(400).json({ error: `Food type '${tag}' does not exist.` });
        }
        
        if(foodType.num === 0){
            foodType.sumCal = calories;
            foodType.avgCal = calories;
            foodType.num = 1;
            foodType.imagePath = imagePath; 
            await foodType.save();   
        }
        else{
            foodType.sumCal += calories;
            foodType.num += 1;
            foodType.avgCal = Math.round(foodType.sumCal / foodType.num);
            await foodType.save();
        }

        const newFood = await allfood.create({ 
            name : name,
            cal : calories,
            loc : loc,
            tag : tag,
            imagePath : imagePath
        });

        await foodScript.VerifyFoodType(tag);

        compressImages(`./uploads`);

        res.status(201).json({
            message : "Upload Completed",
            Data : newFood
        }); 

    }
    catch(err){
        res.status(500).json({
            message : "Error posting data",
            error : err.message
        })
    }

});

Food_API.post('/selectedItems', async(req , res)=>{

    const { selectedDataSet, selectedTypeSet } = req.body;

    try{
        const queries = [];

        // Query foodData collection for matches with selectedDataSet
        if (selectedDataSet && selectedDataSet.length > 0) {
            queries.push(allfood.find({ imagePath: { $in: selectedDataSet } }));
        } else {
            queries.push(Promise.resolve([])); // Return an empty array if selectedDataSet is empty
        }

        // Query foodTypes collection for matches with selectedTypeSet
        if (selectedTypeSet && selectedTypeSet.length > 0) {
            queries.push(typefood.find({ name: { $in: selectedTypeSet } }));
        } else {
            queries.push(Promise.resolve([])); // Return an empty array if selectedTypeSet is empty
        }
    
        // Execute all queries in parallel
        const [itemsSet1, itemsSet2] = await Promise.all(queries);
    
        // Respond with matched items from both collections
        res.status(200).json({set1Matches: itemsSet1,set2Matches: itemsSet2});

    }
    catch(err){
        res.status(500).json({
            message : "Error Selecting Food",
            error : err.message
        })
    }

});

Food_API.delete('/deleteFoodData/:id' , async(req , res)=>{

    try{

        const deleteFood = await allfood.findByIdAndDelete(req.params.id);

        await foodScript.VerifyFoodType(deleteFood.tag);
        
        if(!deleteFood){
            return res.status(404).json({ message: 'Food not found' });
        }

        const foodType = await typefood.findOne({name : deleteFood.tag});

        if(!foodType){
            return res.status(400).json({ error: `Food type '${deleteFood.tag}' does not exist.` });
        }

        // Delete Image

        const imagePath = deleteFood.imagePath;

        if (imagePath) {

            const __dirname = path.dirname(fileURLToPath(import.meta.url));
            const filePath = path.resolve(__dirname, '..', imagePath.replace(/^\/+/, ''));
            
            // Check if the file exists before deleting
            await fs.unlink(filePath, (err) => {
                if (err) {
                    console.error('Error deleting image file:', err);
                    return res.status(500).json({ message: 'Error deleting image file', error: err.message });
                }
                console.log('Image file deleted successfully');
            });

        }

        res.status(200).json({
            message: 'Deleted Food completely',
            DeletedData : deleteFood
        });

    }
    catch(err){
        res.status(500).json({
            message : "Error Deleting Food",
            error : err.message
        })
    }

});

export default Food_API;