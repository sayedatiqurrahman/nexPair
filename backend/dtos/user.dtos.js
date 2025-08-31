class UserDto{
    _id;
    email;
    createdAt;
    activated;
    avatar;
    name;


    constructor(user){
        this._id = user._id; 
        this.email = user.email;
        this.activated = user.activated;
        this.createdAt = user.createdAt;
        this.name = user.name;
        this.avatar= user.avatar;
    }
}

export default UserDto