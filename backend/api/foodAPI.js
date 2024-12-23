import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import allfood from '../model/foodData.js';
import typefood from '../model/foodType.js';
import * as Image from '../script/imageScript.js';
import * as Food from '../script/foodScript.js';

// -------------- Configuration -------------- //

const Food_API = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

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
        const request = {
            name : req.body.name,
            cal : parseInt(req.body.cal),
            loc : req.body.loc,
            tag : req.body.tag
        }

        if (!request.name || !request.cal || !req.file) {
            return res.status(400).json({ error: 'Name, calorie data, and image are required.' });
        }

        // Upload image to Cloudinary
        const result = await Image.uploadToCloudinary(req.file.buffer , 'allFoodImage');

        // Create data in database
        const newFood = await allfood.create({ 
            name : request.name,
            cal : request.cal,
            loc : request.loc,
            tag : request.tag,
            imageCloudPath : result.secure_url
        });

        await Food.UpdateAfterPost(request);

        res.status(201).json({
            message : "Upload new food completed",
            newFood : newFood
        }); 

        const stream = cloudinary.uploader.upload_stream(result);
        stream.end(req.file.buffer);

    }
    catch(err){
        res.status(500).json({
            message : "Error posting data",
            error : err.message
        })
    }

});

Food_API.post('/uploadFoodProfile', upload.single('image') , async(req , res)=>{

    try{
        const tag = req.body.tag;

        if (!tag || !req.file) {
            return res.status(400).json({ 
                error: 'tag and image are required.' ,
                imagePath : imagePath ,
                tag : tag
            });
        }

        const selectFood = await typefood.findOne({name : tag});

        if(!selectFood){
            return res.status(400).json({ error: `Food type '${tag}' does not exist.` });
        }

        // Delete image from cloud ( อย่าพึ่งใช้จนกว่าจะอัพรูปทุกครบทุก tag )
        // const publicID = Image.getPublicId(selectFood.imageCloudPath);
        // await cloudinary.uploader.destroy(publicID);

        // Upload image to Cloudinary
        const result = await Image.uploadToCloudinary(req.file.buffer , 'FoodProfile');

        // Update imageCloudPath
        selectFood.imageCloudPath = result.secure_url;
        await selectFood.save();

        res.status(201).json({
            message : "Upload food profile completed",
            Data : selectFood,
            UploadResult : result
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
        
        if(!deleteFood){
            return res.status(404).json({ message: 'Food not found' });
        }

        await Food.VerifyFoodType(deleteFood.tag);

        // Delete Image
        const publicID = Image.getPublicId(deleteFood.imageCloudPath);
        await cloudinary.uploader.destroy(publicID);

        res.status(200).json({
            message: 'Deleted food completely',
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