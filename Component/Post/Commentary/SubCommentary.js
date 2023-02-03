import styles from "../../../styles/Component/Post/Commentary/SubCommentary.module.scss";
import {HeartIcon} from "@heroicons/react/24/solid";
import {useEffect, useState} from "react";
import {useSession} from "next-auth/react";
import {TrashIcon} from "@heroicons/react/24/outline";
const SubCommentary = ({img, pseudo, date, content, likes,deleteAnswer, hasLike, likeAnswer, id, authorId}) => {

    const [sizeCommentary,setSizeCommentary] = useState(content?.length);
    const [tooLong,setTooLong] = useState(false);
    const {data:session } = useSession();

    useEffect(() => {
    },[])

return (
    <div className={styles.container}>
        <div className={styles.containerComment}>
            <div className={styles.imgContainer}>
                <img src={img} alt={"Image Profil User"}/>
            </div>

            <div className={styles.contentCommentContainer}>

                {
                    session && session.user.id === authorId &&
                    <TrashIcon
                        onClick={() => deleteAnswer(id)}
                        className={styles.trash}/>
                }


                <div className={styles.authorDate}>
                    <h8>{pseudo}<span>{id}</span></h8>
                </div>
                <p className={tooLong ? styles.cutCommentary + " " + styles.commentary : styles.commentary}>{content}
                </p>
                {
                    hasLike ?
                        <p className={styles.commentary}>true</p> :
                        <p className={styles.commentary}>false</p>
                }

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
                    <p className={styles.likeCount}><HeartIcon
                    onClick={() => {
                        if(session){
                            likeAnswer()
                        }
                    }}
                    /> {likes}</p>
                </div>

            </div>
        </div>
    </div>
)
}


export default SubCommentary;