import styles from "../../../styles/Component/Post/Commentary/Commentary.module.scss";
import anim from '../../../styles/utils/anim.module.scss';
import scroll from "../../../styles/utils/scrollbar.module.scss";
import ReactDOM from "react-dom"
import { Fragment, useEffect, useRef, useState } from "react";
import { HeartIcon } from "@heroicons/react/24/solid";
import {
    ArrowDownIcon,
    ArrowUpIcon,
    EllipsisHorizontalIcon, FlagIcon,
    HandThumbUpIcon,
    TrashIcon
} from "@heroicons/react/24/outline";
import SubCommentary from "./SubCommentary";
import { useSession } from "next-auth/react";
import { DeleteCommentaryService, GetAuthorProfilOfCommentService } from "../../../service/Comment/CommentService";
import { LikeBookService, LikeService } from "../../../service/Like/LikeService";
import { FormatDateFrom, FormatDateStr } from "../../../utils/Date";
import { useDispatch, useSelector } from "react-redux";
import { selectLoginModalStatus, setActiveModalState } from "../../../store/slices/modalSlice";
import { LikeBtn, TextLikeBtn } from "../../layouts/Btn/Like";
import { ConfirmModal } from "../../Modal/ConfirmModal";
import { GetDefaultUserImgWhenError } from "../../../utils/ImageUtils";
import { FormatCount } from "../../../utils/NbUtils";
import {
    activeDeleteModal,
    activeReportModal,
    addAnswer,
    deleteMyComment, getMoreAnswers,
    likeAComment,
    selectAnswers,
    selectAnswersPage,
    selectInfosComment,
    throwAnErr
} from "../../../store/slices/commentSlice";
import { GetAnswerByCommentService, NewAnswerService } from "../../../service/Answer/AnswerService";
import { LoaderCommentary } from "../../layouts/Loader";
import { SendAnswerReduce } from "../../../utils/CommentaryUtils";
import { SendNotifService } from "../../../service/Notifications/NotificationsService";
import { ReduceString } from "../../../utils/String";
import { selectTheme } from "../../../store/slices/themeSlice";

const Commentary = ({
    pseudo,
    img,
    date,
    content,
    likes,
    answers,
    authorId,
    deleteComment,
    id,
    reportComment,
    reportAnswer,
    hasLikeData,
    likeComment,
    likeAanswer,
    sendNewAnswer,
    deleteAanswer,
    nbAnswers,
    seeMoreAnswers,
    authorHasLike,
    authorImg,
    authorPseudo,
    answerPage,
    newAnswerPage
}) => {

    const [sizeCommentary, setSizeCommentary] = useState(content?.length);
    const [tooLong, setTooLong] = useState(content?.length > 200);
    const [openSubCategory, setOpenSubCategory] = useState(false);
    const [answersList, setAnswersList] = useState(answers);
    const [newAnswer, setNewAnswer] = useState('');
    const [page, setPage] = useState(answerPage);
    const [loading, setLoading] = useState(false);
    const [hasLike, setHasLike] = useState(hasLikeData);
    const [openModalChoice, setOpenModalChoice] = useState(false);
    const { data: session } = useSession();
    const modalState = useSelector(selectLoginModalStatus);
    const answersReducer = useSelector(state => selectAnswers(state, id));
    const answersPage = useSelector(state => selectAnswersPage(state, id));
    const contentDotRef = useRef(null);
    const dotRef = useRef(null);
    const dispatch = useDispatch();
    const infosComment = useSelector(selectInfosComment);
    const theme = useSelector(selectTheme);

    useEffect(() => {
        setHasLike(hasLikeData);
    }, [hasLikeData])

    useEffect(() => {
        setAnswersList(answers);
    }, [answers])

    useEffect(() => {
        setPage(answerPage)
    }, [answerPage])


    function clickOutside(ref, btnRef, onClickOutside) {
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
        }, [ref, btnRef, onClickOutside]);
    }

    clickOutside(dotRef, contentDotRef, () => setOpenModalChoice(false));

    const newLikeComment = () => {
        LikeService('comment', id)
            .then(() => dispatch(likeAComment(id)))
            .then(() => {
                if (hasLike === true)
                    return;
                if (infosComment.type === "book") {
                    // infosComment.author._id => l'autheur du livre 
                    if (infosComment.author._id === session.user.id)
                        //authorId => l'autheur du commentaire auquel on répond
                        SendNotifService(authorId, 6, infosComment.activeId, "null")
                    else
                        SendNotifService(authorId, 4, infosComment.activeId, "null")
                }
                else {
                    if (infosComment.author._id === session.user.id)
                        SendNotifService(authorId, 6, infosComment.activeId, infosComment.bookId)
                    else
                        SendNotifService(authorId, 4, infosComment.activeId, infosComment.bookId)
                }
            })
            .catch((err) => dispatch(throwAnErr(true, '')));
    }

    const loadMoreAnswers = () => {
        setLoading(true);
        GetAnswerByCommentService(id, answersPage, 1, session)
            .then((res) => {
                dispatch(getMoreAnswers({ commentId: id, answers: res.data }));
            })
            .then(() => setLoading(false))
            .catch(() => {
                throwAnErr(true, 'Impossible de récupérer les réponses.');
                setLoading(false);
            })
    }

    const sendAnswer = (data) => {
        NewAnswerService(data.id, data.content, session)
            .then((res) => dispatch(addAnswer({ commentId: id, data: res.data })))
            .then(() => {
                if (infosComment.type === "book") {
                    // infosComment.author._id => l'autheur du livre 
                    if (infosComment.author._id === session.user.id)
                        //authorId => l'autheur du commentaire auquel on répond
                        SendNotifService(authorId, 21, infosComment.activeId, "null")
                    else
                        SendNotifService(authorId, 20, infosComment.activeId, "null")
                }
                else {
                    if (infosComment.author._id === session.user.id)
                        SendNotifService(authorId, 21, infosComment.activeId, infosComment.bookId)
                    else
                        SendNotifService(authorId, 20, infosComment.activeId, infosComment.bookId)
                }
            })
            .catch((err) => throwAnErr(true));
    }

    return (
        <div className={theme ? styles.container + ' ' + anim.fadeIn : styles.container + ' ' + anim.fadeIn + ' ' + styles.dark}>
            <div className={styles.containerComment}>
                <div className={styles.imgContainer}>

                    <img referrerPolicy="no-referrer" alt={'Image Profil Ogla'} src={img}
                        onError={(e) => e.target.src = GetDefaultUserImgWhenError()} />
                </div>

                <div className={styles.contentCommentContainer}>
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
                                    <button onClick={() => dispatch(activeDeleteModal({ type: 'comment', id, content }))}> Supprimer <TrashIcon /> </button>
                                }

                                {
                                    !session ?
                                        <button onClick={() => {
                                            dispatch(setActiveModalState(true));
                                        }}> Signaler <FlagIcon /></button>
                                        :
                                        authorId !== session?.user?.id &&
                                        <button onClick={() => dispatch(activeReportModal({ type: 'comment', id, content }))}> Signaler <FlagIcon /></button>
                                }
                            </div>
                        }
                    </div>

                    <div className={styles.authorDate}>
                        <h8 is={'h8'}>{pseudo} <span>{FormatDateFrom(date)}</span></h8>
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
                        <div className={styles.likeCount}><TextLikeBtn nb={likes} isLike={hasLike} onLike={() => {
                            if (session) {
                                newLikeComment();
                            } else {
                                dispatch(setActiveModalState(true))
                            }
                        }} /></div>


                        <p className={styles.replyCount}> {FormatCount(nbAnswers)} réponses</p>
                    </div>

                    <div className={styles.replyContainer}>
                        <div className={styles.show}>
                            <button className={styles.showReplyBtn}
                                onClick={() => setOpenSubCategory(!openSubCategory)}>
                                {
                                    answers?.length <= 0 ?
                                        <> Répondre</> :
                                        <>Voir les réponses</>
                                }
                                {
                                    openSubCategory &&
                                    <ArrowUpIcon />
                                }
                                {
                                    !openSubCategory &&
                                    <ArrowDownIcon />
                                }
                            </button>

                            {
                                authorHasLike &&
                                <div className={styles.likeAuthor}>

                                    <img
                                        title={authorPseudo}
                                        alt={'Image Ecrivain Ogla'} src={authorImg}
                                        onError={(e) => e.target.src = GetDefaultUserImgWhenError()}
                                        referrerPolicy={'no-referrer'} />
                                    <HeartIcon className={styles.like} />

                                </div>
                            }

                        </div>


                        {
                            openSubCategory &&
                            <div className={styles.containerSubCommentary}>

                                {
                                    session ?
                                        <textarea
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' && !e.shiftKey && newAnswer !== "" && session) {
                                                    const data = {
                                                        id, content: newAnswer
                                                    }
                                                    e.preventDefault();
                                                    sendAnswer(data);
                                                    setNewAnswer('');
                                                }
                                            }}
                                            onChange={(e) => {
                                                if (session) {
                                                    setNewAnswer(e.target.value);
                                                }
                                            }} value={newAnswer} className={scroll.scrollbar}
                                            placeholder={"Répondez à " + pseudo + "..."} /> :

                                        <textarea onClick={() => dispatch(setActiveModalState(true))} readOnly={true}
                                            className={scroll.scrollbar}
                                            placeholder={"Connectez vous pour répondre à " + pseudo + '...'} />
                                }


                                <div className={styles.sendResponse}>

                                    <button onClick={() => {
                                        if (session && newAnswer !== "") {
                                            const data = {
                                                id, content: newAnswer
                                            }
                                            sendAnswer(data);
                                            setNewAnswer('');
                                        }
                                    }
                                    } className={newAnswer !== "" ? styles.activeBtn : ''}>Envoyer
                                    </button>
                                </div>
                                <div className={styles.listReply}>
                                    {
                                        answersReducer?.map((item, index) => {
                                            return (
                                                <Fragment key={item._id}>
                                                    <SubCommentary
                                                        hasLike={item.hasLike}
                                                        deleteAnswer={() => deleteAanswer(item._id, item.content)}
                                                        likeAnswer={() => likeAanswer(item._id)}
                                                        reportAnswer={() => reportAnswer(item._id, item.content)}
                                                        id={item._id}
                                                        authorId={item.userId}
                                                        img={item.img}
                                                        commentId={id}
                                                        pseudo={item.pseudo}
                                                        date={item.date_creation}
                                                        likes={item.likes}
                                                        content={item.content} />
                                                </Fragment>

                                            )
                                        })

                                    }

                                    {
                                        seeMoreAnswers && nbAnswers > answersReducer.length &&
                                        <div className={styles.getMoreBtn}>
                                            {
                                                !loading ?
                                                    <button onClick={() => loadMoreAnswers()}>Voir plus</button> :
                                                    <LoaderCommentary />
                                            }
                                        </div>
                                    }

                                </div>

                            </div>
                        }

                    </div>


                </div>
                {
                    openModalChoice &&
                    ReactDOM.createPortal(
                        <div className={styles.overlay} onClick={() => setOpenModalChoice(false)}>
                        </div>,
                        document.getElementsByTagName('body')[0]
                    )

                }

            </div>
        </div>
    )

}

export default Commentary;