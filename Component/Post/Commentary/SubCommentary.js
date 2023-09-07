import styles from "../../../styles/Component/Post/Commentary/SubCommentary.module.scss";
import anim from "../../../styles/utils/anim.module.scss";
import {HeartIcon} from "@heroicons/react/24/solid";
import {useEffect, useRef, useState} from "react";
import {useSession} from "next-auth/react";
import {EllipsisHorizontalIcon, FlagIcon, TrashIcon} from "@heroicons/react/24/outline";
import {LikeBtn, TextLikeBtn} from "../../layouts/Btn/Like";
import {FormatDateFrom} from "../../../utils/Date";
import {GetDefaultUserImgWhenError} from "../../../utils/ImageUtils";
import {setActiveModalState} from "../../../store/slices/modalSlice";
import {useDispatch} from "react-redux";
import {LikeAnswerReduce} from "../../../utils/CommentaryUtils";
import {LikeService} from "../../../service/Like/LikeService";
import {SendNotifService} from "../../../service/Notifications/NotificationsService";
import {activeReportModal, deleteMyAnswer, likeOneAnswer, throwAnErr} from "../../../store/slices/commentSlice";
import {DeleteAnswerService} from "../../../service/Answer/AnswerService";
const SubCommentary = ({img, commentId, pseudo, date, content, likes,deleteAnswer, reportAnswer, hasLike, likeAnswer, id, authorId, seeMoreAnswers}) => {

    const [sizeCommentary,setSizeCommentary] = useState(content?.length);
    const [openModalChoice, setOpenModalChoice] = useState(false);
    const [tooLong,setTooLong] = useState(false);
    const dispatch = useDispatch();
    const {data:session } = useSession();
    const dotRef = useRef(null);
    const contentDotRef = useRef(null);

    const like = () => {
        LikeService('answer',id)
            .then(() => {
                dispatch(likeOneAnswer({commentId,id}));
            })

            .catch(() => throwAnErr(true,'Impossible de liker cette réponse.'))
/*   /!*     LikeService('answer', id)
            .then((res) => {
                newArr.map((comment) => {
                    comment.answers.map((reply) => {
                        if (reply._id === replyId) {
                            if (reply.hasLike) {
                                reply.likes = reply.likes - 1;
                            } else {
                                reply.likes += 1;
                                if (authorId != userId) SendNotifService(reply.userId, 5, targetDocumentId, secondTargetDocumentId); else SendNotifService(reply.userId, 7, targetDocumentId, secondTargetDocumentId);
                            }
                            reply.hasLike = !reply.hasLike;
                        }
                    })
                });
                setComments(LikeAnswerReduce(comments, replyId, authorData._id, session.user.id, bookData._id, "null"));*!/
            })
            .catch((err) => console.log(err))*/
    }



    function clickOutside(ref,btnRef, onClickOutside) {
        useEffect(() => {
            /**
             * Invoke Function onClick outside of element
             */
            function handleClickOutside(event) {
                if (ref.current && btnRef.current && !ref.current.contains(event.target) && !btnRef.current.contains(event.target)) {
                    onClickOutside();
                }
            }

            // Bind
            document.addEventListener("mousedown", handleClickOutside);
            return () => {
                // dispose
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }, [ref, btnRef,onClickOutside]);
    }

    clickOutside(dotRef, contentDotRef, () => setOpenModalChoice(false));

    const deleteAanswer = () => {
        DeleteAnswerService(id, session)
            .then(() => dispatch(deleteMyAnswer({commentId,answerId:id})))
            .then(() => {
                setActiveAnswersToDelete({id: null, content: null})
                setOpenConfirmModalForDeleteAnswer(false);
            })
            .catch((err) => console.log(err))
    }

return (
    <div className={styles.container + ' ' + anim.fadeIn}>
        <div className={styles.containerComment}>
            <div className={styles.imgContainer}>
                <img src={img} referrerPolicy={'no-referrer'} onError={(e) => e.target.src = GetDefaultUserImgWhenError() } alt={"Image Profil Ogla"}/>
            </div>

            <div className={styles.contentCommentContainer}>

{/*                {
                    session && session.user.id === authorId &&
                    <TrashIcon
                        onClick={() => deleteAnswer(id)}
                        className={styles.trash}/>
                }*/}

                <div className={styles.dotContainer}>

                        <EllipsisHorizontalIcon
                            onClick={() => {
                                setOpenModalChoice(!openModalChoice)
                            }}
                            ref={dotRef}
                            className={styles.dot}
                        />
                    {
                        openModalChoice &&
                        <div className={styles.dotContent + ' ' + anim.fadeIn} ref={contentDotRef}>
                            {
                                session && authorId === session?.user?.id &&
                                <button onClick={() => deleteAanswer()}> Supprimer <TrashIcon/> </button>
                            }

                            {
                                !session ?
                                    <button onClick={() => dispatch(setActiveModalState(true))}> Signaler <FlagIcon/></button> :
                                        authorId !== session?.user?.id &&
                                    <button onClick={() => dispatch(activeReportModal({type:'answer',id,content}))}> Signaler <FlagIcon/></button>
                            }
                        </div>
                    }
                </div>


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
                    like(id);
                }
                else {
                    dispatch(setActiveModalState(true));
                }
            }} nb={likes} isLike={hasLike}/>
                </div>

            </div>
        </div>
    </div>
)
}


export default SubCommentary;