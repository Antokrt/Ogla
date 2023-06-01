import styles from "../../../styles/Component/Post/Commentary/SubCommentary.module.scss";
import anim from "../../../styles/utils/anim.module.scss";
import {HeartIcon} from "@heroicons/react/24/solid";
import {useEffect, useState} from "react";
import {useSession} from "next-auth/react";
import {TrashIcon} from "@heroicons/react/24/outline";
import {LikeBtn, TextLikeBtn} from "../../layouts/Btn/Like";
import {FormatDateFrom} from "../../../utils/Date";
import {GetDefaultUserImgWhenError} from "../../../utils/ImageUtils";
const SubCommentary = ({img, pseudo, date, content, likes,deleteAnswer, hasLike, likeAnswer, id, authorId, seeMoreAnswers}) => {

    const [sizeCommentary,setSizeCommentary] = useState(content?.length);
    const [tooLong,setTooLong] = useState(false);
    const {data:session } = useSession();


return (
    <div className={styles.container + ' ' + anim.fadeIn}>
        <div className={styles.containerComment}>
            <div className={styles.imgContainer}>
                <img src={img} referrerPolicy={'no-referrer'} onError={(e) => e.target.src = GetDefaultUserImgWhenError() } alt={"Image Profil User"}/>
            </div>

            <div className={styles.contentCommentContainer}>

                {
                    session && session.user.id === authorId &&
                    <TrashIcon
                        onClick={() => deleteAnswer(id)}
                        className={styles.trash}/>
                }


                <div className={styles.authorDate}>
                    <h8 is={'h8'}>{pseudo}<span>{FormatDateFrom(date)}</span></h8>
                </div>
                <p className={tooLong ? styles.cutCommentary + " " + styles.commentary : styles.commentary}>{content}
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
            <TextLikeBtn onLike={() => {
                if(session){
                    likeAnswer();
                }
            }} nb={likes} isLike={hasLike}/>
                </div>

            </div>
        </div>
    </div>
)
}


export default SubCommentary;