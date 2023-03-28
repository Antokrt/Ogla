import styles from '../../../styles/Layouts/Btn/Like.module.scss';
import {HeartIcon} from "@heroicons/react/24/solid";
import {HeartIcon as HeartOutline} from "@heroicons/react/24/outline";

import {ChevronDoubleUpIcon, HandThumbUpIcon as NotLikeIcon} from "@heroicons/react/24/outline";
import {HandThumbUpIcon as LikeIcon} from "@heroicons/react/24/solid";
import {useEffect, useState} from "react";

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

    useEffect(() => {
        if (startAnim) {
            // Déclencher l'animation
            const animationTimeout = setTimeout(() => {
                setStartAnim(false);
            }, 1000);

            return () => {
                clearTimeout(animationTimeout);
            };
        }
    }, [startAnim]);

    return (
        <div className={styles.likeButtonSidebar} onClick={() => {
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

export const CountLike = ({like}) => {
    return (
        <div className={styles.containerCount}>
            <p>{like}</p>
            <HeartIcon/>
        </div>

    )
}

export const TextLikeBtn = ({isLike, onLike, nb}) => {
    return (
        <div className={styles.containerTextLikeBtn}>
            {
                isLike ?
                    <LikeIcon onClick={onLike}/>:
                    <NotLikeIcon onClick={onLike}/>
            }
            <p>{nb}</p>
        </div>

    )
}
