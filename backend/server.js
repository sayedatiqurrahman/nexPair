import "dotenv/config"
import express from "express"
import cors from "cors"
import router from './router.js'
import DbConnect from "./db.js"
import cookieParser from "cookie-parser"
import http from "http"
import { Server } from "socket.io"
import { ACTIONS } from "./actions.js"
import fs from "fs/promises" // Import fs/promises for async file operations

// ✅ Swagger import (keep here)
import swaggerUi from "swagger-ui-express";

let swaggerDocument;
try {
    // Read the file content as a string
    const swaggerContent = await fs.readFile('./swagger.json', 'utf8');
    // Parse the JSON string into an object
    swaggerDocument = JSON.parse(swaggerContent);
} catch (error) {
    console.error("Failed to load swagger.json:", error);
    // Handle error, e.g., exit or use a default empty object
    swaggerDocument = {};
}

// ✅ Initialize Express app first
const app = express()

// ✅ Swagger setup after app is created
// Ensure swaggerDocument is not undefined before passing to setup
if (Object.keys(swaggerDocument).length > 0) {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, { explorer: true }));
} else {
    console.warn("Swagger UI not served as swagger.json could not be loaded.");
}


// ... rest of your code remains the same ...

const server = http.createServer(app)

const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
    connectionStateRecovery: {}
}

// ✅ Initialize Socket.IO
const io = new Server(server, { cors: { ...corsOptions, methods: ["GET", "POST"] } })

const PORT = process.env.PORT || 5000

// ✅ Middleware
app.use(cookieParser())
app.use(cors(corsOptions))
app.use(express.json())

// ✅ Connect to Database
DbConnect()

// ✅ Routes
app.use(router)
// #swagger.tags = ['Public']
app.get("/", (_, res) => {
    res.send({ message: "This is home page", status: 200 })
})

const socketUserMapping = {}

io.on("connection", (socket) => {
    console.log("New connection:", socket.id)

    socket.on(ACTIONS.JOIN, ({ roomId, user }) => {
        console.log("Join message received:", roomId, user)

        socketUserMapping[roomId] = user

        const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || [])
        console.log("clients", clients)

        clients.forEach(client => {
            io.to(client).emit(ACTIONS.ADD_PEER, {
                peerId: socket.id,
                createOffer: false,
                user
            })
            socket.emit(ACTIONS.ADD_PEER, {
                peerId: client,
                createOffer: true,
                user: socketUserMapping[client]
            })


        })

        socket.join(roomId)
        // socket.emit("joined", { id: socket.id, status: "ok", msg: "You joined successfully!" })
    })

// action relay ice
    socket.on(ACTIONS.RELAY_ICE, ({ peerId, icecandidate })=>{

    })
})

server.listen(PORT, () => console.log(`✅ Server running on PORT: ${PORT}`))