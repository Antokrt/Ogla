import '../styles/globals.scss';
import '../styles/editor.css';
import '../styles/tippy.css';
import '../styles/toast.css';
import {SessionProvider, useSession} from "next-auth/react";
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {wrapper} from "../store/store";
import {Provider, useDispatch, useSelector} from "react-redux";
import {selectLoginModalStatus, setActiveModalState} from "../store/slices/modalSlice";
import React, {useEffect, useRef, useState} from "react";
import {LoginModal} from "../Component/Modal/LoginModal";

import SocketProvider, {SocketContext} from '../utils/context/socket';
import YouTube from "react-youtube";
import {selectActiveMusicStatus, selectIndexStateMusic, setIndexMusic} from "../store/slices/musicSlice";
import {selectNotifStatus, setActiveModalNotif, setAllNotifs, selectNotifs, addNotif} from "../store/slices/notifSlice";
import {NotifModal} from "../Component/Modal/NotifModal";
import {useContext} from 'react';
import {io} from "socket.io-client";
import {selectSocketStatus, setActiveSocket} from '../store/slices/socketSlice';
import notifSlice from '../store/slices/notifSlice';
import {useCallback} from 'react';
import {addCategory, selectCategories} from "../store/slices/categorySlice";
import axios from "axios";
import {instance} from "../service/config/Interceptor";
import {toastDisplayInfo} from "../utils/Toastify";
import dynamic from "next/dynamic";
import {GetAllNotifs} from '../service/Notifications/NotificationsService';
import {Notif} from "../Component/Notif";
import {Modal} from "../Component/Modal";
import {Socket} from "../socket/Socket";
import {GetCategories} from "../categories/Categories";
import {Maintenance} from "../Component/Maintenance";
import {AnimatePresence} from "framer-motion";
import {useRouter} from "next/router";
import {Loader} from "../Component/Loader";
import {Darken} from "../Component/Darken";
import Script from "next/script";
import CustomStyle from "../Component/CustomStyle";
import {GoogleAnalytics} from "../Component/GoogleAnalytics";
import {CookieAccept} from "../Component/CookieAccept";

const DynamicHeader = dynamic(() => import('../Component/Lofi'), {ssr: false})


function MyApp({Component, pageProps}) {

    const {store} = wrapper.useWrappedStore(pageProps);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const start = () => {
            setLoading(true)
        }
        const end = () => {
            setLoading(false)
        }
        router.events.on("routeChangeStart", start)
        router.events.on("routeChangeComplete", end)
        router.events.on("routeChangeError", end)
        return () => {
            router.events.off("routeChangeStart", start)
            router.events.off("routeChangeComplete", end)
            router.events.off("routeChangeError", end)
        }

    }, [])


    if (process.env.maintenance ) {
        const srcAnalytics = "https://www.googletagmanager.com/gtag/js?id="+process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS;
        return (
            <>
                <CookieAccept/>
                <GoogleAnalytics/>
                <Maintenance/>
            </>
        )
    }


    return (
    <AnimatePresence mode={'wait'} initial={false}>
        <SessionProvider session={pageProps.session}>
            <Provider store={store}>
                <Notif/>
                <Modal/>
                <Darken/>
                {
                    loading &&
                    <Loader/>
                }
                <Component {...pageProps} />

                <Socket/>
                <ToastContainer toastStyle={{
                    fontFamily: 'Poppins',
                }} limit={3}/>
                <DynamicHeader/>
                <GetCategories/>
            </Provider>
        </SessionProvider>
    </AnimatePresence>
    )
}

export default MyApp;
