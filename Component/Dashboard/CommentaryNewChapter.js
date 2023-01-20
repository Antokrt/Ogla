import styles from '../../styles/Component/Dashboard/CommentaryNewChapter.module.scss';
import DateNow from "../../utils/Date";
import {useState} from "react";
import scrollbar from "../../styles/utils/scrollbar.module.scss";
import {HeartIcon} from "@heroicons/react/20/solid";
import SubCommentary from "../Post/Commentary/SubCommentary";

const CommentaryNewChapter = ({img,content,likes,pseudo,date}) => {


    const [full, setFull] = useState(false);
    const [answer,setAnswer] = useState('');


    return (
        <div className={styles.container}>
            <div className={styles.containerImg}>
                <img src={img}/>
            </div>

            <div className={styles.containerContent}>
                <div className={styles.headerContent}>
                    <p className={styles.author}>{pseudo}</p>
                    <p className={styles.role}>Lecteur - {date} - {likes} likes</p>
                </div>

                <p className={ !full ? styles.cutCommentary + ' '  + styles.content : styles.content}> {content}</p>




                {
                    content?.length > 319 &&
                    <>
                        {
                            !full && content.length ?
                                <div>
                                    <p className={styles.seeMore} onClick={() => setFull(!full)}>Voir plus</p>

                                </div>

                                :
                                <p className={styles.seeMore} onClick={() => setFull(!full)}>Voir moins</p>

                        }
                    </>

                }
                <div className={styles.answer}>
                    <SubCommentary
                        subCommentary={"Merci pour ton commentaire"}
                    />
                </div>

                <textarea
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder={'Répondez à @' + pseudo+ '...'} className={scrollbar.scrollbar}>
                </textarea>

                <div className={styles.btnContainer}>
                    <button className={answer !== '' ? styles.btnAnswer + ' ' + styles.activeBtn : styles.btnAnswer}>Répondre</button>
                    <button className={styles.likeBtn}><HeartIcon/></button>
                </div>
            </div>
        </div>
    )
}

export default CommentaryNewChapter;