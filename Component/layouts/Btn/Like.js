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

            <HeartIcon className={isLike === true ? styles.active : styles.disabled}/>
        </div>
    )
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
