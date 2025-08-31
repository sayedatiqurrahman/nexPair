import { model, Schema } from "mongoose";

const roomSchema = new Schema({
    topic: { type: String, required: true },
    roomType: { type: String, enum: ['open', 'social', 'private'], required: true },
    ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    speakers: { type:[{type:Schema.Types.ObjectId, ref:"User"}], required:false}
}, { timestamps: true });

export default model("Room", roomSchema, "rooms");
