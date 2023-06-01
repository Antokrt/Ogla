import styles from "../../styles/Component/Post/FooterOnPost.module.scss"
import {
    BackwardIcon,
    ChatBubbleBottomCenterTextIcon
    , ForwardIcon,
    QueueListIcon
} from "@heroicons/react/24/outline";
import {useRouter} from "next/router";
import {LikeBtnSidebar} from "../layouts/Btn/Like";
import {ref} from "yup";
import {DeleteSpace, MinimizeStr, ReduceString} from "../../utils/String";
import {HeadPhoneBtnOnFooter} from "../layouts/Btn/ActionBtn";
import {GetDefaultBookImgWhenError} from "../../utils/ImageUtils";


const FooterOnChapter = ({
                             navChapters,
                             openCommentary,
                             openList,
                             img,
                             title,
                             likes,
                             nbCommentary,
                             author,
                             nbChapter,
                             refresh,
                             index,
                             likeChapter,
                             hasLike
                         }) => {

    const router = useRouter();

    return (<div className={styles.container}>
        <div className={styles.titleContainer}>
            <img src={img} onError={(e) => e.target.src = GetDefaultBookImgWhenError()}/>
            <div>
                <p className={styles.titleBook}>{ReduceString(title,80)} ({index})</p>
                <p>{likes} likes - {author}</p>
            </div>


        </div>

        <div className={styles.likeContainer + ' ' + styles.likeContainerWithNav}>
            <div>

                    <div
                        className={navChapters.prev ? styles.navDiv : styles.hidden + ' ' + styles.navDiv}
                        onClick={() => {
                            if(navChapters.prev){
                                router.push({
                                    pathname: "/chapitre/" + navChapters.prev._id, query: {
                                        slug: MinimizeStr(navChapters.prev.slug), i: index - 1,
                                    }
                                })
                            }
                        }}
                    >
                        <BackwardIcon/>
                        <p>Précédent ({index - 1})</p>
                    </div>
            </div>

            <LikeBtnSidebar onLike={likeChapter} isLike={hasLike}/>


            <div>

                    <div
                        className={navChapters.next ? styles.navDiv : styles.hidden + ' ' + styles.navDiv}
                        onClick={() => {
                            if(navChapters.next){
                                router.push({
                                    pathname: "/chapitre/" + navChapters.next._id, query: {
                                       slug: navChapters.next.slug, i: index + 1
                                    },
                                })
                            }
                        }}

                    >
                        <ForwardIcon/>
                        <p>Suivant ({index + 1})</p>
                    </div>
            </div>
        </div>

        <div className={styles.commentAndListContainer}>

            <HeadPhoneBtnOnFooter/>

            <div className={styles.b} onClick={openCommentary}>
                <ChatBubbleBottomCenterTextIcon/>
                <p>Commentaires ({nbCommentary})</p>
            </div>

            <div className={styles.b} onClick={openList}>
                <QueueListIcon/>
                <p>Chapitres ({nbChapter})</p>
            </div>
        </div>


    </div>)
}

export default FooterOnChapter;