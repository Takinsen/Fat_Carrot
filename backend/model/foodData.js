import mongoose from "mongoose";

const foodDataSchema = new mongoose.Schema({

    name:{
        type : String, 
        required : true
    },
    loc:{
        type : String, 
        default : "-"
    },
    tag:{
        type : String, 
        required : true
    },
    tags:{
        type : [String], 
        default : []
    },
    cal:{
        type : Number,
        required : true
    },
    carb:{
        type : Number,
        default : -1
    },
    protein:{
        type : Number,
        default : -1
    },
    fat:{
        type : Number,
        default : -1
    },
    brand:{
        type : String, 
        default : "non-brand"   
    },
    description:{
        type : String, 
        default : "-"
    },
    imageCloudPath:{
        type : String, 
        required : true
    },
    uploadby:{
        type : String, 
        default : "admin"
    },
    uploadDate:{
        type : Date, 
        default : Date.now
    }
})

foodDataSchema.index({tag : 1});

const allfood = mongoose.model('all_food' , foodDataSchema);

export default allfood;