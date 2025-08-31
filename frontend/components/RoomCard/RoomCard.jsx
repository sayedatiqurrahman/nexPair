import React from 'react';
import styles from './RoomCard.module.css';
import { useRouter } from 'next/router';
import { BsChatDotsFill, BsFillPersonFill } from 'react-icons/bs';

const RoomCard = ({ room }) => {
    const router = useRouter();
    return (
        <div
            onClick={() => {
                router.push(`/room/${room.id}`);
            }}
            className={styles.card}
        >
            <h3 className={styles.topic}>{room.topic}</h3>
            <div
                className={`${styles.speakers} ${
                    room.speakers.length === 1 ? styles.singleSpeaker : ''
                }`}
            >
                <div className={styles.avatars}>
                    {room.speakers.map((speaker,idx) => (
                        <img
                            key={idx}
                            src={speaker.avatar}
                            alt="speaker-avatar"
                        />
                    ))}
                </div>
                <div className={styles.names}>
                    {room.speakers.map((speaker, idx) => (
                        <div key={idx} className={styles.nameWrapper}>
                            <span>{speaker.name}</span>
                            <BsChatDotsFill />
                        </div>
                    ))}
                </div>
            </div>
            <div className={styles.peopleCount}>
                <span>{room.totalPeople}</span>
                <BsFillPersonFill />
            </div>
        </div>
    );
};

export default RoomCard;
