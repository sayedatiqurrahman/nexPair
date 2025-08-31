import Link from 'next/link';
import { logout } from '../../../http';
import styles from './Navigation.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { setAuth } from '../../../store/authSlice';
import { FiLogOut } from 'react-icons/fi';
import Image from 'next/image'
const Navigation = () => {
    const brandStyle = {
        color: '#fff',
        textDecoration: 'none',
        fontWeight: 'bold',
        fontSize: '22px',
        display: 'flex',
        alignItems: 'center',
    };

    const logoText = {
        marginLeft: '10px',
    };
    const dispatch = useDispatch();
    const { isAuth, user } = useSelector((state) => state.auth);
    const { avatar } = useSelector((state) => state.activate);
    async function logoutUser() {
        try {
            const { data } = await logout();
            dispatch(setAuth(data));
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <nav className={`${styles.navbar} container`}>
            <Link style={brandStyle} href="/">
                <Image src="/images/logo.png" width={30} height={30} alt='Logo'/>
                <span style={logoText}>NexPair</span>
            </Link>
            {isAuth && (
                <div className={styles.navRight}>
                    <h3>{user?.name}</h3>
                    <Link href="/">
                        <img
                            className={styles.avatar}
                            src={
                                user?.avatar
                                    ? user?.avatar
                                    : avatar ? avatar : 'https://placehold.co/500?text=Profile&font=roboto'
                            }
                            width="40"
                            height="40"
                            alt="avatar"
                        />
                    </Link>
                    <button
                        className={styles.logoutButton}
                        onClick={logoutUser}
                    >
                        <FiLogOut  size={22} style={{color:"#fff"}}/>
                    </button>
                </div>
            )}
        </nav>
    );
};

export default Navigation;
