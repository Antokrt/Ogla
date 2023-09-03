import '../styles/globals.scss';
import '../styles/editor.css';
import '../styles/tippy.css';
import '../styles/toast.css';
import {SessionProvider, useSession} from "next-auth/react";
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {Provider, useDispatch, useSelector} from "react-redux";
import React, {useEffect, useRef, useState} from "react";
import dynamic from "next/dynamic";
import NextTopLoader from "nextjs-toploader";
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
import anim from '../styles/utils/anim.module.scss';
import {GoogleAnalytics} from "../Component/GoogleAnalytics";
import {CookieAccept} from "../Component/CookieAccept";
import { persistor, store } from '../store/store';
import { PersistGate } from 'redux-persist/integration/react';
import {Loader1, LoaderCommentary} from "../Component/layouts/Loader";

const DynamicHeader = dynamic(() => import('../Component/Lofi'), {ssr: false})


function MyApp({Component, pageProps}) {

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


    if (process.env.maintenance || process.env.NODE_ENV !== "development") {
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

            <PersistGate loading={<div className={anim.fadeIn} style={{
                        width: "100%",
                        height: "100vh",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        fontSize: "35px",
                    }}> <LoaderCommentary/>  </div>} persistor={persistor}>
                <Notif/>
                <Modal/>
                <Darken/>
                {
                    loading &&
                    <Loader/>
                }
                <Component {...pageProps} />
                <NextTopLoader color={'#9844AD'}/>
                <Socket/>
                <ToastContainer toastStyle={{
                    fontFamily: 'Poppins',
                }} limit={3}/>
                <DynamicHeader/>
                <GetCategories/>
                </PersistGate>
            </Provider>
        </SessionProvider>
    </AnimatePresence>
    )
}

export default MyApp;
