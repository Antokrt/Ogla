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
import {useRouter} from "next/router";



const FooterOnChapter = ({navChapters,openCommentary,openList,img, title, likes, nbCommentary, author, nbChapter, index, next,previous, likeChapter }) => {

    const [openSidebar,setOpenSidebar ] = useState(true);
    const [hasLikeChapter, setHasLikeChapter] = useState('hasLike');

    const router = useRouter();

    useEffect(() => {
       console.log(index + 1)
    },[])

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
                   navChapters.prev &&
                        <div
                            className={styles.navDiv}
                            onClick={() => {
                                router.push({
                                    pathname: "/chapitre/" + navChapters.prev._id, query: {
                                        name:navChapters.prev.title, slug: navChapters.prev.slug, i: index - 1
                                    },
                                })
                            }}
                        >
                            <ChevronLeftIcon/>
                            <p>Précédent (Ch.{index - 1})</p>
                        </div>
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
                    navChapters.next &&
                        <div
                            className={styles.navDiv}
                            onClick={() => {
                                router.push({
                                    pathname: "/chapitre/" + navChapters.next._id, query: {
                                        name:navChapters.next.title, slug: navChapters.next.slug, i: index+ 1
                                    },
                                })
                            }}
                        >
                            <ChevronRightIcon/>
                            <p>Suivant (Ch.{index + 1})</p>
                        </div>
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