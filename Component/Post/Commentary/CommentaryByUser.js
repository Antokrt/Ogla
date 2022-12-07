import styles from "../../../styles/Component/Post/Commentary/CommentaryByUser.module.scss";
import {useEffect, useState} from "react";
import {HeartIcon} from "@heroicons/react/24/outline";
import {ArrowDownIcon, ArrowUpIcon, HandThumbUpIcon} from "@heroicons/react/24/outline";
import SubCommentary from "./SubCommentary";

const CommentaryByUser = (props) => {

    const [sizeCommentary, setSizeCommentary] = useState(props.commentary?.length);
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
                    <img src={"/assets/livre2.jpg"}/>
                </div>

                <div className={styles.contentCommentContainer}>
                    <div className={styles.authorDate}>
                        <h8>Mireille Culotte <span>18 sept 22</span></h8>
                    </div>
                    <p className={tooLong ? styles.cutCommentary + " " + styles.commentary : styles.commentary}>{props.commentary}
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

export default CommentaryByUser;