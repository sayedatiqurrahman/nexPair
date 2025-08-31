import  { Schema, model } from "mongoose";

const userSchema = new Schema({
    email: {required:true, type:String},
    activated: {type:Boolean, default:false},
    name: {type:String, required:false},
    avatar: {type:String, required:false}
    
}, {timestamps:true})

const userModel = new model('User', userSchema)

export default userModel