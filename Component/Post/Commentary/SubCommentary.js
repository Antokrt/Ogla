import styles from "../../../styles/Component/Post/Commentary/SubCommentary.module.scss";
import {HeartIcon} from "@heroicons/react/24/solid";
import {useEffect, useState} from "react";
const SubCommentary = ({img, pseudo, date, content, likes}) => {

    const [sizeCommentary,setSizeCommentary] = useState(content.length);
    const [tooLong,setTooLong] = useState(false);



return (
    <div className={styles.container}>
        <div className={styles.containerComment}>
            <div className={styles.imgContainer}>
                <img src={img} alt={"Image Profil User"}/>
            </div>

            <div className={styles.contentCommentContainer}>
                <div className={styles.authorDate}>
                    <h8>{pseudo}<span>{date}</span></h8>
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
                    <p className={styles.likeCount}><HeartIcon/> 123</p>
                </div>

            </div>
        </div>
    </div>
)
}


export default SubCommentary;