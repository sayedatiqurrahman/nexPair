import { io } from 'socket.io-client';

const socketInit =()=>{

    const options  = {
        'force new connection': true,
        reconnectionAttempt:"infinity",
        timeout: 10000,
        transports: ['webSocket']
    }
    
    return io(process.env.NEXT_PUBLIC_BACKEND_API , options)
}

export default socketInit