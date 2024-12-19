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
    imagePath:{
        type : String, 
        require : true
    },

})

const allfood = mongoose.model('all_food' , foodDataSchema);

export default allfood;