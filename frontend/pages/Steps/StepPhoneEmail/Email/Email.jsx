import React, { useState } from 'react';
import Card from '../../../../components/shared/Card/Card';
import Button from '../../../../components/shared/Button/Button';
import TextInput from '../../../../components/shared/TextInput/TextInput';
import styles from '../StepPhoneEmail.module.css';
import { MdEmail } from 'react-icons/md';
import { sendOtpByEmail } from '../../../../http';
import { useDispatch } from 'react-redux';
import { setOtp } from '../../../../store/authSlice';

const Email = ({ onNext }) => {
    const [email, setEmail] = useState('');
    const dispatch = useDispatch()

    async function onSubmit(){
        const {data} = await sendOtpByEmail({email})
        dispatch(setOtp({ email: data.email, hash: data.hash }))
        onNext()
    }
    return (
        <Card title="Enter your email id" icon={<MdEmail />}>
            <TextInput
                value={email}
                type="email"
                required
                onChange={(e) => setEmail(e.target.value)}
            />
            <div>
                <div className={styles.actionButtonWrap}>
                    {!!email && email.includes('@') && email.includes('.com') && <Button text="Next" onClick={onSubmit} disabled={!email} />}
                </div>
                <p className={styles.bottomParagraph}>
                    By entering your number, you’re agreeing to our Terms of
                    Service and Privacy Policy. Thanks!
                </p>
            </div>
        </Card>
    );
};

export default Email;
