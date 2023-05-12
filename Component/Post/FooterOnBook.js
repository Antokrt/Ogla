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
import {LikeBtn, LikeBtnSidebar, LikeBtnSidebarPhone} from "../layouts/Btn/Like";
import ScreenSize from "../../utils/Size";
import useOrientation from "../../utils/Orientation";



const FooterOnBook = ({openCommentary,openList,img,title,like,author,nbCommentary,nbChapter, likeBook, hasLike}) => {

    const [width, height] = ScreenSize();
    const orientation = useOrientation();

    if(width > 600 && height > 500 ){
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
    else {
        return null;
    }

}

export default FooterOnBook;