import styles from '../styles/Home.module.css';
import { useRouter } from 'next/router';
import Card from '../components/shared/Card/Card';
import Button from '../components/shared/Button/Button';
import { PiHandWavingFill } from "react-icons/pi";

const Home = () => {
    const router = useRouter();
    function startRegister() {
        router.push('/authenticate');
    }
    return (
        <div className={styles.cardWrapper}>
            <Card title="Welcome to NexPair!" icon={<PiHandWavingFill size="25" fill='#ffc040'/>}>
                <p className={styles.text}>
                    We’re working hard to get NexPair ready for everyone!
                    While we wrap up the finishing youches, we’re adding people
                    gradually to make sure nothing breaks
                </p>
                <div>
                    <Button onClick={startRegister} text="Let's Go" />
                </div>
                <div className={styles.signinWrapper}>
                    <span className={styles.hasInvite}>
                        Have an invite text?
                    </span>
                </div>
            </Card>
        </div>
    );
};

export default Home;
