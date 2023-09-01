import styles from "../../styles/Component/Post/SidebarCommentary.module.scss";
import anim from '../../styles/utils/anim.module.scss';
import scroll from "../../styles/utils/scrollbar.module.scss";
import {createRef, Fragment, useEffect, useRef, useState} from "react";
import {CheckBadgeIcon} from "@heroicons/react/20/solid";
import {BookOpenIcon, QueueListIcon} from "@heroicons/react/24/outline";
import {PaperAirplaneIcon} from "@heroicons/react/24/solid"
import Commentary from "./Commentary/Commentary";
import {useRouter} from "next/router";
import {useSession} from "next-auth/react";
import {
    DeleteCommentaryService,
    GetCommentService,
    GetMyCommentsService,
    NewCommentaryService
} from "../../service/Comment/CommentService";
import {LikeService} from "../../service/Like/LikeService";
import {DeleteAnswerService, NewAnswerService} from "../../service/Answer/AnswerService";
import {Loader2, LoaderCommentary} from "../layouts/Loader";
import {Capitalize, ReduceString} from "../../utils/String";
import {useDispatch, useSelector} from "react-redux";
import {selectLoginModalStatus, setActiveModalState} from "../../store/slices/modalSlice";
import ScreenSize from "../../utils/Size";
import useOrientation from "../../utils/Orientation";
import {FilterBtn, FilterBtn3} from "../layouts/Btn/ActionBtn";
import {ConfirmModal, ConfirmModalCommentary} from "../Modal/ConfirmModal";
import {ErrMsg} from "../ErrMsg";
import {GetImgPathOfAssets} from "../../utils/ImageUtils";
import {NewReportService} from "../../service/Report/ReportService";
import {toastDisplayError, toastDisplaySuccess} from "../../utils/Toastify";
import {
    activeLoading, addComment, addMyComments, cleanComments, disableLoading, hasGetMyComments, incrPages,
    selectComments,
    selectInfosComment,
    setPopular,
    setRecent, throwAnErr
} from "../../store/slices/commentSlice";


const NewSidebarCommentary = ({
                                  errCommentary,
    authorImg,
                              }) => {
    const router = useRouter();
    const [openConfirmModalForDeleteComment, setOpenConfirmModalForDeleteComment] = useState(false);
    const [openConfirmModalForDeleteAnswer, setOpenConfirmModalForDeleteAnswer] = useState(false);
    const [openConfirmModalForReportComment, setOpenConfirmModalForReportComment] = useState(false);
    const [openConfirmModalForReportAnswer, setOpenConfirmModalForReportAnswer] = useState(false);
    const [visible,setVisible] = useState(true);
    const divRef = useRef(null);
    const [activeCommentaryToDelete, setActiveCommentaryToDelete] = useState({
        content: null,
        id: null
    });
    const [activeAnswersToDelete, setActiveAnswersToDelete] = useState({
        content: null,
        id: null
    });
    const [activeCommentToReport, setActiveCommentToReport] = useState({
        content: null,
        id: null
    });
    const [activeAnswerToReport, setActiveAnswerToReport] = useState({
        content: null,
        id: null
    });

    const {data: session} = useSession();
    const orientation = useOrientation();
    const inputRef = useRef(null);
    const dispatch = useDispatch();
    const [width, height] = ScreenSize();
    const [newComment, setNewComment] = useState('');
    const infosComment = useSelector(selectInfosComment);
    const {title, activeId, lastCommentId, type, nbComments, loading, pages, filter, err} = infosComment;
    const {author} = infosComment.author;
    const commentsReducer = useSelector(selectComments);
    const canSeeMore = useState(commentsReducer.length < nbComments);





    const resetCommentReport = () => {
        setActiveCommentToReport({id: null, content: null});
        setOpenConfirmModalForReportComment(false);
    }

    const resetAnswerReport = () => {
        setActiveAnswerToReport({id: null, content: null});
        setOpenConfirmModalForReportAnswer(false);
    }

    const addReportToStorage = (id) => {
        if (typeof window !== 'undefined') {
            let arr = JSON.parse(localStorage.getItem('report'));
            if (!arr) {
                localStorage.setItem('report', JSON.stringify([id]));
            } else {
                arr.push(id);
                localStorage.setItem('report', JSON.stringify(arr));
            }
        }
    }

    const checkIfIdIsAlreadyInStorage = (id) => {
        if (typeof window !== 'undefined') {
            let arr = JSON.parse(localStorage.getItem('report'));
            if (!arr) {
                return false;
            } else {
                return arr.includes(id);
            }
        }
    }

    const report = (id, typeOfReport) => {
        const validTypes = ['comment', 'answer'];

        if (!validTypes.includes(typeOfReport)) {
            resetCommentReport();
            resetAnswerReport();
        }

        if (checkIfIdIsAlreadyInStorage(id)) {
            if (typeOfReport === 'comment') {
                resetCommentReport();
                return toastDisplayError('Déjà signalé !');
            } else {
                resetAnswerReport();
                return toastDisplayError('Déjà signalé !');
            }
        }

        NewReportService(id, typeOfReport)
            .then(() => toastDisplaySuccess('Merci pour votre signalement.'))
            .then(() => addReportToStorage(id))
            .then(() => {
                if (typeOfReport === 'comment') resetCommentReport();
                else resetAnswerReport();
            })
            .catch(() => toastDisplayError('Impossible de signaler ce commentaire.'));
    };

    const scrollBottom = () => {
        divRef.current.scrollTop = divRef.current.scrollHeight
    }

    const scrollToTop = () => {
        return setTimeout(() => {
            divRef.current.scrollTop = 0;
        }, 10)
    }

    const getCommentReducer = async (filter,pages) => {

        if (commentsReducer.length >= nbComments) {
            return null;
        }

        dispatch(activeLoading());
        // setCanScroll(false);
        GetCommentService(infosComment.type, infosComment.activeId, pages, 5, session, filter)
            .then((res) => {
                res.forEach(element => {
                    if (!lastCommentId.includes(element._id)) {
                        dispatch(addComment(element));
                    }
                });
                if (res.length !== 0) {
                    dispatch(incrPages());
                    // setCanScroll(true);
                } else {
                    // setCanScroll(false);
                }
            })
            .then(() => dispatch(disableLoading()))
            .catch((err) => dispatch(throwAnErr()));
    };

    const getMyCommentsReducer = (page, filter) => {
        GetMyCommentsService(infosComment.type, infosComment.activeId, page, filter)
            .then((res) => {
                if (res.length !== 0) {
                   dispatch(addMyComments(res));
                }
            })
            .catch((err) => dispatch(throwAnErr()));
    };

    /*useEffect(() => {
        if (!errCommentary) {
            const div = divRef.current;

            const handleScroll = () => {
                const threshold = 1;
                const isBottom =
                    div.scrollHeight - (div.scrollTop + div.clientHeight) <= threshold;
                if (isBottom && canScroll && !loadingScroll) {
                    getMore()
                }
            };
            div.addEventListener("scroll", handleScroll);
            return () => {
                div.removeEventListener("scroll", handleScroll);
            };
        }

    }, [canScroll, loadingScroll]);*/

    const changeFilter =  (newFilter) => {
        if(nbComments === 0){
            if(newFilter === 'recent'){
                dispatch(setRecent());
            }
            else {
                dispatch(setPopular());
            }
            return null;
        }
        setVisible(false);
         dispatch(activeLoading());
        dispatch(cleanComments());

        if(newFilter === 'recent'){
             dispatch(setRecent())
        }
        else {
             dispatch(setPopular());
        }
         dispatch(cleanComments());
        if(session){
            getMyCommentsReducer(1, newFilter);
            dispatch(hasGetMyComments());
        }
         getCommentReducer(newFilter,1);
        setTimeout(() => setVisible(true),500);
    }

    if (err) {
        return (
            <div className={styles.container}>

                <div className={styles.headerComment}>
                    <p><QueueListIcon/>{Capitalize(title)}</p>
                    <p onClick={() => router.push("/auteur/" + author)}><span>{author}</span></p>
                </div>

                <div className={styles.titleSection}>
                    <h5><span>{nbComments}</span> commentaires </h5>

                    <div>
                        <p
                            className={filter === 'popular' ? styles.filterActive : ''}>Populaires</p>
                        <p
                            className={filter === 'recent' ? styles.filterActive : ''}>Récents</p>
                    </div>
                </div>

                <div className={styles.errContainer}>
                    <h4>Erreur</h4>
                    <p>Impossible de récupérer les commentaires.</p>
                </div>


            </div>
        )
    } else return (
        <div className={styles.container}>
            {
                infosComment.getMyComments ? <p>hasMyComments : true</p> : <p> false</p>
            }
            <div className={styles.headerComment}>
                <p><QueueListIcon/>{Capitalize(title)}</p>
                <p onClick={() => router.push("/auteur/" + author)}><span>{author}</span></p>
            </div>
            <div className={styles.titleSection}>
                <h5><span>{nbComments}</span> commentaires</h5>


                <div>
                    <p onClick={() => filter === 'recent' ? changeFilter('popular') : null}
                       className={filter === 'popular' ? styles.filterActive : ''}>Populaires</p>

                    <p onClick={() => filter === 'popular' ? changeFilter('recent') : null}
                       className={filter === 'recent' ? styles.filterActive : ''}>Récents</p>
                </div>
            </div>

            <div
                ref={divRef}
                className={styles.contentCommentaryContainer + ' ' + scroll.scrollbar + ' ' + anim.fadeIn}>

                {
                    width <= 600 &&
                    <div className={styles.filterPhone}>
                        <FilterBtn3 filter={filter}
                                    onclick={() => filter === 'recent' ? dispatch(setPopular()) : dispatch(setRecent())}/>
                    </div>
                }


                {
                    commentsReducer && commentsReducer.length > 0 && visible &&
                    commentsReducer.map((item,index)=> {
                        return (
                            <Fragment key={item._id}>

                                <Commentary
                                    seeMoreAnswers={item.seeMoreAnswers}
                                    id={item._id}
                                    deleteComment={() => {
                                        setOpenConfirmModalForDeleteAnswer(false);
                                        setOpenConfirmModalForReportAnswer(false);
                                        setOpenConfirmModalForReportComment(false);
                                        setActiveCommentaryToDelete({
                                            content: ReduceString(item.content, 40),
                                            id: item._id
                                        })
                                        setOpenConfirmModalForDeleteComment(true);
                                    }}
                                    reportComment={() => {
                                        setOpenConfirmModalForDeleteComment(false);
                                        setOpenConfirmModalForDeleteAnswer(false);
                                        setOpenConfirmModalForReportAnswer(false);
                                        setActiveCommentToReport({
                                            content: ReduceString(item.content, 40),
                                            id: item._id
                                        })
                                        setOpenConfirmModalForReportComment(true);
                                    }}
                                    deleteAanswer={(id, content) => {
                                        setOpenConfirmModalForDeleteComment(false);
                                        setOpenConfirmModalForReportComment(false);
                                        setOpenConfirmModalForReportAnswer(false);
                                        setActiveAnswersToDelete({
                                            content: ReduceString(content, 40),
                                            id: id
                                        })
                                        setOpenConfirmModalForDeleteAnswer(true);
                                    }}
                                    reportAnswer={(id, content) => {
                                        setOpenConfirmModalForDeleteComment(false);
                                        setOpenConfirmModalForDeleteAnswer(false);
                                        setOpenConfirmModalForReportComment(false);
                                        setActiveAnswerToReport({
                                            content: ReduceString(content, 40),
                                            id: id
                                        })
                                        setOpenConfirmModalForReportAnswer(true);
                                    }}
                                    likeAanswer={(id) => 'likeAanswer(id)'}
                                    likeComment={() => 'likeComment(item._id)'}
                                    sendNewAnswer={(data) => 'sendNewAnswer(data)'}
                                    answerPage={item.answersPage}
                                    newAnswerPage={() => 'newPageAnswer(item._id)'}
                                    authorId={item.userId}
                                    hasLikeData={item.hasLike}
                                    content={Capitalize(item.content)}
                                    authorHasLike={item.authorHasLike}
                                    authorImg={authorImg}
                                    authorPseudo={author}
                                    nbAnswers={item?.nbAnswers}
                                    likes={item.likes}
                                    img={item.img}
                                    date={item.date_creation}
                                    pseudo={item.pseudo}
                                    answers={item.answers}
                                />

                            </Fragment>
                        )
                    })
                }



                {
                    nbComments <= 0 && !loading &&
                    <div className={styles.empty + ' ' + anim.fadeIn}>
                        <img src={GetImgPathOfAssets() + 'utils/smile8.png'} alt={'Image Jim Ogla'}
                             onError={(e) => e.target.src = '/assets/jim/smile8.png'}/>
                        <p>C&apos;est bien silencieux ici ! <br/> <span onClick={() => {
                            if (session) {
                                inputRef.current.focus();
                            } else {
                                dispatch(setActiveModalState(true));
                            }
                        }}>Écris le premier commentaire dès maintenant... </span></p>
                    </div>
                }
                {
                    loading && width <= 800 &&
                    <div className={styles.loaderContainerPhone}><LoaderCommentary/></div>
                }

            </div>


            <div className={styles.commentaryContainer}>

                <div className={styles.formContainer}>
                    {
                        session ?
                            <textarea
                                ref={inputRef}
                                value={newComment}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey && newComment !== "") {
                                        e.preventDefault();
                                        sendNewComment();
                                    }
                                }}
                                onChange={(e) => setNewComment(e.target.value)}
                                className={scroll.scrollbar} type="textarea" placeholder="Ecrire un commentaire..."/>
                            :
                            <textarea
                                className={scroll.scrollbar}
                                type={"textarea"}
                                onClick={() => dispatch(setActiveModalState(true))}
                                placeholder={"Connectez vous pour pouvoir commenter..."}
                                readOnly={true}
                            />
                    }
                </div>
                {
                    loading && commentsReducer.length >= 1 &&
                    <div className={styles.loaderContainer}><LoaderCommentary/></div>
                }

                {
                    commentsReducer.length < nbComments &&
                    <button onClick={() => getCommentReducer(filter,pages)}>Voir plus</button>
                }

                <div
                    onClick={() => {
                        if (newComment !== "") {
                        }
                    }}
                    className={newComment !== "" ? styles.active + " " + styles.sendContainer : styles.sendContainer}>
                    <PaperAirplaneIcon/>
                </div>
            </div>


            {
                openConfirmModalForDeleteComment && activeCommentaryToDelete.id &&
                <ConfirmModalCommentary btnConfirm={'Confirmer'}
                                        confirm={() => deleteComment(activeCommentaryToDelete.id)} close={() => {
                    setActiveCommentaryToDelete({id: null, content: null})
                    setOpenConfirmModalForDeleteComment(false);
                }} title={'Supprimer votre commentaire ?'} subTitle={Capitalize(activeCommentaryToDelete.content)}/>
            }

            {
                openConfirmModalForDeleteComment && activeCommentaryToDelete.id &&
                <ConfirmModalCommentary btnConfirm={'Confirmer'}
                                        confirm={() => deleteComment(activeCommentaryToDelete.id)} close={() => {
                    setActiveCommentaryToDelete({id: null, content: null})
                    setOpenConfirmModalForDeleteComment(false);
                }} title={'Supprimer votre commentaire ?'} subTitle={Capitalize(activeCommentaryToDelete.content)}/>
            }

            {
                openConfirmModalForDeleteAnswer && activeAnswersToDelete.id &&
                <ConfirmModalCommentary btnConfirm={'Confirmer'} confirm={() => {
                    deleteAanswer(activeAnswersToDelete.id);
                }} close={() => {
                    setActiveAnswersToDelete({id: null, content: null})
                    setOpenConfirmModalForDeleteAnswer(false);
                }} title={'Supprimer votre réponse ?'} subTitle={Capitalize(activeAnswersToDelete.content)}/>
            }


            {
                openConfirmModalForReportComment && activeCommentToReport.id &&
                <ConfirmModalCommentary btnConfirm={'Confirmer'} confirm={() => {
                    report(activeCommentToReport.id, 'comment');
                }} close={() => {
                    resetCommentReport();
                }} title={'Signaler ce commentaire ?'} subTitle={Capitalize(activeCommentToReport.content)}/>
            }


            {
                openConfirmModalForReportAnswer && activeAnswerToReport.id &&
                <ConfirmModalCommentary btnConfirm={'Confirmer'} confirm={() => {
                    report(activeAnswerToReport.id, 'answer');
                }} close={() => {
                    resetAnswerReport();
                }} title={'Signaler cette réponse ?'} subTitle={Capitalize(activeAnswerToReport.content)}/>
            }

        </div>
    )
}

export default NewSidebarCommentary;