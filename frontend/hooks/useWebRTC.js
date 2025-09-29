import { useCallback, useEffect, useRef } from "react"
import { useStateWithCallback } from "./useStateWithCallback"

// const users = [
//     // { id: 1, name: "Atiqur", avatar: "https://i.ibb.co/b5mwBg76/82232344.jpg" },
//     // { id: 2, name: "Anisur Rahman", avatar: "/images/monkey-avatar.png" },
// ]

export const useWebRTC = (roomId, user) => {
    const [clients, setClients] = useStateWithCallback([])
    const audioElements = useRef({})
    const connections = useRef({})
    const localMediaStreams = useRef(null)


    const provideRef =(instance ,userId)=>{
    audioElements.current[userId]=instance;
    }

    const addNewClient =useCallback((newClient, cb)=>{
        const exist = clients.find(client=> client.id === newClient.id)
        if (!exist) setClients(prev => [newClient, ...prev], cb)
    },[clients,setClients])




    useEffect(()=>{
        const startCapture=async()=>{
            localMediaStreams.current = await navigator.mediaDevices.getUserMedia({
                audio: true,
            })

        }
        startCapture().then(()=>{
            addNewClient(user, ()=>{
                const localElement =  audioElements.current[user.id]
                if(localElement) {
                    localElement.srcObject = localMediaStreams.current
                
                    localElement.volume = 0
                    console.log('localElement', localElement)
                    
                    
                    localElement.play().catch(err => {
                        console.error("Audio play failed:", err)
                    })
                }
            })
        })

        
    },[])

    return { clients, provideRef }
}

