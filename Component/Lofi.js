import {useDispatch, useSelector} from "react-redux";
import {selectActiveMusicStatus, selectIndexStateMusic, setIndexMusic} from "../store/slices/musicSlice";
import React, {useEffect, useRef, useState} from "react";

export default function Lofi() {

    const selectMusicState = useSelector(selectActiveMusicStatus);
    const selectIndexMusicState = useSelector(selectIndexStateMusic);
    const dispatch = useDispatch();
    const audioRef = useRef(null);

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
            <audio controls={false} ref={audioRef} onEnded={() => playNextMusic()} src={process.env.NEXT_PUBLIC_BASE_MUSIC + 'lofi' + selectIndexMusicState + '.mp3'}>
            </audio>
        </>
    )
}
