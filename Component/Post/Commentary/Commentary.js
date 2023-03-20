import styles from "../../../styles/Component/Post/Commentary/Commentary.module.scss";
import scroll from "../../../styles/utils/scrollbar.module.scss";
import {useEffect, useState} from "react";
import {HeartIcon} from "@heroicons/react/24/solid";
import {ArrowDownIcon, ArrowUpIcon, HandThumbUpIcon, TrashIcon} from "@heroicons/react/24/outline";
import SubCommentary from "./SubCommentary";
import {useSession} from "next-auth/react";
import {DeleteCommentaryService} from "../../../service/Comment/CommentService";
import {LikeBookService, LikeService} from "../../../service/Like/LikeService";
import {FormatDateFrom, FormatDateStr} from "../../../utils/Date";
import {useDispatch, useSelector} from "react-redux";
import {selectLoginModalStatus, setActiveModalState} from "../../../store/slices/modalSlice";
import {LikeBtn, TextLikeBtn} from "../../layouts/Btn/Like";

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
                        likeAanswer,
                        sendNewAnswer,
                        deleteAanswer,
    nbAnswers,
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
    const modalState = useSelector(selectLoginModalStatus);
    const dispatch = useDispatch();

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
                        <h8 is={'h8'}>{pseudo}  <span>{FormatDateFrom(date)}</span></h8>

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
                        <p className={styles.likeCount}><TextLikeBtn nb={likes} isLike={hasLike} onLike={() => {
                            if(session){
                                likeComment(id);
                            }
                            else {
                                dispatch(setActiveModalState(true))
                            }
                        }}/> </p>

                        <p className={styles.replyCount}> {nbAnswers} réponse(s)</p>
                    </div>

                    <div className={styles.replyContainer}>
                        <button className={styles.showReplyBtn}
                                onClick={() => setOpenSubCategory(!openSubCategory)}>
                            {
                                answers?.length <= 0 ?
                                <> Répondre</> :
                                    <>Voir les réponses</>
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
                                {
                                    session ?
                                    <textarea
                                        onKeyDown={(e) => {
                                            if(e.key === 'Enter' && !e.shiftKey && newAnswer !== "" && session){
                                                const data ={
                                                    id,content:newAnswer
                                                }
                                                e.preventDefault();
                                                sendNewAnswer(data);
                                                setNewAnswer('');
                                            }
                                        }}
                                        onChange={(e) => {
                                            if(session){
                                                setNewAnswer(e.target.value);
                                            }
                                        }} value={newAnswer} className={scroll.scrollbar} placeholder={"Répondez à " + pseudo + "..."}/> :

                                        <textarea onClick={() => dispatch(setActiveModalState(true))} readOnly={true} className={scroll.scrollbar} placeholder={"Connectez vous pour répondre à " + pseudo+ '...'}/>
                                }



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
                                <div className={styles.listReply}>
                                    {
                                        answersList?.map((item,index) => {
                                            return (
                                                <SubCommentary
                                                    hasLike={item.hasLike}
                                                    deleteAnswer={() => deleteAanswer(item._id)}
                                                    likeAnswer={() => likeAanswer(item._id)}
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

                                </div>

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