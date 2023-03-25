import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from "../../styles/Pages/BookPage.module.scss";
import Header from "../../Component/Header";
import { ArrowsUpDownIcon, BookOpenIcon, ChatBubbleBottomCenterTextIcon, DocumentTextIcon } from "@heroicons/react/24/outline";
import { HeartIcon } from "@heroicons/react/20/solid";
import Book from "../../Component/layouts/Icons/Book";
import Like from "../../Component/layouts/Icons/Like";
import ToogleSidebar from "../../utils/ToogleSidebar";
import SidebarCommentary from "../../Component/Post/SidebarCommentary";
import SidebarChapter from "../../Component/Post/SidebarChapter";
import FooterOnBook from "../../Component/Post/FooterOnBook";
import { useSession } from "next-auth/react";

import { LikeBookService } from "../../service/Like/LikeService";
import { VerifLikeApi } from "../api/like";
import { GetOneBookApi } from "../api/book";
import { GetCommentService, GetMyCommentsService } from "../../service/Comment/CommentService";
import { GetAnswerByCommentService } from "../../service/Answer/AnswerService";
import {
    DeleteAnswerReduce, LikeAnswerReduce, LikeCommentReduce, SendAnswerReduce
} from "../../utils/CommentaryUtils";
import { GetChapterListService } from "../../service/Chapter/ChapterService";
import { FormatDateNb, FormatDateStr } from "../../utils/Date";
import { FilterBtn } from "../../Component/layouts/Btn/ActionBtn";
import { LoginModal } from "../../Component/Modal/LoginModal";
import { useDispatch, useSelector } from "react-redux";
import { selectLoginModalStatus, setActiveModalState } from "../../store/slices/modalSlice";
import ScreenSize from "../../utils/Size";


export async function getServerSideProps({ req, params }) {
    const id = params.id;
    const data = await GetOneBookApi(id);
    if (!data.err) {
        const hasLikeJson = await VerifLikeApi(req, 'book', data.book._id);
        return {
            props: {
                err: false, bookData: data?.book, chapterData: data?.chapter, hasLikeData: hasLikeJson
            }
        }
    } else {
        return {
            props: {
                err: true
            }
        }
    }
}

const Post = ({ bookData, chapterData, err, hasLikeData }) => {

    const [width, height] = ScreenSize();
    const router = useRouter();
    const [loginModal, setLoginModal] = useState(true);
    const { data: session } = useSession();
    const [sidebarSelect, setSidebarSelect] = useState("/");
    const [nbCommentary, setNbCommentary] = useState(bookData?.nbCommentary);
    const [lastCommentId, setLastCommentId] = useState([]);
    const [hasToScroll, setHasToScroll] = useState(false);
    const [likes, setLikes] = useState(bookData?.likes);
    const [hasLike, setHasLike] = useState(hasLikeData);
    const [comments, setComments] = useState([]);
    const [myComments, setMyComments] = useState([]);
    const [pageComment, setPageComment] = useState(1);
    const [sizeComment, setSizeComment] = useState(1);
    const [activeFilterComments, setActiveFilterComments] = useState('popular');
    const [pageChapter, setPageChapter] = useState(2);
    const [canScroll, setCanScroll] = useState(true);
    const [loadingScroll, setLoadingScroll] = useState(false);
    const [loadingScrollChapterSidebar, setLoadingScrollChapterSidebar] = useState(false);
    const [canScrollChapterSidebar, setCanScrollChapterSidebar] = useState(false);
    const [pageChapterSideBar, setPageChapterSideBar] = useState(2);
    const [chapterList, setChapterList] = useState(chapterData);
    const [chapterListSidebar, setChapterListSidebar] = useState(chapterData)
    const [canSeeMoreChapter, setCanSeeMoreChapter] = useState(true);
    const [canSeeMoreChapterSidebar, setCanSeeMoreChapterSidebar] = useState(true);
    const [activeFilterList, setActiveFilterList] = useState('order');
    const [activeFilterChapterSidebar, setActiveFilterChapterSidebar] = useState('order');
    const modalState = useSelector(selectLoginModalStatus);
    const dispatch = useDispatch();

    const GetChapters = (setState, setCanSeeMore, filter) => {
        GetChapterListService(bookData._id, filter, 1)
            .then((res) => {
                if (res.length !== 0) {
                    setState(res);
                    setCanSeeMore(true);
                } else {
                    setCanSeeMore(false);
                }
            })
    }

    const refresh = () => {
        setPageComment(1);
        setComments([]);
        setMyComments([]);
    }

    const checkSide = () => {
        switch (sidebarSelect) {
            case 'Commentary':
                if (comments.length === 0 && canScroll) {
                    getComment(pageComment, 1);
                    if (session) {
                        getMyComments(1, 'popular');
                    }
                }
                return (<div
                    className={sidebarSelect !== "None" ? styles.slideInRight + " " + styles.sidebar : styles.slideOut + " " + styles.sidebar}>
                    <SidebarCommentary
                        limit={sizeComment}
                        page={pageComment}
                        getMore={() => {
                            getComment();
                        }}
                        nbCommentary={nbCommentary}
                        refresh={() => refresh()}
                        scrollChange={hasToScroll}
                        likeAComment={(id) => likeComment(id)}
                        createNewComment={(res) => newComment(res)}
                        deleteAComment={(id) => deleteComment(id)}
                        seeMore={() => getComment(pageComment)}
                        sendANewAnswer={(data) => sendAnswer(data)}
                        deleteAnswer={(id) => deleteAnswer(id)}
                        likeAnswer={(id) => likeAnswer(id)}
                        newPageAnswer={(id) => loadMoreAnswer(id)}
                        type={'book'}
                        canScroll={canScroll}
                        loadingScroll={loadingScroll}
                        activeFilter={activeFilterComments}
                        changeFilter={(e) => {
                            if (e === 'recent' && activeFilterComments === 'popular') {
                                setCanScroll(true);
                                setActiveFilterComments('recent');
                                setComments([]);
                                setPageComment(1);

                            } else if (e === 'popular' && activeFilterComments === 'recent') {
                                setCanScroll(true);
                                setActiveFilterComments('popular');
                                setComments([]);
                                setPageComment(1);
                            }
                        }}
                        typeId={bookData._id}
                        bookId={bookData._id}
                        title={bookData.title}
                        author={bookData.author_pseudo}
                        comments={comments}
                        select={sidebarSelect} />
                </div>)
                break;

            case 'None':
                return (<div className={styles.slideOut + " " + styles.sidebar}>
                </div>)
                break;

            default:
                return (<div></div>)
        }
    }

    const getMyComments = (page, filter) => {
        GetMyCommentsService('book', bookData._id, page, filter)
            .then((res) => {
                if (res.length !== 0) {
                    setComments((prevState) => [...prevState, ...res]);
                }
            })
            .catch((err) => console.log(err));
    };

    const getComment = () => {
        setLoadingScroll(true);
        setCanScroll(false);
        GetCommentService('book', bookData._id, pageComment, 5, session, activeFilterComments)
            .then((res) => {
                res.forEach(element => {
                    if (!lastCommentId.includes(element._id)) {
                        setComments((prevState) => ([...prevState, element]))
                    }
                })
                if (res.length !== 0) {
                    setPageComment(pageComment + 1);
                    setCanScroll(true);
                } else {
                    setCanScroll(false);
                }
            })
            .then(() => {
                setLoadingScroll(false);
                /*       if (comments.length !== 0) {
                           setTimeout(() => setHasToScroll(!hasToScroll), 50);
                       }*/
            })
            .catch((err) => console.log('err'))
    }

    const GetMoreChapters = (state, setState, filter, page, setPage, setCanSeeMore) => {
        GetChapterListService(bookData._id, filter, page)
            .then((res) => {
                if (res.length !== 0) {
                    setState(prevState => [...prevState, ...res]);
                    setPage(page + 1);
                } else {
                    setCanSeeMore(false);
                }
            })
    }

    const likeBook = () => {
        if (session) {
            LikeBookService(bookData._id)
                .then((res) => setHasLike(!hasLike))
                .then(() => {
                    if (hasLike) {
                        setLikes(likes - 1);
                    } else {
                        setLikes(likes + 1);
                    }
                })
                .catch((err) => console.log(err));
        }
        else {
            dispatch(setActiveModalState(true));
        }
    }

    const likeComment = (id) => {
        setComments(LikeCommentReduce(id, comments));
    }

    const newComment = (res) => {

        setComments((prevState) => [res, ...prevState])
        setLastCommentId(prevState => [...prevState, res._id])
        setPageComment((pageComment + 1));
        setNbCommentary(nbCommentary + 1);
        if (res.userId !== session.user.id) {
            setTimeout(() => setHasToScroll(!hasToScroll), 10);
        }
    }

    const deleteComment = (id) => {
        setComments((list) => list.filter((item) => item._id !== id))
        setNbCommentary(nbCommentary - 1)
    }

    const sendAnswer = (data) => {
        setComments(SendAnswerReduce(comments, data.target_id, data));
    };

    const deleteAnswer = (id) => {
        setComments(DeleteAnswerReduce(comments, id))
    };

    const likeAnswer = (replyId) => {
        setComments(LikeAnswerReduce(comments, replyId));
    }

    const loadMoreAnswer = (id) => {
        const newState = [...comments];
        const target = newState.find(obj => obj._id === id);
        if (target) {
            GetAnswerByCommentService(id, target.answersPage, 1, session)
                .then((res) => {
                    if (res.data.length > 0) {
                        target.answersPage += 1;
                        target.answers = [...target.answers, ...res.data];
                    }
                })
                .then(() => setComments(newState))
        }
    }

    return (
        <div>
            {
                width > 800 &&
                <div className={styles.container}>
                    <Header />
                    {
                        err ? <p>erreur</p> : <>
                            {checkSide()}

                            <div className={styles.containerC}>
                                <div className={styles.imgContainer}>
                                    <div className={styles.img}>
                                        <img src={bookData?.img} />
                                    </div>
                                    {bookData._id}
                                    <div className={styles.btnContainer}>
                                        <div className={styles.btnItem}>
                                            <DocumentTextIcon />
                                            <p>{bookData.nbChapters} chapitre(s)</p>
                                        </div>
                                        <div
                                            className={styles.btnItem}>
                                            <HeartIcon />
                                            <p>{likes} likes</p>
                                        </div>


                                        <div
                                            className={styles.btnItem}>
                                            <ChatBubbleBottomCenterTextIcon />
                                            <p>{nbCommentary} commentaire(s)</p>

                                        </div>


                                    </div>

                                    <div className={styles.btnRead}>
                                        {
                                            chapterData &&
                                            <button
                                                onClick={() => {
                                                    router.push({
                                                        pathname: "/chapitre/" + chapterData[0]._id, query: {
                                                            name: chapterData[0].title, slug: chapterData[0].slug, i: 1
                                                        },
                                                    })
                                                }}
                                            >Lire le chapitre 1
                                            </button>
                                        }

                                    </div>
                                </div>


                                <div className={styles.chapterContainer}>
                                    <div className={styles.infoContainer}>
                                        <h4> {bookData?.category} | Par : <span onClick={() => {
                                            router.push("/auteur/" + bookData?.author_pseudo)
                                        }}>{bookData?.author_pseudo}</span></h4>
                                        <h3>{bookData?.title}</h3>
                                        <p className={styles.snippet}> {bookData?.summary}</p>
                                        <div className={styles.btnFilter}>
                                            <FilterBtn filter={activeFilterList} onclick={() => {
                                                if (activeFilterList === 'order') {
                                                    setPageChapter(2);
                                                    setActiveFilterList('recent');
                                                    GetChapters(setChapterList, setCanSeeMoreChapter, 'recent');
                                                } else {
                                                    setPageChapter(2);
                                                    setActiveFilterList('order');
                                                    GetChapters(setChapterList, setCanSeeMoreChapter, 'order');
                                                }
                                            }
                                            } />
                                            <div><p>{bookData.nbChapters} chapitre(s)</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={styles.contentChapterList}>
                                        {chapterData && chapterList.map((item, index) => {
                                            let chapterNumber;
                                            if (activeFilterList === "recent") {
                                                chapterNumber = bookData?.nbChapters - index;
                                            } else {
                                                chapterNumber = index + 1;
                                            }
                                            return (<div
                                                onClick={() => {
                                                    router.push({
                                                        pathname: "/chapitre/" + item._id, query: {
                                                            name: bookData.title, slug: item.title, i: chapterNumber
                                                        },
                                                    })
                                                }}
                                                className={styles.chapter}>
                                                <div className={styles.headerChapter}>
                                                    <h6>Chapitre {chapterNumber} : {item.title}</h6>
                                                    <h7>{FormatDateNb(item.date_creation)}</h7>
                                                </div>

                                                <div className={styles.likeChapter}>
                                                    <p>{item.likes} like(s)</p>

                                                </div>
                                            </div>

                                            )
                                        })}
                                        {canSeeMoreChapter && <p className={styles.seeMore}
                                            onClick={() => GetMoreChapters(chapterList, setChapterList, activeFilterList, pageChapter, setPageChapter, setCanSeeMoreChapter)}>Voir
                                            plus</p>}

                                    </div>
                                </div>

                            </div>
                            <FooterOnBook
                                likeBook={() => likeBook()}
                                title={bookData?.title}
                                like={likes}
                                img={bookData?.img}
                                nbCommentary={nbCommentary}
                                author={bookData?.author_pseudo}
                                nbChapter={bookData?.nbChapters}
                                hasLike={hasLike}
                                openList={() => {
                                    ToogleSidebar("List", sidebarSelect, setSidebarSelect);
                                }}
                                openCommentary={() => {
                                    ToogleSidebar("Commentary", sidebarSelect, setSidebarSelect);
                                }}
                            />
                        </>
                    }
                </div>
            }
            {
                width <= 800 &&
                <div className={styles.PhoneStyleBook} >
                    <div className={styles.PhoneBookImgTitle}>
                        <img src={bookData?.img} alt="BookIMG" />
                        <div className={styles.PhoneBookInfosAuthor}>
                            <h2> {bookData?.title} </h2>
                            <p> By {bookData?.author_pseudo} </p>
                        </div>
                    </div>

                    <div className={styles.PhoneBookDescription}>
                        <h2> Description </h2>
                        <div className={styles.PhoneBookDescriptionStyle} >
                            <h1 style={{}} > {bookData?.summary[0]} </h1>
                            <p> {bookData?.summary.substr(1)} </p>
                        </div>
                        <div className={styles.PhoneBookReadButtonPosition} onClick={() => {
                            router.push({
                                pathname: "/chapitre/" + chapterData[0]._id, query: {
                                    name: chapterData[0].title, slug: chapterData[0].slug, i: 1
                                },
                            })
                        }}>
                            <div className={styles.PhoneBookReadButton} >
                                <BookOpenIcon />
                                <div className={styles.PhoneBookRead} >
                                    <h3> Lire </h3>
                                    <p> {bookData.nbChapters} Chapitre(s) </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

export default Post;

