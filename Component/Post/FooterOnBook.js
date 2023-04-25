import styles from "../../styles/Component/Post/FooterOnPost.module.scss"
import {
    ArrowLeftCircleIcon,
    ArrowLeftIcon,
    ArrowRightCircleIcon,
    ArrowRightIcon,
    ChatBubbleBottomCenterTextIcon,
    ChevronDoubleLeftIcon,
    ChevronDoubleRightIcon,
    ChevronDoubleUpIcon, ChevronLeftIcon,
    ChevronRightIcon,
    HeartIcon,
    QueueListIcon
} from "@heroicons/react/24/outline";
import {useEffect, useState} from "react";
import SidebarPost from "./SidebarCommentary";
import {LikeBtn, LikeBtnSidebar} from "../layouts/Btn/Like";



const FooterOnBook = ({openCommentary,openList,img,title,like,author,nbCommentary,nbChapter, likeBook, hasLike}) => {

    useEffect(() => {
       console.log(hasLike)
    },[])

    return (
        <div className={styles.container}>


        <div className={styles.titleContainer + ' ' + styles.child}>
            <img src={img}/>
            <div>
                <h7>{title}</h7>
                <p>{like} like(s) - <span>{author}</span></p>
            </div>


        </div>

        <div className={styles.likeContainer + ' ' + styles.child}>
            <LikeBtnSidebar onLike={likeBook} isLike={hasLike}/>
        </div>

        <div className={styles.commentAndListContainer + ' ' + styles.child}>

            <div onClick={openCommentary}>
                <ChatBubbleBottomCenterTextIcon/>
                <p>{nbCommentary} commentaire(s) </p>
            </div>

        </div>



    </div>)
}

export default FooterOnBook;