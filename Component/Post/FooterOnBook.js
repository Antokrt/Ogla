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



const FooterOnBook = ({openCommentary,openList,img,title,like,author,nbCommentary,nbChapter, likeBook}) => {

    const [openSidebar,setOpenSidebar ] = useState(true);
    const [book,setBook] = useState();


    return (
        <div className={styles.container}>

        <div className={styles.titleContainer}>
            <img src={img}/>
            <div>
                <h7>{title}</h7>
                <p>{like} like(s) - {nbCommentary} commentaire(s) - {author}</p>
            </div>


        </div>

        <div className={styles.likeContainer}>
            <div onClick={likeBook}>
                <HeartIcon/>
                <p>J'aime ({like})</p>
            </div>

        </div>

        <div className={styles.commentAndListContainer}>

            <div onClick={openCommentary}>
                <ChatBubbleBottomCenterTextIcon/>
                <p>Commentaires ({nbCommentary})</p>
            </div>

            <div onClick={openList}>
                <QueueListIcon/>
                <p>Chapitres ({nbChapter})</p>
            </div>
        </div>



    </div>)
}

export default FooterOnBook;