import express from 'express';
import multer from 'multer';
import allfood from '../model/foodData.js';
import typefood from '../model/foodType.js';
import allbrand from '../model/foodBrand.js';
import alltag from '../model/tag.js';

// -------------- Configuration -------------- //

const Dev_API = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// -------------- API -------------- //

// -------------- POST -------------- //

Dev_API.post('/newBrand', upload.single('image') , async(req , res) => {

    const { name } = req.body;

    if (!name || !req.file) {
        return res.status(400).json({ error: 'Name and Image are required.' });
    }

    try{
        const newBrand = await allbrand.create({name});
        res.status(200).json({  
            message : "Upload new brand completed!",
            data : newBrand
        })
    }
    catch(err){
        res.status(500).json({
            message : "error!",
            error : err.message
        })
    }

})

export default Dev_API;