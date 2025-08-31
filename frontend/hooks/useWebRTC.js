import { useRef } from "react"
import { useStateWithCallback } from "./useStateWithCallback"
const users = [
    { id: 1, name: "Atiqur Rahman", avatar: "https://i.ibb.co/b5mwBg76/82232344.jpg" },
    { id: 2, name: "Anisur Rahman", avatar: "/images/monkey-avatar.png" },
]

export const useWebRTC = () => {
    const [clients, setClients] = useStateWithCallback(users || [])
    const audioElements = useRef({})
    const connections = useRef({})


return {clients}
}

