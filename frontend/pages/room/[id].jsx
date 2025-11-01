import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
// import { useWebRTC } from '../../hooks/useWebRTC';
import { useRouter } from 'next/router';
import { getRoom } from '../../http';
import {
    BsArrowLeft,
    BsMicFill,
    BsMicMuteFill,
} from 'react-icons/bs';
import { FaHandPaper } from 'react-icons/fa';
import { GiTrophy } from 'react-icons/gi';
import styles from '../../styles/Room.module.css';
import {useWebRTC} from '../../hooks/useWebRTC';

const Room = () => {
    const user = useSelector((state) => state.auth.user);
    const router = useRouter();
    const { id: roomId } = router.query;
    const [room, setRoom] = useState(null);

    const { clients, provideRef } = useWebRTC(roomId, user);
   
    console.log(clients)
    const handleMute = (isMuted, id)=> isMuted

    const [isMuted, setMuted] = useState(true);

    useEffect(() => {
        const fetchRoom = async () => {
            // const { data } = await getRoom(roomId);
            const  data  = {}
            setRoom((prev) => data);
        };

        fetchRoom();
    }, [roomId]);

    useEffect(() => {
        handleMute(isMuted, user.id);
    }, [isMuted]);

    const handManualLeave = () => {
        router.push('/rooms');
    };

    const handleMuteClick = (clientId) => {
        if (clientId !== user.id) {
            return;
        }
        setMuted((prev) => !prev);
    };

    return (
        <div>
            <div className="container">
                <button onClick={handManualLeave} className={styles.goBack}>
                    <BsArrowLeft />
                    <span>All voice rooms</span>
                </button>
            </div>
            <div className={styles.clientsWrap}>
                <div className={styles.header}>
                    {room && <h2 className={styles.topic}>{room.topic}</h2>}
                    <div className={styles.actions}>
                        <button className={styles.actionBtn}>
                            <FaHandPaper />
                        </button>
                        <button
                            onClick={handManualLeave}
                            className={styles.actionBtn}
                        >
                            <GiTrophy />
                            <span>Leave quietly</span>
                        </button>
                    </div>
                </div>
              
                
                <div className={styles.clientsList}>
                    {clients?.map((client, idx) =>  <div className={styles.client} key={idx + client.id}>
    
                                <div className={styles.userHead}>
                                    <img
                                        className={styles.userAvatar}
                                        src={client.avatar}
                                        alt=""
                                    />
                                    <audio
                                        autoPlay
                                        playsInline
                                        ref={(instance)=> provideRef(instance, client.id)}
                                    />
                                    <button
                                        onClick={() =>
                                            handleMuteClick(client.id)
                                        }
                                        className={styles.micBtn}
                                    >
                                        {client.muted ? (
                                            <BsMicMuteFill className={styles.mic} />
                                        ) : (
                                            <BsMicFill className={styles.micImg} />
                                        )}
                                    </button>
                                </div>
                                <h4>{client.name}</h4>
                            </div>
                       
                    )}
                </div>
            </div>
        </div>
    );
};

export default Room;
