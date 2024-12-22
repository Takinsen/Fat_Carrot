import mongoose from "mongoose";

const foodDataSchema = new mongoose.Schema({

    name:{
        type : String, 
        require : true
    },
    cal:{
        type : Number,
        require : true
    },
    loc:{
        type : String, 
        require : true
    },
    tag:{
        type : String, 
        require : true
    },
    imageName:{
        type : String, 
        require : true
    },
    imagePath:{
        type : String, 
        require : true
    },
    imageCloudPath:{
        type : String, 
        require : true
    }
})

foodDataSchema.index({tag : 1});

const allfood = mongoose.model('all_food' , foodDataSchema);

export default allfood;