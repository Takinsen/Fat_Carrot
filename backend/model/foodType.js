import mongoose from "mongoose";

const foodTypeSchema = new mongoose.Schema({

    name:{
        type : String, 
        require : true
    },
    num:{
        type : Number,
        require : true
    },
    sumCal:{
        type : Number, 
        require : true
    },
    avgCal:{
        type : Number, 
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

const typefood = mongoose.model('type_food' , foodTypeSchema);

export default typefood;