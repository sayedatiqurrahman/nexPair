import  "dotenv/config"
import express from "express"
import cors from "cors"
import router from './router.js';
import DbConnect from "./db.js";
import cookieParser from "cookie-parser";
import http from "http";

import {Server} from "socket.io"

// Initialize Express app
const app = express();
// Create HTTP server
const server = http.createServer(app)

const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
}
// Initialize Socket.IO
const io = new Server(server,{cors: {...corsOptions, methods:["GET","POST"]}})


const PORT = process.env.PORT || 5000


// Middleware
app.use(cookieParser())
app.use(cors(corsOptions))
app.use(express.json());


// Connect to Database
DbConnect()


app.use(router)
app.get("/", (_, res)=>{
    res.send({message:"This is home page", status:200})
})

io.on("connection", (socket)=>{
    console.log('new connectio', socket.id)
})

server.listen(PORT, ()=>`server is running on PORT: ${PORT}`)