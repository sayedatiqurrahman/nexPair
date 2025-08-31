import { model, Schema } from "mongoose";

const refreshSchema = new Schema({
    token: {type:String, required:true},
    userId: { type: Schema.Types.ObjectId, ref:"User"},    
})



export default model("Refresh", refreshSchema, "tokens")