import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    userName : {
        type : String,
        required: [true, "Please provide a username"],
        unique : true
    },
    email : {
        type : String,
        required: [true, "Please provide an email"],
        unique : true
    },
    password : {
        type : String,
        required: [true, "Please provide a password"]
    },
    isVerified : {
        type : Boolean,
        default : false
    },
    isAdmin : {
        type : Boolean,
        default : false
    },
    forgotPasswordToken : String,
    forgotPasswordTokenExpiry: Date,
    verifyToken: String,            
    verifyTokenExpiry: Date
    
})

//initially in next js when come toward interaction with models, it cant differentiate weather its their first meet up or not. So for this reason first we export our model like if they exist or not

const User  = 
mongoose.models.User || mongoose.model("User", userSchema)

export default User