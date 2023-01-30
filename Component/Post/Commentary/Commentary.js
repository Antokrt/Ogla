import styles from "../../../styles/Component/Post/Commentary/Commentary.module.scss";
import scroll from "../../../styles/utils/scrollbar.module.scss";
import {useEffect, useState} from "react";
import {HeartIcon} from "@heroicons/react/24/solid";
import {ArrowDownIcon, ArrowUpIcon, HandThumbUpIcon, TrashIcon} from "@heroicons/react/24/outline";
import SubCommentary from "./SubCommentary";
import {useSession} from "next-auth/react";
import {DeleteCommentaryService} from "../../../service/Comment/CommentService";

const Commentary = ({pseudo,img,date,content,likes, answers, authorId, deleteComment,id}) => {

    const [sizeCommentary, setSizeCommentary] = useState(content?.length);
    const [tooLong, setTooLong] = useState(false);


    const [openSubCategory, setOpenSubCategory] = useState(false);
    const {data: session } = useSession();

    useEffect(() => {
        if (sizeCommentary > 200) {
            setTooLong(true);
        }
        console.log(id)
    }, [])



    return (
        <div className={styles.container}>
            <div className={styles.containerComment}>
                <div className={styles.imgContainer}>
                    <img referrerPolicy="no-referrer" src={img}/>
                </div>

                <div className={styles.contentCommentContainer}>
                    {
                        authorId === session.user.id &&
                        <TrashIcon
                            onClick={() => deleteComment(id)}
                            className={styles.trash}/>
                    }
                    <div className={styles.authorDate}>
                        <h8>{pseudo}  <span>{id}</span></h8>
                    </div>
                    <p className={tooLong ? styles.cutCommentary + " " + styles.commentary : styles.commentary}>
                        {content}
                    </p>
                    {
                        tooLong &&
                        <p
                            onClick={() => {
                                setTooLong(!tooLong)
                            }
                            }
                            className={styles.seeMore}>Voir plus</p>
                    }

                    {
                        sizeCommentary > 200 && tooLong === false &&
                        <p
                            onClick={() => setTooLong(true)}
                            className={styles.seeMore}>Voir moins</p>
                    }

                    <div className={styles.likeCommentaryContainer}>
                        <p className={styles.likeCount}><HeartIcon/> 123</p>
                        <p className={styles.replyCount}> 29 réponses</p>
                    </div>

                    <div className={styles.replyContainer}>
                        <button className={styles.showReplyBtn}
                                onClick={() => setOpenSubCategory(!openSubCategory)}>Voir les 30 réponses
                            {
                                openSubCategory &&
                                <ArrowUpIcon/>
                            }
                            {
                                !openSubCategory &&
                                <ArrowDownIcon/>
                            }
                        </button>

                        {
                            openSubCategory &&
                            <div className={styles.containerSubCommentary}>
                                <textarea className={scroll.scrollbar} placeholder={"Répondez à Mireille Culotte"}/>
                                <div className={styles.sendResponse}>
                                    <button>Envoyer</button>
                                </div>
                                <SubCommentary
                                    subCommentary={"Je ne suis pas du tout d'accord avec toi! C'est ma vie ce roman"}/>
                                <SubCommentary subCommentary={"Non ntm et signalé !"}/><SubCommentary
                                subCommentary={"Je ne suis pas du tout d'accord avec toi! C'est ma vie ce roman"}/><SubCommentary
                                subCommentary={"Je ne suis pas du tout d'accord avec toi! C'est ma vie ce roman"}/><SubCommentary
                                subCommentary={"Je ne suis pas du tout d'accord avec toi! C'est ma vie ce roman"}/>
                            </div>
                        }

                    </div>

                </div>
            </div>
        </div>
    )

}

export default Commentary;