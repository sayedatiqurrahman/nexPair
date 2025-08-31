import '../styles/globals.css';
import { store } from '../store';
import { Provider, useSelector } from 'react-redux';
import Navigation from '../components/shared/Navigation/Navigation';
import { useLoadingWithRefresh } from '../hooks/useLoadingWithRefresh';
import Loader from '../components/shared/Loader/Loader';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

function MyApp({ Component, pageProps }) {
    return (
        <Provider store={store}>
            <AppLogic Component={Component} pageProps={pageProps} />
        </Provider>
    );
}

function AppLogic({ Component, pageProps }) {
    const { loading } = useLoadingWithRefresh();

    return loading ? (
        <Loader message="Loading, please wait.." />
    ) : (
        <Auth>
            <Navigation />
            <Component {...pageProps} />
        </Auth>
    );
}

const Auth = ({ children }) => {
    const { isAuth, user } = useSelector((state) => state.auth);
    const router = useRouter();

    useEffect(() => {
        if (!isAuth) {
            if (router.pathname.startsWith('/rooms') || router.pathname.startsWith('/room') || router.pathname.startsWith('/activate')) {
                router.push('/');
            }
        } else {
            if (user?.activated) {
                if (router.pathname === '/' || router.pathname === '/authenticate') {
                    router.push('/rooms');
                }
            } else {
                if (router.pathname !== '/activate') {
                    router.push('/activate');
                }
            }
        }
    }, [isAuth, user, router]);

    return children;
}

export default MyApp;
