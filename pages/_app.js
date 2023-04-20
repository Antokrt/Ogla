import '../styles/globals.scss';
import '../styles/editor.css';
import {SessionProvider, useSession} from "next-auth/react";
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {wrapper} from "../store/store";
import {Provider, useDispatch, useSelector} from "react-redux";
import {selectLoginModalStatus, setActiveModalState} from "../store/slices/modalSlice";
import React, {useEffect, useRef, useState} from "react";
import {LoginModal} from "../Component/Modal/LoginModal";

import SocketProvider from '../utils/context/socket';
import YouTube from "react-youtube";
import {selectActiveMusicStatus, selectIndexStateMusic, setIndexMusic} from "../store/slices/musicSlice";
import {selectNotifStatus, setActiveModalNotif} from "../store/slices/notifSlice";
import {NotifModal} from "../Component/Modal/NotifModal";


function MyApp({Component, pageProps}) {

    const {store} = wrapper.useWrappedStore(pageProps);
console.log('heyy')
    return (
        <SessionProvider session={pageProps.session}>
                <Provider store={store}>
                    <Notif/>

                    <SocketProvider>
                        <Modal/>
                        <Component {...pageProps} />
                        <ToastContainer limit={3}/>
                        <Lofi/>
                    </SocketProvider>
                </Provider>
        </SessionProvider>
    )
}

function Modal() {
    const modalState = useSelector(selectLoginModalStatus);
    const dispatch = useDispatch();
    const {data:session} = useSession();

    if(modalState && !session){
        return (
            <LoginModal close={() => dispatch(setActiveModalState(false))}/>
        )
    }
}

function Notif() {
    const notifState = useSelector(selectNotifStatus);
    const dispatch = useDispatch();

    if(notifState){
        if(typeof window !== 'undefined'){
            const body = document.querySelector('body');
            body.style.overflow = 'hidden';
        }
        return (
            <NotifModal close={() => dispatch(setActiveModalNotif(false))}/>
        )
    }
    else {
        if(typeof window !== 'undefined'){
            const body = document.querySelector('body');
            body.style.overflow = 'initial';
        }
    }


}

function Lofi(){

    const selectMusicState = useSelector(selectActiveMusicStatus);
    const selectIndexMusicState = useSelector(selectIndexStateMusic);
    const dispatch = useDispatch();
    const audioRef = useRef(null);

    useEffect(() => {
        if(audioRef.current.paused && selectMusicState){
            audioRef.current.volume = 0.4;
            audioRef.current.play();
        }
        else {
            audioRef.current.pause();
        }

    },[selectMusicState])

    const playNextMusic = () => {
        dispatch(setIndexMusic(selectIndexMusicState + 1));
        audioRef.current.src = process.env.NEXT_PUBLIC_BASE_MUSIC + 'lofi' +selectIndexMusicState + '.mp3';
        audioRef.current.oncanplaythrough = () => {
            audioRef.current.play();
        }
    }



    return (
        <>
            <audio  ref={audioRef} onEnded={() => playNextMusic()} src={process.env.NEXT_PUBLIC_BASE_MUSIC +'lofi'+ selectIndexMusicState + '.mp3'}>
            </audio>
        </>


    )
}

export default MyApp;
