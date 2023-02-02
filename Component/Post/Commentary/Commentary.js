import styles from "../../../styles/Component/Post/Commentary/Commentary.module.scss";
import scroll from "../../../styles/utils/scrollbar.module.scss";
import {useEffect, useState} from "react";
import {HeartIcon} from "@heroicons/react/24/solid";
import {ArrowDownIcon, ArrowUpIcon, HandThumbUpIcon, TrashIcon} from "@heroicons/react/24/outline";
import SubCommentary from "./SubCommentary";
import {useSession} from "next-auth/react";
import {DeleteCommentaryService} from "../../../service/Comment/CommentService";
import {LikeBookService, LikeService} from "../../../service/Like/LikeService";

const Commentary = ({pseudo,
                        img,
                        date,
                        content,
                        likes,
                        answers,
                        authorId,
                        deleteComment,
                        id,
                        hasLikeData,
                        likeComment,
                        likeAnswer,
                        sendNewAnswer,
                        deleteAanswer,
                        answerPage,
                    newAnswerPage
                    }) => {

    const [sizeCommentary, setSizeCommentary] = useState(content?.length);
    const [tooLong, setTooLong] = useState(false);
    const [openSubCategory, setOpenSubCategory] = useState(false);
    const [answersList,setAnswersList] = useState(answers);
    const [newAnswer, setNewAnswer] = useState('');
    const [page,setPage] = useState(answerPage)
    const [hasLike,setHasLike] = useState(hasLikeData);
    const {data: session } = useSession();

    useEffect(()=>{
     setHasLike(hasLikeData);
    },[hasLikeData])

    useEffect(() => {
        setAnswersList(answers);
    },[answers])

    useEffect(() => {
        setPage(answerPage)
    },[answerPage])


    useEffect(() => {
        if (sizeCommentary > 200) {
            setTooLong(true);
        }
    }, [])

    return (
        <div className={styles.container}>
            <div className={styles.containerComment}>
                <div className={styles.imgContainer}>
                    <img referrerPolicy="no-referrer" src={img}/>
                </div>


                <div className={styles.contentCommentContainer}>
                    {
                        session && authorId === session.user.id &&
                        <TrashIcon
                            onClick={() => deleteComment(id)}
                            className={styles.trash}/>
                    }

                    <div className={styles.authorDate}>
                        <h8 is={'h8'}>{pseudo}  <span>{id}</span></h8>

                    </div>
                    <p className={tooLong ? styles.cutCommentary + " " + styles.commentary : styles.commentary}>
                        {content}
                        <p>Answer Page : {answerPage}</p>
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
                        <p className={styles.likeCount}><HeartIcon
                        onClick={() => {
                            if(session){
                                likeComment(id);
                            }
                        }}/> {likes}</p>
                        <p className={styles.replyCount}> 29 réponses</p>
                    </div>

                    <div className={styles.replyContainer}>
                        <button className={styles.showReplyBtn}
                                onClick={() => setOpenSubCategory(!openSubCategory)}>
                            {
                                answers?.length <= 0 ?
                                <> Répondre</> :
                                    <>lsalsa</>
                            }
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
                                <textarea
                                    onKeyDown={(e) => {
                                        if(e.key === 'Enter' && !e.shiftKey && newAnswer !== ""){
                                            const data ={
                                                id,content:newAnswer
                                            }
                                            e.preventDefault();
                                            sendNewAnswer(data);
                                            setNewAnswer('');
                                        }
                                    }}
                                    onChange={(e) => setNewAnswer(e.target.value)} value={newAnswer} className={scroll.scrollbar} placeholder={"Répondez à " + pseudo + "..."}/>
                                <div className={styles.sendResponse}>
                                    <button onClick={() => {
                                        if(session && newAnswer !== ""){
                                            const data ={
                                                id,content:newAnswer
                                            }
                                            sendNewAnswer(data);
                                            setNewAnswer('');
                                        }
                                    }
                                    } className={newAnswer !== "" && styles.activeBtn} >Envoyer</button>
                                </div>
                                {
                                    answersList?.map((item,index) => {
                                        return (
                                            <SubCommentary
                                                hasLike={item.hasLike}
                                                deleteAnswer={() => deleteAanswer(item._id)}
                                                id={item._id}
                                                authorId={item.userId}
                                                img={item.img}
                                                pseudo={item.pseudo}
                                                date={item.date_creation}
                                                likes={item.likes}
                                                content={item.content}/>
                                        )
                                    })

                                }
                                <button onClick={() => newAnswerPage(id)}>Voir plus</button>
                            </div>
                        }

                    </div>

                </div>
            </div>
        </div>
    )

}

export default Commentary;