import allfood from '../model/foodData.js';
import typefood from '../model/foodType.js';
import imgCompressor from './imageCompressor.js';

export const FetchAllFoodData = async(req , res)=>{

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

};

export const FetchAllFoodType = async(req , res)=>{

    try{
        const namefood = req.query.search || ''; 
        const filter = namefood ? {name : namefood} : {};
        const AllfoodType = await typefood.find(filter);
        res.status(200).json(AllfoodType);
    }
    catch(err){
        res.status(500).json({
            message : "Error Fetching All Food Type",
            error : err.message
        })
    }

};

export const AddNewFood = async(req , res)=>{
    try{
        const { name, cal, loc, tag } = req.body;
        const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

        if (!name || !cal || !imagePath) {
            return res.status(400).json({ error: 'Name, calorie data, and image are required.' });
        }
        
        const newFood = await allfood.create({ name, cal, loc, tag , imagePath});
        const foodType = await typefood.findOne({name : tag});

        if(foodType){
            if (foodType.num === 0){
                foodType.avgCal = cal;
                foodType.num = 1;
                foodType.imagePath = imagePath;
                await foodType.save();
            }
            else{
                const updatedAvgCal = Math.round(((foodType.avgCal * foodType.num) + cal) / (foodType.num + 1));
                foodType.avgCal = updatedAvgCal;
                foodType.num += 1;
                await foodType.save();
            }
        }
        else{
            return res.status(400).json({ error: `Food type '${tag}' does not exist.` });
        }
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
};

export const SelectItem = async(req , res)=>{

    const { selectedDataSet, selectedTypeSet } = req.body;

    console.log('Worked');

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
}