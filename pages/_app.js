import '../styles/globals.scss';
import '../styles/editor.css';
import '../styles/tippy.css';
import { SessionProvider, useSession } from "next-auth/react";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { wrapper } from "../store/store";
import { Provider, useDispatch, useSelector } from "react-redux";
import { selectLoginModalStatus, setActiveModalState } from "../store/slices/modalSlice";
import React, { useEffect, useRef, useState } from "react";
import { LoginModal } from "../Component/Modal/LoginModal";

import SocketProvider, { SocketContext } from '../utils/context/socket';
import YouTube from "react-youtube";
import { selectActiveMusicStatus, selectIndexStateMusic, setIndexMusic } from "../store/slices/musicSlice";
import { selectNotifStatus, setActiveModalNotif, setAllNotifs, selectNotifs, addNotif } from "../store/slices/notifSlice";
import { NotifModal } from "../Component/Modal/NotifModal";
import { useContext } from 'react';
import { io } from "socket.io-client";
import { selectSocketStatus, setActiveSocket } from '../store/slices/socketSlice';
import notifSlice from '../store/slices/notifSlice';
import { useCallback } from 'react';
import {addCategory, selectCategories} from "../store/slices/categorySlice";
import axios from "axios";
import {instance} from "../service/config/Interceptor";
import {toastDisplayInfo} from "../utils/Toastify";
import dynamic from "next/dynamic";

function MyApp({ Component, pageProps }) {

    const { store } = wrapper.useWrappedStore(pageProps);


    useEffect(() => {
        console.log('lel')
    },[])



    return (
        <SessionProvider session={pageProps.session}>
            <Provider store={store}>
                <Notif />
                <Modal />
                <Component {...pageProps} />
                <Socket />
                <ToastContainer toastStyle={{
                    fontFamily:'Poppins',
                }} limit={3} />
                <DynamicHeader/>
                <GetCategories/>
            </Provider>
        </SessionProvider>
    )
}

function Modal() {
    const modalState = useSelector(selectLoginModalStatus);
    const dispatch = useDispatch();
    const { data: session } = useSession();

    if (modalState && !session) {
        return (
            <LoginModal close={() => dispatch(setActiveModalState(false))} />
        )
    }
}

function GetCategories(){
    const categories = useSelector(selectCategories);
    const dispatch = useDispatch();

    useEffect(() => {
        if (categories.length <= 0) {
            instance.get('category')
                .then((res) => {
                    dispatch(addCategory(res.data));
                })
        }
    },[categories])

    return <></>
}


function Notif() {
    const notifState = useSelector(selectNotifStatus);
    const dispatch = useDispatch();

    if (notifState) {
        if (typeof window !== 'undefined') {
            const body = document.querySelector('body');
            body.style.overflow = 'hidden';
        }
        return (
            <NotifModal close={() => dispatch(setActiveModalNotif(false))} />
        )
    }
    else {
        if (typeof window !== 'undefined') {
            const body = document.querySelector('body');
            body.style.overflow = 'initial';
        }
    }
}

const DynamicHeader = dynamic(() => import('../Component/Lofi'),{ssr:false})

function Socket() {
    const selectSocketState = useSelector(selectSocketStatus);
    const selectNotifsState = useSelector(selectNotifs);
    const dispatch = useDispatch();
    const { data: session } = useSession();

    const initializeSocket = useCallback(() => {
        if (session) {
            let socket;
            if (!selectSocketState) {
                socket = io("http://localhost:3008/notifications", {
                    auth: {
                        token: session?.user.accessToken
                    }
                }
                );
                dispatch(setActiveSocket(true))
            }
            if (socket) {
                socket.emit("userId", 1190201)
                socket.removeAllListeners("status");
                socket.on("status", (notif) => {
                    dispatch(setAllNotifs(notif));
                })
                socket.removeAllListeners("new");
                socket.on("new", (notif) => {
                    dispatch(addNotif(notif));
                })
            }
        }
    }, [dispatch, selectNotifsState, selectSocketState, session])

    useEffect(() => {
        initializeSocket();
    }, [initializeSocket]);

    return (
        <h1 style={{ fontSize: "1px", zIndex: "-1", display: "none" }}>.</h1>
    )
}

export default MyApp;
