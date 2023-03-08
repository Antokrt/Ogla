import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import styles from "../../styles/Pages/BookPage.module.scss";
import Header from "../../Component/Header";
import {ArrowsUpDownIcon, ChatBubbleBottomCenterTextIcon, DocumentTextIcon} from "@heroicons/react/24/outline";
import {HeartIcon} from "@heroicons/react/20/solid";
import Book from "../../Component/layouts/Icons/Book";
import Like from "../../Component/layouts/Icons/Like";
import ToogleSidebar from "../../utils/ToogleSidebar";
import SidebarCommentary from "../../Component/Post/SidebarCommentary";
import SidebarChapter from "../../Component/Post/SidebarChapter";
import FooterOnBook from "../../Component/Post/FooterOnBook";
import {useSession} from "next-auth/react";

import {LikeBookService} from "../../service/Like/LikeService";
import {VerifLikeApi} from "../api/like";
import {GetOneBookApi} from "../api/book";
import {GetCommentService, GetMyCommentsService} from "../../service/Comment/CommentService";
import {GetAnswerByCommentService} from "../../service/Answer/AnswerService";
import {
    DeleteAnswerReduce, LikeAnswerReduce, LikeCommentReduce, SendAnswerReduce
} from "../../utils/CommentaryUtils";
import {GetChapterListService} from "../../service/Chapter/ChapterService";
import {FormatDateNb, FormatDateStr} from "../../utils/Date";


export async function getServerSideProps({req, params}) {
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


const Post = ({bookData, chapterData, err, hasLikeData}) => {

    const router = useRouter();
    const [sidebarSelect, setSidebarSelect] = useState("/");
    const [nbCommentary, setNbCommentary] = useState(bookData?.nbCommentary);
    const [lastCommentId, setLastCommentId] = useState([]);
    const [hasToScroll, setHasToScroll] = useState(false);
    const [likes, setLikes] = useState(bookData?.likes);
    const [hasLike, setHasLike] = useState(hasLikeData);
    const {data: session} = useSession();
    const [comments, setComments] = useState([]);
    const [myComments, setMyComments] = useState([]);
    const [pageComment, setPageComment] = useState(1);
    const [sizeComment, setSizeComment] = useState(1);
    const [pageChapter, setPageChapter] = useState(2);
    const [pageChapterSideBar, setPageChapterSideBar] = useState(2);
    const [chapterList, setChapterList] = useState(chapterData);
    const [chapterListSidebar, setChapterListSidebar] = useState(chapterData)
    const [canSeeMoreChapter, setCanSeeMoreChapter] = useState(true);
    const [canSeeMoreChapterSidebar, setCanSeeMoreChapterSidebar] = useState(true);
    const [activeFilterList, setActiveFilterList] = useState('order');
    const [activeFilterComments, setActiveFilterComments] = useState('popular');
    const [activeFilterChapterSidebar, setActiveFilterChapterSidebar] = useState('order');

    const GetChapters = (setState, setCanSeeMore,filter) => {
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

    const refresh = () => {
        setPageComment(1);
        setComments([]);
        setMyComments([]);
    }


    const checkSide = () => {
        switch (sidebarSelect) {
            case 'Commentary':
                if (comments.length === 0) {
                    getComment(pageComment, 1);
                    if(session){
                        getMyComments(1,'popular');
                    }
                }
                return (<div
                    className={sidebarSelect !== "None" ? styles.slideInRight + " " + styles.sidebar : styles.slideOut + " " + styles.sidebar}>
                    <SidebarCommentary
                        limit={sizeComment}
                        page={pageComment}
                        getMore={() => {
                            getComment(pageComment, 1);
                        }}
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
                        activeFilter={activeFilterComments}
                        changeFilter={(e) => {
                            if (e === 'recent' && activeFilterComments === 'popular') {
                                setActiveFilterComments('recent');
                                setComments([]);
                                setPageComment(1);
                            } else if(e === 'popular' && activeFilterComments === 'recent') {
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
                        select={sidebarSelect}/>
                </div>)
                break;

            case 'None':
                return (<div className={styles.slideOut + " " + styles.sidebar}>
                </div>)
                break;

            case 'List':
                return (<div
                    className={sidebarSelect !== "None" ? styles.slideInRight + " " + styles.sidebar : styles.slideOut + " " + styles.sidebar}>
                    <SidebarChapter
                        changeFilter={() => {
                            if(activeFilterChapterSidebar === 'order'){
                                GetChapters(setChapterListSidebar,setCanSeeMoreChapterSidebar,'recent');
                                setActiveFilterChapterSidebar('recent');
                                setPageChapterSideBar(2)
                            }
                            else{
                                GetChapters(setChapterListSidebar,setCanSeeMoreChapterSidebar,'order');
                                setActiveFilterChapterSidebar('order');
                                setPageChapterSideBar(2);
                            }
                        }}
                        getMoreChapter={() => GetMoreChapters(chapterListSidebar, setChapterListSidebar, activeFilterChapterSidebar, pageChapterSideBar, setPageChapterSideBar, setCanSeeMoreChapterSidebar)}
                        title={bookData?.title}
                        filter={activeFilterChapterSidebar}
                        maxChapter={bookData?.nbChapters}
                        canSeeMore={canSeeMoreChapterSidebar} chapters={chapterListSidebar} select={sidebarSelect}/>
                </div>)
                break;

            default:
                return (<div></div>)
        }
    }

    const getMyComments = (page, filter) => {
        GetMyCommentsService('book', bookData._id, page, filter)
            .then((res) => {
                if(res.length !== 0){
                    console.log(res)
                    setComments((prevState) => [...prevState, ...res]);
                }
            })
            .catch((err) => console.log(err));
    };

    const getComment = () => {
        GetCommentService('book', bookData._id, pageComment, 1, session, activeFilterComments)
            .then((res) => {
                console.log(res)
                if (res.length !== 0) {
                    setPageComment(pageComment + 1);
                }

                res.forEach(element => {
                    if (!lastCommentId.includes(element._id)) {
                        setComments((prevState) => ([...prevState, element]))
                    }
                })
            })
            .then(() => {
                if (comments.length !== 0) {
                    setTimeout(() => setHasToScroll(!hasToScroll), 50)
                }
            })
            .catch((err) => console.log('err'))
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
    }

    const likeComment = (id) => {
        setComments(LikeCommentReduce(id, comments));
    }

    const newComment = (res) => {

        setComments((prevState) => [res,...prevState])
        setLastCommentId(prevState => [...prevState, res._id])
        setPageComment((pageComment + 1));
        setNbCommentary(nbCommentary + 1);
        if(res.userId !== session.user.id){
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

    return (<div className={styles.container}>

        <Header/>

        {err ? <p>erreur</p> : <>
            {checkSide()}

            <div className={styles.containerC}>
                <div className={styles.imgContainer}>
                    <div className={styles.img}>
                        <img src={bookData?.img}/>
                    </div>
                    {bookData._id}
                    <div className={styles.btnContainer}>
                        <div
                            className={styles.btnItem}>
                            <HeartIcon className={styles.cursor}/>
                            <p>({likes})</p>
                        </div>
                        <div className={styles.btnItem}>
                            <DocumentTextIcon/>
                            <p>({chapterData?.length})</p>

                        </div>

                        <div
                            onClick={() => getComment()}
                            className={styles.btnItem}>
                            <ChatBubbleBottomCenterTextIcon className={styles.cursor}/>
                            <p>({nbCommentary})</p>

                        </div>


                    </div>

                    <div className={styles.btnRead}>
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
                            <button onClick={() => {
                                if (activeFilterList === 'order') {
                                    setPageChapter(2);
                                    setActiveFilterList('recent');
                                    GetChapters(setChapterList,setCanSeeMoreChapter,'recent');
                                } else {
                                    setPageChapter(2);
                                    setActiveFilterList('order');
                                    GetChapters(setChapterList,setCanSeeMoreChapter,'order');
                                }
                            }}>Trier <ArrowsUpDownIcon/></button>
                            <div><p>({chapterData?.length})</p>
                                <Book/>
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
                                                name: bookData.title, slug: item.title, i: index + 1
                                            },
                                        })
                                    }}
                                    className={styles.chapter}>
                                    <div className={styles.headerChapter}>
                                        <h6>Chapitre {chapterNumber} : {item.title}</h6>
                                        <h7>{FormatDateNb(item.date_creation)}</h7>
                                    </div>

                                    <div className={styles.likeChapter}>
                                        <Like/>
                                        <p>({item.likes})</p>

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
                nbChapter={chapterData?.length}
                openList={() => {
                    ToogleSidebar("List", sidebarSelect, setSidebarSelect);
                }}
                openCommentary={() => {
                    ToogleSidebar("Commentary", sidebarSelect, setSidebarSelect);
                }}
            />
        </>

        }


    </div>)
}

export default Post;

