import userModel from "../models/user.model.js";

class UserServices {
    async findUser(filter){
        return  await userModel.findOne(filter)
    }
    async createUser(data){
        return  await userModel.create(data)
    }
}


export default new UserServices()