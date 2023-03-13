import styles from '../../../styles/Layouts/Btn/Like.module.scss';
import {HeartIcon} from "@heroicons/react/24/solid";
import {ChevronDoubleUpIcon, HandThumbUpIcon as NotLikeIcon} from "@heroicons/react/24/outline";
import {HandThumbUpIcon as LikeIcon} from "@heroicons/react/24/solid";

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
    return (
        <div
            onClick={onLike}
            className={styles.likeSidebar}>

            <HeartIcon className={isLike ? styles.active : styles.disabled}/>
            <span className={styles.span}></span>
        </div>
    )
}

export const CountLike = ({isLike, onLike}) => {
    return (
        <div className={styles.containerCount}>
            <p>1221</p>
            <ChevronDoubleUpIcon/>
        </div>

    )
}

export const TextLikeBtn = ({isLike, onLike, nb}) => {
    return (
        <div className={styles.containerTextLikeBtn}>
            {
                isLike ?
                    <NotLikeIcon onClick={onLike}/>:
                    <LikeIcon onClick={onLike}/>
            }
            <p>{nb}</p>
        </div>

    )
}
