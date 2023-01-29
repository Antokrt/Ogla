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
import {LikeBookService} from "../../service/Like/LikeService";



const FooterOnChapter = ({openCommentary,openList,img, title, likes, nbCommentary, author, nbChapter, index, next,previous, likeChapter }) => {

    const [openSidebar,setOpenSidebar ] = useState(true);
    const [hasLikeChapter, setHasLikeChapter] = useState('hasLike');





    return (<div className={styles.container}>
        <div className={styles.titleContainer}>
            <img src={img}/>
            <div>
                <h7>Chapitre {index} : {title}</h7>
                <p>{likes} likes - {nbChapter} commentaires - {author}</p>
            </div>


        </div>

        <div className={styles.likeContainer}>
            <div>
                {
                    nbChapter > 1 && index !== 1 &&
                        <>
                            <ChevronLeftIcon/>
                            <p>Précédent (Ch.{index - 1})</p>
                        </>
                }
            </div>

            <div
            onClick={() => {
likeChapter()
            }}
            >
                <HeartIcon/>
                <p>J'aime ({likes})</p>
            </div>

            <div>
                {
                    nbChapter > 1 &&
                        <>
                            <ChevronRightIcon/>
                            <p>Suivant (Ch.{index})</p>
                        </>
                }
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

export default FooterOnChapter;