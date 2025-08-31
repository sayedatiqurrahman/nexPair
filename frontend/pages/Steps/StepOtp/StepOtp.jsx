import React, { useState } from 'react';
import Card from '../../../components/shared/Card/Card';
import TextInput from '../../../components/shared/TextInput/TextInput';
import Button from '../../../components/shared/Button/Button';
import styles from './StepOtp.module.css';
import styles2 from '../StepPhoneEmail/StepPhoneEmail.module.css';
import { verifyOtp } from '../../../http';
import { useSelector } from 'react-redux';
import { setAuth } from '../../../store/authSlice';
import { useDispatch } from 'react-redux';
import { BsFillShieldLockFill } from 'react-icons/bs';

const StepOtp = () => {
    const [otp, setOtp] = useState('');
    const dispatch = useDispatch();
    const { phone, email, hash } = useSelector((state) => state.auth.otp);
    async function submit() {
        const isContactMissing = !phone && !email;
        if (!otp || isContactMissing || !hash) {
            console.log("something messing releted otp frontend")
            return;}
        
        try {
            const { data } = await verifyOtp({ otp, email, hash });
            console.log("data from verify otp: ", data)
            dispatch(setAuth(data));
        } catch (err) {
            console.log(err);
        }
    }
    return (
        <>
            <div className={styles2.cardWrapper}>
                <Card
                    title="Enter the code we just texted you"
                    icon={<BsFillShieldLockFill />}
                >
                    <TextInput
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                    />
                    <div className={styles.actionButtonWrap}>
                        <Button onClick={submit} text="Next" />
                    </div>
                    <p className={styles.bottomParagraph}>
                        By entering your number, you’re agreeing to our Terms of
                        Service and Privacy Policy. Thanks!
                    </p>
                </Card>
            </div>
        </>
    );
};

export default StepOtp;
