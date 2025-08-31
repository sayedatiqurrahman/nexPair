import  "dotenv/config"
import express from "express"
import cors from "cors"
import router from './router.js';
import DbConnect from "./db.js";
import cookieParser from "cookie-parser";

const PORT = process.env.PORT || 5000
DbConnect()
const app = express()

const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
}

app.use(cookieParser())
app.use(cors(corsOptions))
app.use(express.json());
app.use(router)
app.get("/", (_, res)=>{
    res.send({message:"This is home page", status:200})
})



app.listen(PORT, ()=>`server is running on PORT: ${PORT}`)