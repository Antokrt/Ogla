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
import {DeleteCommentaryService, GetCommentService, NewCommentaryService} from "../../service/Comment/CommentService";
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


const SidebarCommentary = ({
    errCommentary,
                               scrollChange,
                               title,
                               author,
                               comments,
                               typeId,
                               type,
                               getMore,
                               limit,
                               page,
                               createNewComment,
                               refresh,
                               nbCommentary,
                               authorImg,
                               canScroll,
                               deleteAComment,
                               likeAComment,
                               loadingScroll,
                               sendANewAnswer,
                               deleteAnswer,
                               changeFilter,
                               activeFilter,
                               likeAnswer,
                               newPageAnswer,
    isEmpty
                           }) => {
    const router = useRouter();
    const [commentList, setCommentList] = useState(comments);
    const [newComment, setNewComment] = useState('');
    const [openConfirmModalForDeleteComment,setOpenConfirmModalForDeleteComment] = useState(false);
    const [openConfirmModalForDeleteAnswer,setOpenConfirmModalForDeleteAnswer] = useState(false);
    const divRef = useRef(null);
    const [endRefresh,setEndRefresh] = useState(true);
    const [load,setLoad] = useState(false);
    const [activeCommentaryToDelete, setActiveCommentaryToDelete] = useState({
        content:null,
        id:null
    });
    const [activeAnswersToDelete, setActiveAnswersToDelete] = useState({
        content:null,
        id:null
    });
    const {data: session} = useSession();
    const orientation = useOrientation();
    const inputRef = useRef(null);
    const dispatch = useDispatch();
    const [width, height] = ScreenSize();


    useEffect(() => {
        setCommentList(comments);
        setEndRefresh(false)
        setTimeout(() => {
            setEndRefresh(true);
        },200)
    }, [comments])



    const sendNewComment = () => {
        NewCommentaryService(typeId, newComment, type)
            .then((res) => {
                res.answersPage = 1;
                createNewComment(res);
                setNewComment('');
            })
            .then(() => scrollToTop())
            .catch((err) => console.log(err));
    }

    const deleteComment = (id) => {
        DeleteCommentaryService(id)
            .then(() => deleteAComment(id))
            .then(() => {
                setActiveCommentaryToDelete({id: null,content: null})
                setOpenConfirmModal(false);
            })
            .catch((err) => console.log(err));
    }

    const likeComment = (id) => {
        LikeService('comment', id)
            .then(() => likeAComment(id))
            .catch((err) => console.log(err));
    }

    const sendNewAnswer = (data) => {
        NewAnswerService(data.id, data.content, session)
            .then((res) => sendANewAnswer(res.data))
            .catch((err) => console.log(err));
    }

    const deleteAanswer = (id) => {
        DeleteAnswerService(id, session)
            .then(() => deleteAnswer(id))
            .then(() => {
                setActiveAnswersToDelete({id: null,content: null})
                setOpenConfirmModalForDeleteAnswer(false);
            })
            .catch((err) => console.log(err))
    }

    const likeAanswer = (id) => {
        LikeService('answer', id)
            .then((res) => likeAnswer(id))
            .catch((err) => console.log(err))
    }

    useEffect(() => {
        setCommentList(comments);
    }, [comments])

    const scrollBottom = () => {
        divRef.current.scrollTop = divRef.current.scrollHeight
    }

    const scrollToTop = () => {
        return setTimeout(() => {
            divRef.current.scrollTop = 0;
        },10)
    }


    useEffect(() => {
        if(!errCommentary){
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

    }, [canScroll, loadingScroll]);

    if(width > 600 && height > 500 && orientation !== 'landscape'){

    }

    if(errCommentary){
        return (
            <div className={styles.container}>

                <div className={styles.headerComment}>
                    <p><QueueListIcon/>{Capitalize(title)}</p>
                    <p onClick={() => router.push("/auteur/" + author)}><span>{author}</span></p>
                </div>

                <div className={styles.titleSection}>
                    <h5>Commentaire(s) <span>({nbCommentary})</span></h5>

                    <div>
                        <p
                           className={activeFilter === 'popular' ? styles.filterActive : ''}>Populaire(s)</p>
                        <p
                           className={activeFilter === 'recent' ? styles.filterActive : ''}>Récent(s)</p>
                    </div>
                </div>

                <div className={styles.errContainer}>
                    <h4>Erreur</h4>
                    <p>Impossible de récupérer les commentaires.</p>
                </div>


            </div>
        )
    }

    else return (
        <div className={styles.container}>
            <div className={styles.headerComment}>
                <p><QueueListIcon/>{Capitalize(title)}</p>
                <p onClick={() => router.push("/auteur/" + author)}><span>{author}</span></p>
            </div>
            <div className={styles.titleSection}>
                <h5>Commentaire(s) <span>({nbCommentary})</span></h5>

                <div>
                    <p onClick={() => {
                        changeFilter('popular');
                    }}
                       className={activeFilter === 'popular' ? styles.filterActive : ''}>Populaire(s)</p>
                    <p onClick={() => {
                        changeFilter('recent');
                    }}
                       className={activeFilter === 'recent' ? styles.filterActive : ''}>Récent(s)</p>
                </div>
            </div>

            <div
                ref={divRef}
                className={styles.contentCommentaryContainer + ' ' + scroll.scrollbar + ' ' + anim.fadeIn}>

                {
                    width <= 600 &&
                    <div className={styles.filterPhone}>
                        <FilterBtn3 filter={activeFilter} onclick={() => {
                        if(activeFilter === 'recent'){
                            changeFilter('popular');
                        }
                        else {
                            changeFilter('recent');
                        }
                        }
                        }/>
                    </div>
                }


                {
                    commentList && comments.length > 0 && commentList.map((item, index) => {

                        console.log(item.nbAnswers);
                        return (
                            <Fragment key={item._id}>
                                <Commentary
                                    seeMoreAnswers={item.seeMoreAnswers}
                                    id={item._id}
                                    deleteComment={() => {
                                        setOpenConfirmModalForDeleteAnswer(false);
                                        setActiveCommentaryToDelete({
                                            content: ReduceString(item.content,40),
                                            id:item._id
                                        })
                                        setOpenConfirmModalForDeleteComment(true);
                                    }}
                                    deleteAanswer={(id,content) => {
                                        setOpenConfirmModalForDeleteComment(false);

                                        setActiveAnswersToDelete({
                                            content: ReduceString(content,40),
                                            id:id
                                        })
                                        setOpenConfirmModalForDeleteAnswer(true);
                                    }}
                                    likeAanswer={(id) => likeAanswer(id)}
                                    likeComment={() => likeComment(item._id)}
                                    sendNewAnswer={(data) => sendNewAnswer(data)}
                                    answerPage={item.answersPage}
                                    newAnswerPage={() => newPageAnswer(item._id)}
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
                     comments.length <= 0 && !loadingScroll && endRefresh &&
                    <div className={styles.empty + ' ' + anim.fadeIn}>
                        <img src={GetImgPathOfAssets() + 'jim/smile8.png'} alt={'Image Jim Ogla'} onError={(e) => e.target.src = '/assets/jim/smile8.png'}/>
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
                    loadingScroll && width <= 800 &&
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
                        loadingScroll && commentList.length >= 1 &&
                        <div className={styles.loaderContainer}><LoaderCommentary/></div>
                    }

                    <div
                        onClick={() => {
                            if (newComment !== "") {
                                sendNewComment();
                            }
                        }}
                        className={newComment !== "" ? styles.active + " " + styles.sendContainer : styles.sendContainer}>
                        <PaperAirplaneIcon/>
                    </div>
                </div>


            {
                openConfirmModalForDeleteComment && activeCommentaryToDelete.id &&
                <ConfirmModalCommentary btnConfirm={'Confirmer'} confirm={() => deleteComment(activeCommentaryToDelete.id)}  close={() => {
                    setActiveCommentaryToDelete({id: null,content: null})
                    setOpenConfirmModalForDeleteComment(false);
                }} title={'Supprimer votre commentaire ?'} subTitle={Capitalize(activeCommentaryToDelete.content)} />
            }

            {
                openConfirmModalForDeleteAnswer && activeAnswersToDelete.id &&
                <ConfirmModalCommentary btnConfirm={'Confirmer'} confirm={() => {
                    deleteAanswer(activeAnswersToDelete.id);
                }}  close={() => {
                    setActiveAnswersToDelete({id: null,content: null})
                    setOpenConfirmModalForDeleteAnswer(false);
                }} title={'Supprimer votre réponse ?'} subTitle={Capitalize(activeAnswersToDelete.content)} />
            }

        </div>
    )
}

export default SidebarCommentary;