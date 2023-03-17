import styles from "../../styles/Component/Post/SidebarCommentary.module.scss";
import scroll from "../../styles/utils/scrollbar.module.scss";
import {createRef, useEffect, useRef, useState} from "react";
import {CheckBadgeIcon} from "@heroicons/react/20/solid";
import {BookOpenIcon, QueueListIcon} from "@heroicons/react/24/outline";
import {PaperAirplaneIcon} from "@heroicons/react/24/solid"
import Commentary from "./Commentary/Commentary";
import {useRouter} from "next/router";
import {useSession} from "next-auth/react";
import {DeleteCommentaryService, GetCommentService, NewCommentaryService} from "../../service/Comment/CommentService";
import {LikeService} from "../../service/Like/LikeService";
import {DeleteAnswerService, NewAnswerService} from "../../service/Answer/AnswerService";
import InfiniteScroll from "react-infinite-scroller";
import {Loader2, LoaderCommentary} from "../layouts/Loader";
import {Capitalize} from "../../utils/String";


const SidebarCommentary = ({
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
                               canScroll,
                               deleteAComment,
                               likeAComment,
                               loadingScroll,
                               sendANewAnswer,
                               deleteAnswer,
                               changeFilter,
                               activeFilter,
                               likeAnswer,
                               newPageAnswer
                           }) => {
    const router = useRouter();
    const [commentList, setCommentList] = useState(comments);
    const [newComment, setNewComment] = useState('');
    const divRef = useRef(null);

    const {data: session} = useSession();

    useEffect(() => {
        setCommentList(comments)
    }, [comments])

    const sendNewComment = () => {
        NewCommentaryService(typeId, newComment, type)
            .then((res) => {
                res.answersPage = 1;
                createNewComment(res);
                setNewComment('');
            })
            .catch((err) => console.log(err));
    }

    const deleteComment = (id) => {
        DeleteCommentaryService(id)
            .then(() => deleteAComment(id))
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

    useEffect(() => {
        const div = divRef.current;

        const handleScroll = () => {
            const threshold = 1;
            const isBottom =
                div.scrollHeight - (div.scrollTop + div.clientHeight) <= threshold;
            if(isBottom && canScroll && !loadingScroll){
               getMore()
            }
        };
        div.addEventListener("scroll", handleScroll);
        return () => {
            div.removeEventListener("scroll", handleScroll);
        };
    }, [canScroll,loadingScroll]);

    return (
        <div className={styles.container}>
            <div className={styles.headerComment}>
                <p><QueueListIcon/>{Capitalize(title)}</p>
                <p onClick={() => router.push("/auteur/" + author)}><span>{author}</span></p>
            </div>
            <div className={styles.titleSection}>
                <h5>Commentaire(s) <span>({comments?.length})</span></h5>

                <div>
                    <p onClick={() => changeFilter('popular')}
                       className={activeFilter === 'popular' && styles.filterActive}>Populaire(s)</p>
                    <p onClick={() => changeFilter('recent')}
                       className={activeFilter === 'recent' && styles.filterActive}>Récent(s)</p>
                </div>
            </div>

            <div
                ref={divRef}
                className={styles.contentCommentaryContainer + ' ' + scroll.scrollbar}>


                    {
                                commentList.map((item, index) => {
                                    return (
                                        <Commentary
                                            id={item._id}
                                            deleteComment={() => deleteComment(item._id)}
                                            deleteAanswer={(id) => deleteAanswer(id)}
                                            likeAanswer={(id) => likeAanswer(id)}
                                            likeComment={() => likeComment(item._id)}
                                            sendNewAnswer={(data) => sendNewAnswer(data)}
                                            answerPage={item.answersPage}
                                            newAnswerPage={() => newPageAnswer(item._id)}
                                            authorId={item.userId}
                                            hasLikeData={item.hasLike}
                                            content={item.content}
                                            likes={item.likes}
                                            img={item.img}
                                            date={item.date_creation}
                                            pseudo={item.pseudo}
                                            answers={item.answers}
                                        />

                                    )
                                })
                    }

            </div>


            <div className={styles.commentaryContainer}>


                <div className={styles.formContainer}>
                    {
                        session ?
                            <textarea
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
                                placeholder={"Connexion requise..."}
                                disabled={true}
                            />
                    }
                </div>
                {
                    loadingScroll &&
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
        </div>
    )
}

export default SidebarCommentary;