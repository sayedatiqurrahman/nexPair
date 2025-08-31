import roomModel from "../models/room.model.js";

class RoomsServices {
    async create(payload){
        const {ownerId} = payload;
        
        const room =await roomModel.create({...payload, speakers:[ownerId]})

        return room
    }

    async getRooms(types){
   
        const rooms = await roomModel.find({ roomType: { $in: types } }).populate("speakers").populate("ownerId").exec()

        return rooms
    }
}


export default new RoomsServices()