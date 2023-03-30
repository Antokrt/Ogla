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


function MyApp({Component, pageProps}) {

    const {store} = wrapper.useWrappedStore(pageProps);

    return (
        <SessionProvider session={pageProps.session}>
                <Provider store={store}>
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

function Lofi(){

    const selectMusicState = useSelector(selectActiveMusicStatus);
    const selectIndexMusicState = useSelector(selectIndexStateMusic);
    const dispatch = useDispatch();
    const audioRef = useRef(null);

    useEffect(() => {
        if(audioRef.current.paused && selectMusicState){
            audioRef.current.volume = 0.1;
            audioRef.current.play();
        }
        else {
            audioRef.current.pause();
        }

    },[selectMusicState])

    const playNextMusic = () => {
        dispatch(setIndexMusic(selectIndexMusicState + 1));
        audioRef.current.src = '/assets/music/lofi' + selectIndexMusicState + '.mp3';
        audioRef.current.oncanplaythrough = () => {
            audioRef.current.play();
        }
    }



    return (
        <>
            <audio controls={true} ref={audioRef} onEnded={() => playNextMusic()} src={'/assets/music/lofi'+selectIndexMusicState+'.mp3'}>
            </audio>
        </>


    )
}

export default MyApp;
