import RoomDto from "../dtos/room.dto.js";
import roomsServices from "../Services/rooms.services.js";

class RoomsController {

    async create(req, res){
        const {topic, roomType} = req.body;
        if(!topic || !roomType) return res.status(400).json({message:"all fields are required"})
        
        
        const room = await roomsServices.create({ topic , roomType, ownerId:req.userId})
        
        
        return res.status(200).json(new RoomDto(room))
    }

    async getAllRooms(req, res){
        // const {topic, roomType} = req.body;
        // if(!topic || !roomType) return res.status(400).json({message:"all fields are required"})
        
        
        const rooms = await roomsServices.getRooms(['open'])
        
        const roomsDTO = rooms.map((room) => new RoomDto(room));
        return res.status(200).json(roomsDTO)
    }
}

export default new RoomsController()