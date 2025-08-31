import React, { useState, useEffect } from 'react';
import Card from '../../../components/shared/Card/Card';
import Button from '../../../components/shared/Button/Button';
import styles from './StepAvatar.module.css';
import { useSelector, useDispatch } from 'react-redux';
import { setAvatar } from '../../../store/activateSlice';
import { activate, UploadAvatar } from '../../../http';
import { setAuth } from '../../../store/authSlice';
import Loader from '../../../components/shared/Loader/Loader';
import { GiMonkey } from 'react-icons/gi';
import { BsEmojiFrownFill } from 'react-icons/bs';
import { useRouter } from 'next/router';
// import axios from "axios"

const StepAvatar = ({ onNext }) => {
    const dispatch = useDispatch();
    const { name, avatar } = useSelector((state) => state.activate);
    const [image, setImage] = useState('https://placehold.co/500?text=Profile&font=roboto');
    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [unMounted, setUnMounted] = useState(false);
    const router = useRouter();

    function captureImage(e) {
        const file = e.target.files[0];
        console.log("file", file)
        setImageFile(file)
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = function () {
            setImage(reader.result);
            console.log("reader.result", reader.result)

            dispatch(setAvatar(reader.result));
        };
    }
    async function submit() {
        if (!name || !avatar || !imageFile) return;
        setLoading(true);
        try {
            const formData = new FormData()

            formData.append('image', imageFile);
            const {data :FileOFavatar} = await UploadAvatar(formData);

            const avatarUrl = FileOFavatar.data.url
            dispatch(setAvatar(avatarUrl))

            const { data } = await activate({ name, avatar: avatarUrl });

            console.log("data", data)
            if (data.auth) {
                dispatch(setAuth(data));
                if (!unMounted) {
                
                }
                router.push('/rooms')
            }
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
            
        }
    }

    useEffect(() => {
        return () => {
            setUnMounted(true);
        };
    }, []);

    if (loading) return <Loader message="Activation in progress..." />;
    return (
        <>
            <Card title={`Okay, ${name}`} icon={<BsEmojiFrownFill size="25" fill='#ffc040' />}>
                <p className={styles.subHeading}>How’s this photo?</p>
                <div className={styles.avatarWrapper}>
                    <img
                        className={styles.avatarImage}
                        src={image}
                        alt="avatar"
                    />
                </div>
                <div>
                    <input
                        onChange={(e)=>captureImage(e)}
                        id="avatarInput"
                        type="file"
                        className={styles.avatarInput}
                    />
                    <label className={styles.avatarLabel} htmlFor="avatarInput">
                        Choose a different photo
                    </label>
                </div>
                <div>
                    <Button onClick={submit} text="Next" />
                </div>
            </Card>
        </>
    );
};

export default StepAvatar;
