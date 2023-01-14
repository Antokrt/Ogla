import styles from '../../styles/Component/Dashboard/CommentaryDashboard.module.scss';
import scrollbar from '../../styles/utils/scrollbar.module.scss';
import {HeartIcon} from "@heroicons/react/20/solid";
import {useState} from "react";

const CommentaryDashboard = ({img,pseudo, role, date, content, likes}) =>  {

    const [full, setFull] = useState(false);
    const [answer,setAnswer] = useState('');

    return (
        <div className={styles.container}>
            <div className={styles.containerImgAReview}>
                <div className={styles.containerImg}>
                    <img src={img} alt={'Image User Ogla'}/>
                </div>
                <div className={styles.containerUser}>
                    <h6>{pseudo}</h6>
                    <p>{role}</p>
                </div>
            </div>
            <div className={styles.contentContainer}>
                <div className={styles.headerContent}>
                    <p className={styles.date}>{date}</p>
                    <p className={styles.likes}>{likes} <span>like(s)</span></p>
                </div>

                <p className={ !full ? styles.cutCommentary + ' '  + styles.content : styles.content}> "{content}"</p>
                {
                    content.length > 319 &&
                    <>
                        {
                            !full && content.length ?
                                <p className={styles.seeMore} onClick={() => setFull(!full)}>Voir plus</p> :
                                <p className={styles.seeMore} onClick={() => setFull(!full)}>Voir moins</p>

                        }
                    </>

                }


                    <textarea
                        onChange={(e) => setAnswer(e.target.value)}
                        placeholder={'Répondez à @' + pseudo+ '...'} className={scrollbar.scrollbar}>
                </textarea>


                <div className={styles.btnContainer}>
                    <button className={answer !== '' ? styles.answerBtn + ' ' + styles.activeBtn : styles.answerBtn}>Répondre</button>
                    <button className={styles.likeBtn}><HeartIcon/></button>
                </div>

            </div>
        </div>
    )
}

export default CommentaryDashboard;