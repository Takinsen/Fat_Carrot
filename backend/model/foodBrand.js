import mongoose from "mongoose";

const foodBrandSchema = new mongoose.Schema({

    name:{
        type : String, 
        required : true,
        unique : true
    },
    itemCount:{
        type : Number,
        default : 0
    },
    imageCloudPath:{
        type : String, 
        default : "https://res.cloudinary.com/de1gfkb46/image/upload/v1735548027/default_gmekf3.png"
    }
})

const allbrand = mongoose.model('all_brand' , foodBrandSchema);

export default allbrand;