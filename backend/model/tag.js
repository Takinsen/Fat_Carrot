import mongoose from "mongoose";

const tagSchema = new mongoose.Schema({

    name:{
        type : String, 
        required : true,
        unique : true
    },
    itemCount:{
        type : Number,
        default : 0
    },
    sumCal:{
        type : Number, 
        default : 0
    },
    avgCal:{
        type : Number, 
        default : 0
    },
    
})

tagSchema.index({name : 1});

const tagfood = mongoose.model('all_tag' , tagSchema);

export default tagfood;