import mongoose from "mongoose"

function DbConnect(){
    const db_url = process.env.mongodb_url
    mongoose.connect(db_url)

    const db = mongoose.connection

    db.on("error", console.error.bind(console, "connection error:"))
    db.once("open", ()=> console.log("Db Connected"))
}

export default DbConnect