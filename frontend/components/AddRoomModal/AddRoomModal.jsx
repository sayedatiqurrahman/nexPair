import  { useState } from 'react';
import styles from './AddRoomModal.module.css';
import TextInput from '../shared/TextInput/TextInput';
import { createRoom as create } from '../../http';
import { useHistory } from 'react-router-dom';
import { AiOutlineClose } from 'react-icons/ai';
import { BsGlobe, BsFillLockFill } from 'react-icons/bs';
import { FaUsers } from 'react-icons/fa';
import { GiPartyPopper } from 'react-icons/gi';
import { useRouter } from 'next/router';
const AddRoomModal = ({ onClose }) => {
    const router = useRouter();

    const [roomType, setRoomType] = useState('open');
    const [topic, setTopic] = useState('');

    async function createRoom() {
        try {
            if (!topic) return;
            const { data } = await create({ topic, roomType });
            router.push(`/room/${data.id}`);
        } catch (err) {
            console.log(err.message);
        }
    }

    return (
        <div className={styles.modalMask}>
            <div className={styles.modalBody}>
                <button onClick={onClose} className={styles.closeButton}>
                    <AiOutlineClose />
                </button>
                <div className={styles.modalHeader}>
                    <h3 className={styles.heading}>
                        Enter the topic to be disscussed
                    </h3>
                    <TextInput
                        fullwidth="true"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                    />
                    <h2 className={styles.subHeading}>Room types</h2>
                    <div className={styles.roomTypes}>
                        <div
                            onClick={() => setRoomType('open')}
                            className={`${styles.typeBox} ${
                                roomType === 'open' ? styles.active : ''
                            }`}
                        >
                            <BsGlobe size={30} /><br />
                            <span>Open</span>
                        </div>
                        <div
                            onClick={() => setRoomType('social')}
                            className={`${styles.typeBox} ${
                                roomType === 'social' ? styles.active : ''
                            }`}
                        >
                            <FaUsers size={30}/>
                            <br />
                            <span>Social</span>
                        </div>
                        <div
                            onClick={() => setRoomType('private')}
                            className={`${styles.typeBox} ${
                                roomType === 'private' ? styles.active : ''
                            }`}
                        >
                            <BsFillLockFill size={30} /><br />
                            <span>Private</span>
                        </div>
                    </div>
                </div>
                <div className={styles.modalFooter}>
                    <h2>Start a room, open to everyone</h2>
                    <button
                        onClick={createRoom}
                        className={styles.footerButton}
                    >
                        <GiPartyPopper />
                        <span>Let's go</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddRoomModal;
