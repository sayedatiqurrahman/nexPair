import { io } from 'socket.io-client';

export const socketInit =()=>{

    const options  = {
        'force new connection': true,
        reconnectionAttempt:"infinity",
        timeout: 10000,
        connectionStateRecovery: {},
        transports: ["websocket"]
    }
    
    
    return io(process.env.NEXT_PUBLIC_BACKEND_API , options)
}

