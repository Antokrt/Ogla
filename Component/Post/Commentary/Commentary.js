import styles from "../../../styles/Component/Post/Commentary/Commentary.module.scss";
import scroll from "../../../styles/utils/scrollbar.module.scss";
import {useEffect, useState} from "react";
import {HeartIcon} from "@heroicons/react/24/solid";
import {ArrowDownIcon, ArrowUpIcon, HandThumbUpIcon} from "@heroicons/react/24/outline";
import SubCommentary from "./SubCommentary";

const Commentary = ({pseudo,img,date,content,likes, answers}) => {

    const [sizeCommentary, setSizeCommentary] = useState(content?.length);
    const [tooLong, setTooLong] = useState(false);
    const [openSubCategory, setOpenSubCategory] = useState(false);

    useEffect(() => {
        if (sizeCommentary > 200) {
            setTooLong(true);
        }
    }, [])

    return (
        <div className={styles.container}>
            <div className={styles.containerComment}>
                <div className={styles.imgContainer}>
                    <img referrerpolicy="no-referrer" src={img}/>
                </div>

                <div className={styles.contentCommentContainer}>
                    <div className={styles.authorDate}>
                        <h8>{pseudo} <span>{date}</span></h8>
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