import React, { useState, useEffect } from 'react';
import AddRoomModal from '../components/AddRoomModal/AddRoomModal';
import RoomCard from '../components/RoomCard/RoomCard';
import styles from '../styles/Rooms.module.css';
import { getAllRooms } from '../http';
import { FiSearch } from 'react-icons/fi';
import { SiTeamspeak } from "react-icons/si";



const Rooms = () => {
    const [showModal, setShowModal] = useState(false);
    const [rooms, setRooms] = useState([]);

    useEffect(() => {
        const fetchRooms = async () => {
            const { data } = await getAllRooms();
            setRooms(data ? data : []);
        };
        fetchRooms();
    }, []);
    function openModal() {
        setShowModal(true);
    }
    return (
        <>
            <div className="container">
                <div className={styles.roomsHeader}>
                    <div className={styles.left}>
                        <span className={styles.heading}>All voice rooms</span>
                        <div className={styles.searchBox}>
                            <FiSearch size={22} />
                            <input type="text" className={styles.searchInput} />
                        </div>
                    </div>
                    <div className={styles.right}>
                        <button
                            onClick={openModal}
                            className={styles.startRoomButton}
                        >
                            <SiTeamspeak style={{ fontWeight: "bolder" }} size={17} />
                            <span>Start a room</span>
                        </button>
                    </div>
                </div>

                <div className={styles.roomList}>
                    {rooms?.length >0 ? rooms?.map((room, idx) => (
                        <RoomCard key={idx} room={room} />
                    )) :""}
                </div>
            </div>
            {showModal && <AddRoomModal onClose={() => setShowModal(false)} />}
        </>
    );
};

export default Rooms;
