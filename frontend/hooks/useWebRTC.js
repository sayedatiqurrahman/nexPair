import { useCallback, useEffect, useRef } from "react"
import { useStateWithCallback } from "./useStateWithCallback"
import { socketInit } from './../socket/index';
import { ACTIONS } from "../actions";
import freeice from "freeice";


// const users = [
//     // { id: 1, name: "Atiqur", avatar: "https://i.ibb.co/b5mwBg76/82232344.jpg" },
//     // { id: 2, name: "Anisur Rahman", avatar: "/images/monkey-avatar.png" },
// ]

export const useWebRTC = (roomId, user) => {
    const [clients, setClients] = useStateWithCallback([])
    const audioElements = useRef({})
    const connections = useRef({})
    const localMediaStreams = useRef(null)
    const socket = useRef(null)

    useEffect(() => {
        socket.current = socketInit()

    }, [])

    const provideRef = (instance, userId) => {
        audioElements.current[userId] = instance;
    }

    const addNewClient = useCallback((newClient, cb) => {
        const exist = clients.find(client => client.id === newClient.id)
        if (!exist) setClients(prev => [newClient, ...prev], cb)
    }, [clients, setClients])




    useEffect(() => {
        const startCapture = async () => {
            localMediaStreams.current = await navigator.mediaDevices.getUserMedia({
                audio: true,
            })

        }
        startCapture().then(() => {
            addNewClient(user, () => {
                const localElement = audioElements.current[user.id]
                if (localElement) {
                    localElement.srcObject = localMediaStreams.current

                    localElement.volume = 0
                    console.log('localElement', localElement)


                    localElement.play().catch(err => {
                        console.error("Audio play failed:", err)
                    })
                }


                socket.current.emit(ACTIONS.JOIN, { roomId, user })
                socket.current.on("joined", (value) => console.log(value))
            })
        })


    }, [])

    useEffect(() => {
        const handleNewPeer = async ({ peerId, createOffer, user: remoteUser }) => {
            // warn if already connected
            if (peerId in connections.current) {
                return console.warn("You are already joined in with : ", peerId, remoteUser.name)
            } else {
                connections.current[peerId] = new RTCPeerConnection({
                    iceServers: freeice()
                })

                console.log("1st step of rtc", connections.current)
                connections.current[peerId].onicecandidate(event => {
                    console.info("ice-candidate", event)
                    socket.current.emit(ACTIONS.RELAY_ICE, {
                        peerId,
                        icecandidate: event.candidate
                    })
                })

                connections.current[peerId].ontrack = ({ streams: [remoteStreams] }) => {
                    addNewClient(remoteUser, () => {
                        if (audioElements.current[remoteUser.id]) {
                            audioElements.current[remoteUser.id].srcObject = remoteStreams
                        } else {
                            let satteled = false;
                            setInterval(() => {
                                if (audioElements.current[remoteUser.id]) {
                                    audioElements.current[remoteUser.id].srcObject = remoteStreams;
                                    satteled = true;
                                }
                                if (satteled) clearInterval(setInterval);
                            }, 1000)
                        }
                    })}

                // add local stream to rmote
                localMediaStreams.current.getTracks().forEach((track) => {
                    connections.current[peerId].addTrack(track, localMediaStreams.current)
                })

                // create offer...
                if(createOffer){
                    const offer = await connections.current[peerId].crateOffer()

                    socket.current.emit(ACTIONS.RELAY_SDP, {
                        peerId, icecandidate: offer,
                    })
                }

            }
        }

        socket.current.on(ACTIONS.ADD_PEER, handleNewPeer)

        return ()=>{
            socket.current.off(ACTIONS.ADD_PEER)

        }
    }, [])

    return { clients, provideRef }
}

