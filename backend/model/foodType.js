import mongoose from "mongoose";

const foodTypeSchema = new mongoose.Schema({

    name:{
        type : String, 
        required : true,
        unique : true
    },
    category:{
        type : String, 
        required : true,
    },
    num:{
        type : Number,
        required : true
    },
    sumCal:{
        type : Number, 
        default : 0
    },
    avgCal:{
        type : Number, 
        default : 0
    },
    imageCloudPath:{
        type : String, 
        required : true
    }
    
})

foodTypeSchema.index({name : 1});

const typefood = mongoose.model('type_food' , foodTypeSchema);

export default typefood;