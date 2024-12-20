import express from 'express'
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import * as controller from '../controller/Controller.js';

const router = express.Router();

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

router.get('/foodData', controller.FetchAllFoodData);
router.get('/foodType', controller.FetchAllFoodType);
router.post('/addFoodData', upload.single('image') , controller.AddNewFood);
router.post('/selectedItems', controller.SelectItem);
router.put('/refresh' , controller.VerifyAllFoodType);
router.delete('/deleteFoodData/:id' , controller.DeleteFoodData);

// -------------- test API -------------- //
router.get('/test', controller.Test);

export default router;