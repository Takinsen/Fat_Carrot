import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({

    username:{
        type : String, 
        require : true,
        unique : true
    },
    email:{
        type : String,
        require : true,
        unique : true
    },
    password:{
        type : String, 
        require : true
    },
    role:{
        type : String, 
        require : true
    },
    profilePicture:{
        type : String,
        default : "https://res.cloudinary.com/de1gfkb46/image/upload/v1735379975/UserProfile_hfkly8.jpg"
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
})

const alluser = mongoose.model('all_user' , UserSchema);

export default alluser;