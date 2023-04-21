import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import Header from "../../Component/Header";
import styles from "../../styles/Pages/ChapterPage.module.scss";
import { HeartIcon, } from "@heroicons/react/20/solid";
import { TagIcon } from "@heroicons/react/24/solid";
import { BookOpenIcon } from "@heroicons/react/24/solid";
import FooterOnChapter from "../../Component/Post/FooterOnChapter";
import SidebarPost from "../../Component/Post/SidebarCommentary";
import SidebarCommentary from "../../Component/Post/SidebarCommentary";
import SidebarChapter from "../../Component/Post/SidebarChapter";
import FooterOnBook from "../../Component/Post/FooterOnBook";
import ToogleSidebar from "../../utils/ToogleSidebar";
import HeaderOnChapter from "../../Component/Post/HeaderOnChapter";
import { EditorContent, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { getConfigOfProtectedRoute } from "../api/utils/Config";
import { GetOneChapterApi } from "../api/chapter";
import { VerifLike, VerifLikeApi } from "../api/like";
import { useSession } from "next-auth/react";
import { LikeBookService, LikeChapterService } from "../../service/Like/LikeService";
import { GetCommentService, GetMyCommentsService } from "../../service/Comment/CommentService";
import { GetAnswerByCommentService } from "../../service/Answer/AnswerService";
import { DeleteAnswerReduce, LikeAnswerReduce, LikeCommentReduce, SendAnswerReduce } from "../../utils/CommentaryUtils";
import { GetChapterListService } from "../../service/Chapter/ChapterService";
import { Capitalize } from "../../utils/String";
import { setActiveModalState } from "../../store/slices/modalSlice";
import { useDispatch } from "react-redux";
import { AddViewToChapterApi } from "../api/book";
import ErrMsg from "../../Component/ErrMsg";
import { sendNotif } from "../../service/Notifications/NotificationsService";

export async function getServerSideProps({ req, params, query, ctx }) {
    const id = params.id;
    const data = await GetOneChapterApi(id);
    let hasLike;
    if (data.chapter) {
        await AddViewToChapterApi(id);
        hasLike = await VerifLikeApi(req, 'chapter', data.chapter._id);
        return {
            props: {
                key: id,
                err: data.err,
                chapterData: data.chapter,
                bookData: data.book,
                chapterList: data.chapterList,
                index: parseInt(query.i),
                authorData: data.author,
                hasLikeData: hasLike
            }
        }
    }
    else {
        return {
            props: {
                key: id,
                err: data.err,
                chapterData: null,
                bookData: null,
                chapterList: null,
                index: null,
                authorData: null,
                hasLikeData: null
            }
        }
    }


}

const Chapter = ({ chapterData, bookData, chapterList, authorData, err, index, hasLikeData, bookId }) => {

    const router = useRouter();
    const headerFixed = useRef();
    const [hasToBeFixed, setHasToBeFixed] = useState(false);
    const [hasToScroll, setHasToScroll] = useState(false);

    const [likes, setLikes] = useState(chapterData?.likes);
    const [hasLike, setHasLike] = useState(hasLikeData);

    const [nbCommentary, setNbCommentary] = useState(chapterData?.nbCommentary);
    const [lastCommentId, setLastCommentId] = useState([]);
    const [canScroll, setCanScroll] = useState(true);
    const [loadingScroll, setLoadingScroll] = useState(false);
    const [contentChapter, setContentChapter] = useState(chapterData && JSON.parse(chapterData?.content));
    const [sidebarSelect, setSidebarSelect] = useState("Disable");

    const [activeFilterComments, setActiveFilterComments] = useState('popular');
    const [comments, setComments] = useState([]);
    const [pageComment, setPageComment] = useState(1);
    const [size, setSize] = useState(1);

    const [loadingScrollChapterSidebar, setLoadingScrollChapterSidebar] = useState(false);
    const [canScrollChapterSidebar, setCanScrollChapterSidebar] = useState(false);
    const [pageChapterSideBar, setPageChapterSideBar] = useState(2);
    const [activeFilterChapterSidebar, setActiveFilterChapterSidebar] = useState('order');
    const [canSeeMoreChapterSidebar, setCanSeeMoreChapterSidebar] = useState(true);
    const [chapterListSidebar, setChapterListSidebar] = useState(chapterList);

    const { data: session } = useSession();
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

    const likeChapter = () => {
        if (session) {
            LikeChapterService(chapterData._id)
                .then((res) => setHasLike(!hasLike))
                .then(() => {
                    if (hasLike) {
                        setLikes(likes - 1);
                    } else {
                        setLikes(likes + 1);
                        sendNotif(authorData._id, 2, chapterData._id);
                    }
                })
                .catch((err) => console.log('err'));
        }
        else {
            dispatch(setActiveModalState(true));
        }
    }

    const refresh = () => {
        setPageComment(1);
        setComments([]);
    }

    const editorReadOnly = useEditor({
        extensions: [
            StarterKit,
        ],
        content: chapterData ? JSON.parse(chapterData?.content) : null
    })

    const checkSide = () => {
        switch (sidebarSelect) {
            case 'Commentary':
                if (comments.length === 0 && canScroll) {
                    getComment(pageComment, 1);
                    if (session) {
                        getMyComments(1, 'popular');
                    }
                }
                return (
                    <div
                        className={sidebarSelect !== "None" ? styles.slideInRight + " " + styles.sidebar : styles.slideOut + " " + styles.sidebar}>
                        <SidebarCommentary
                            limit={size}
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
                            type={'chapter'}
                            typeId={chapterData._id}
                            title={chapterData.title}
                            author={chapterData.author_pseudo}
                            authorImg={authorData?.img}
                            comments={comments}
                            select={sidebarSelect} />
                    </div>
                )
                break;

            case 'None':
                return (
                    <div className={styles.slideOut + " " + styles.sidebar}>
                    </div>
                )
                break;

            case 'List':
                return (
                    <div
                        className={sidebarSelect !== "None" ? styles.slideInRight + " " + styles.sidebar : styles.slideOut + " " + styles.sidebar}>
                        <SidebarChapter
                            changeFilter={() => {
                                if (activeFilterChapterSidebar === 'order') {
                                    GetChapters(setChapterListSidebar, setCanSeeMoreChapterSidebar, 'recent');
                                    setActiveFilterChapterSidebar('recent');
                                    setPageChapterSideBar(2);
                                } else {
                                    GetChapters(setChapterListSidebar, setCanSeeMoreChapterSidebar, 'order');
                                    setActiveFilterChapterSidebar('order');
                                    setPageChapterSideBar(2);
                                }
                            }}
                            loadingScroll={loadingScrollChapterSidebar}
                            canScroll={canScrollChapterSidebar}
                            getMoreChapter={() => GetMoreChaptersSidebar(chapterListSidebar, setChapterListSidebar, activeFilterChapterSidebar, pageChapterSideBar, setPageChapterSideBar, setCanSeeMoreChapterSidebar)}
                            bookTitle={bookData?.title}
                            title={chapterData?.title}
                            nbChapters={bookData?.nbChapters}
                            bookId={bookData?._id}
                            bookSlug={bookData?.slug}
                            author={authorData?.pseudo}
                            filter={activeFilterChapterSidebar}
                            maxChapter={bookData?.nbChapters}
                            canSeeMore={canSeeMoreChapterSidebar} chapters={chapterListSidebar} select={sidebarSelect} />
                    </div>
                )
                break;

            default:
                return (
                    <div></div>
                )
        }
    }

    const GetMoreChaptersSidebar = (state, setState, filter, page, setPage, setCanSeeMore) => {
        setLoadingScrollChapterSidebar(true);
        setCanSeeMore(false);
        GetChapterListService(bookData._id, filter, page)
            .then((res) => {
                if (res.length !== 0) {
                    setState(prevState => [...prevState, ...res]);
                    setPage(page + 1);
                } else {
                    setCanSeeMoreChapterSidebar(false);
                }
            })
            .then(() => {
                setLoadingScrollChapterSidebar(false)
            });
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

    const getMyComments = (page, filter) => {
        GetMyCommentsService('chapter', chapterData._id, page, filter)
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
        GetCommentService('chapter', chapterData._id, pageComment, 5, session, activeFilterComments)
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

    const likeComment = (id) => {
        setComments(LikeCommentReduce(id, comments, authorData._id, session.user.id));
    }

    const newComment = (res) => {
        setComments((prevState) => [
            ...prevState,
            res
        ])

        setLastCommentId(prevState => [
            ...prevState,
            res._id
        ])

        setPageComment((pageComment + 1));
        setNbCommentary(nbCommentary + 1);

        setTimeout(() => setHasToScroll(!hasToScroll), 10)
        sendNotif(authorData._id, 11, chapterData._id)
    }

    const deleteComment = (id) => {
        setComments((list) => list.filter((item) => item._id !== id))
        setNbCommentary(nbCommentary - 1);
    }

    const sendAnswer = (data) => {
        setComments(SendAnswerReduce(comments, data.target_id, data));
        comments.forEach((elem) =>  {
            if (elem._id === data.target_id) {
                if (authorData._id != session.user.id)
                    sendNotif(elem.userId, 20, data._id)
                else
                    sendNotif(elem.userId, 21, data._id)
                return;
            }
        })
    };

    const deleteAnswer = (id) => {
        setComments(DeleteAnswerReduce(comments, id));
    };

    const likeAnswer = (replyId) => {
        setComments(LikeAnswerReduce(comments, replyId, authorData._id, session.user.id));
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
        <div className={styles.container}>

            {
                chapterData &&
                checkSide()
            }
            <div>
                <Header />
                <HeaderOnChapter />
            </div>

            {
                chapterData && !err ?
                    <>

                        <div
                            className={styles.containerC}>
                            <div
                                className={hasToBeFixed ? styles.fixedActive + " " + styles.bannerChapter : styles.fixedInitial + " " + styles.bannerChapter}
                                ref={headerFixed}
                            >
                                <h3>Chapitre {index} - {Capitalize(chapterData.title)}</h3>
                                <div className={styles.thumbnailContainer}>
                                    <p className={styles.category}><span>{bookData.category}</span></p>
                                    <p className={styles.mSide}>{likes} like(s)</p>
                                    <p>{bookData.chapter_list.length} chapitre(s) <BookOpenIcon /></p>
                                </div>
                            </div>

                            <div
                                className={styles.contentChapter}>
                                <div className={styles.headerContent}>
                                    <h5>{bookData.title}</h5>
                                    <h6 onClick={() => router.push('/auteur/' + authorData.pseudo)}><img src={authorData.img}
                                        referrerPolicy={'no-referrer'} />{authorData.pseudo}
                                    </h6>
                                </div>
                                <div className={styles.nextChapterContainer}>

                                </div>

                                <div className={styles.textContainer}>
                                    {
                                        chapterData &&
                                        <EditorContent editor={editorReadOnly}>

                                        </EditorContent>
                                    }
                                </div>
                                {
                                    chapterData.navChapter.next &&
                                    <button className={styles.readMore} onClick={() => {
                                        router.push({
                                            pathname: "/chapitre/" + chapterData.navChapter.next._id, query: {
                                                name: chapterData.navChapter.next.title,
                                                slug: chapterData.navChapter.next.slug,
                                                i: index + 1
                                            },
                                        })
                                    }}>Suivant ({chapterData.navChapter.next.title})</button>
                                }
                            </div>

                        </div>
                        <FooterOnChapter
                            likeChapter={() => likeChapter()}
                            hasLike={hasLike}
                            title={chapterData?.title}
                            likes={likes}
                            refresh={() => refreshChapter()}
                            index={index}
                            navChapters={chapterData.navChapter}
                            author={bookData?.author_pseudo}
                            nbChapter={bookData?.nbChapters}
                            nbCommentary={nbCommentary}
                            openList={() => {
                                ToogleSidebar("List", sidebarSelect, setSidebarSelect);
                            }}
                            openCommentary={() => {
                                ToogleSidebar("Commentary", sidebarSelect, setSidebarSelect);
                            }}
                            img={bookData?.img} />

                    </>
                    :
                    <ErrMsg click={() => router.back()} textBtn={'Retour'} linkBtn={'/livre/'} text={'Impossible de récupérer le chapitre, veuillez réessayer.'} />
            }




        </div>
    )
}

export default Chapter;