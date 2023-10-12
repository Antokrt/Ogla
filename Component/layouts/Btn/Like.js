import styles from '../../../styles/Layouts/Btn/Like.module.scss';
import {CommandLineIcon, HeartIcon} from "@heroicons/react/24/solid";
import {HeartIcon as HeartOutline} from "@heroicons/react/24/outline";

import {ChevronDoubleUpIcon, HandThumbUpIcon as NotLikeIcon} from "@heroicons/react/24/outline";
import {HandThumbUpIcon as LikeIcon} from "@heroicons/react/24/solid";
import {useEffect, useState} from "react";
import {FormatCount} from "../../../utils/NbUtils";
import { useSelector } from 'react-redux';
import { selectTheme } from '../../../store/slices/themeSlice';

export const LikeBtn = ({isLike, onLike}) => {
    return (
        <div
            onClick={onLike}
            className={styles.like}>

            <HeartIcon className={isLike ? styles.active : styles.disabled}/>
            <span className={styles.span}></span>
        </div>
    )
}

export const LikeBtnSidebar = ({isLike, onLike}) => {

    const [startAnim, setStartAnim] = useState(false);
    const theme = useSelector(selectTheme);

    useEffect(() => {
        if (startAnim) {
            const animationTimeout = setTimeout(() => {
                setStartAnim(false);
            }, 1000);

            return () => {
                clearTimeout(animationTimeout);
            };
        }
    }, [startAnim]);

    return (
        <div className={theme ? styles.likeButtonSidebar : styles.likeButtonSidebar + ' ' + styles.dark} onClick={() => {
            if(!isLike){
                setStartAnim(!startAnim);
            }
            onLike();
        }}>
            <HeartIcon className={`${styles.heart} ${isLike ? styles.liked : ''}`}>  </HeartIcon>
            { startAnim && <div className={styles.animation}></div>}
        </div>
    );
}

export const LikeBtnSidebarPhone = ({isLike, onLike}) => {

    const [startAnim, setStartAnim] = useState(false);
    const theme = useSelector(selectTheme);

    useEffect(() => {
        if (startAnim) {
            const animationTimeout = setTimeout(() => {
                setStartAnim(false);
            }, 1000);

            return () => {
                clearTimeout(animationTimeout);
            };
        }
    }, [startAnim]);

    return (
        <div className={theme ? styles.likeButtonSidebarPhone : styles.likeButtonSidebarPhone + ' ' + styles.dark} onClick={() => {

            if(!isLike){
                setStartAnim(!startAnim);
            }
            onLike();
        }}>
            <svg className={`${styles.heart} ${isLike ? styles.liked : styles.notLiked}`}  viewBox="0 0 24 24" ><path d="M12.39 20.87a.696.696 0 0 1-.78 0C9.764 19.637 2 14.15 2 8.973c0-6.68 7.85-7.75 10-3.25 2.15-4.5 10-3.43 10 3.25 0 5.178-7.764 10.664-9.61 11.895z" /></svg>
            { startAnim && <div className={styles.animation}></div>}
        </div>
    );
}

export const CountLike = ({like}) => {
    return (
        <div className={styles.containerCount}>
            <p>{FormatCount(like)}</p>
            <HeartIcon/>
        </div>

    )
}

export const TextLikeBtn = ({isLike, onLike, nb}) => {

    const theme = useSelector(selectTheme);

    return (
        <div className={theme ? styles.containerTextLikeBtn : styles.containerTextLikeBtn + ' ' + styles.dark}>
            {
                isLike ?
                    <LikeIcon onClick={onLike}/>:
                    <NotLikeIcon onClick={onLike}/>
            }
            <p>{nb}</p>
        </div>

    )
}
