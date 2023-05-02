import '../styles/globals.scss';
import '../styles/editor.css';
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

function MyApp({ Component, pageProps }) {

    const { store } = wrapper.useWrappedStore(pageProps);

    return (
        <SessionProvider session={pageProps.session}>
            <Provider store={store}>
                <Notif />
                <Modal />
                <Component {...pageProps} />
                <Socket />
                <ToastContainer limit={3} />
                <Lofi />
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

function Lofi() {

    const selectMusicState = useSelector(selectActiveMusicStatus);
    const selectIndexMusicState = useSelector(selectIndexStateMusic);
    const dispatch = useDispatch();
    const audioRef = useRef(null);
    const session = useSession();
    useEffect(() => {
        if (audioRef.current.paused && selectMusicState) {
            audioRef.current.volume = 0.4;
            audioRef.current.play();
        }
        else {
            audioRef.current.pause();
        }

    }, [selectMusicState])

    const playNextMusic = () => {
        dispatch(setIndexMusic(selectIndexMusicState + 1));
        audioRef.current.src = process.env.NEXT_PUBLIC_BASE_MUSIC + 'lofi' + selectIndexMusicState + '.mp3';
        audioRef.current.oncanplaythrough = () => {
            audioRef.current.play();
        }
    }

    return (
        <>
            <audio ref={audioRef} onEnded={() => playNextMusic()} src={process.env.NEXT_PUBLIC_BASE_MUSIC + 'lofi' + selectIndexMusicState + '.mp3'}>
            </audio>
        </>
    )
}

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
        <h1 style={{ fontSize: "1px", zIndex: "-1", display: "none" }}>. </h1>
    )
}

export default MyApp;
