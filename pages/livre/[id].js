import {useRouter} from "next/router";
import React, {Fragment, useCallback, useEffect, useRef, useState} from "react";
import styles from "../../styles/Pages/BookPage.module.scss";
import anim from '../../styles/utils/anim.module.scss';

import Header from "../../Component/Header";
import {
    ArrowsUpDownIcon,
    BanknotesIcon,
    BookOpenIcon,
    ChatBubbleBottomCenterTextIcon,
    ChatBubbleLeftEllipsisIcon,
    ChatBubbleLeftIcon,
    ChatBubbleOvalLeftIcon,
    CursorArrowRaysIcon,
    DocumentTextIcon,
    HeartIcon as HeartOutline,
    HomeIcon,
    ListBulletIcon
} from "@heroicons/react/24/outline";
import {HeartIcon} from "@heroicons/react/20/solid";
import Book from "../../Component/layouts/Icons/Book";
import Like from "../../Component/layouts/Icons/Like";
import ToogleSidebar from "../../utils/ToogleSidebar";
import SidebarCommentary from "../../Component/Post/SidebarCommentary";
import SidebarChapter from "../../Component/Post/SidebarChapter";
import FooterOnBook from "../../Component/Post/FooterOnBook";
import {useSession} from "next-auth/react";
import ScreenSize from "../../utils/Size"
import {LikeBookService} from "../../service/Like/LikeService";
import {VerifLikeApi} from "../api/like";
import {AddViewToBookApi, GetOneBookApi} from "../api/book";
import {GetCommentService, GetMyCommentsService} from "../../service/Comment/CommentService";
import {GetAnswerByCommentService} from "../../service/Answer/AnswerService";
import {
    DeleteAnswerReduce, LikeAnswerReduce, LikeCommentReduce, SendAnswerReduce
} from "../../utils/CommentaryUtils";
import {CountNbOfChaptersService, GetChapterListService} from "../../service/Chapter/ChapterService";
import {FormatDateNb, FormatDateStr} from "../../utils/Date";
import {FilterBtn, HeadPhoneBtn, TextSeeMore} from "../../Component/layouts/Btn/ActionBtn";
import {LoginModal} from "../../Component/Modal/LoginModal";
import {useDispatch, useSelector} from "react-redux";
import {selectLoginModalStatus, setActiveModalState} from "../../store/slices/modalSlice";
import CardCategory from "../../Component/Card/CardCategory";
import {LoaderCommentary} from "../../Component/layouts/Loader";
import {Snippet} from "../../Component/Snippet";
import { SendNotifService} from "../../service/Notifications/NotificationsService";
import {CardChapterPublic, CardChapterPublicPhone} from "../../Component/Card/CardChapterPublic";
import ErrorDashboard from "../../Component/Dashboard/ErrorDashboard";
import CategoryCard from "../../Component/Category/CategoryCard";
import {Capitalize} from "../../utils/String";
import {LikeBtnSidebarPhone} from "../../Component/layouts/Btn/Like";
import Footer from "../../Component/Footer";
import {ErrMsg, ErrMsgOnChapter} from "../../Component/ErrMsg";
import {GetDefaultBookImgWhenError, GetDefaultUserImgWhenError} from "../../utils/ImageUtils";
import Head from "next/head";
import {HeaderMain} from "../../Component/HeaderMain";

export async function getServerSideProps({req, params, query}) {
    const id = params.id;

    const data = await GetOneBookApi(id, req);
    if (!data.err) {
        return {
            props: {
                err: false,
                bookData: data?.book,
                chapterData: data?.chapter,
                hasLikeData: data?.hasLike,
                authorData: data?.author
            }
        }
    } else {
        return {
            props: {
                err: true,
            }
        }
    }
}

const Post = ({bookData, chapterData, err, hasLikeData, authorData}) => {

    const [width, height] = ScreenSize();
    const router = useRouter();
    const [loginModal, setLoginModal] = useState(true);
    const {data: session} = useSession();
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
    const [nbChapters,setNbChapters] = useState(bookData?.nbChapters);
    const [noComments, setNoComments] = useState(false);
    const [activeFilterComments, setActiveFilterComments] = useState('popular');
    const [pageChapter, setPageChapter] = useState(2);
    const [canScroll, setCanScroll] = useState(true);
    const [loadingScroll, setLoadingScroll] = useState(false);
    const [loadingScrollChapterList, setLoadingScrollChapterList] = useState(false);
    const [chapterList, setChapterList] = useState(chapterData);
    const [canSeeMoreChapter, setCanSeeMoreChapter] = useState(true);
    const [activeFilterList, setActiveFilterList] = useState('order');
    const [snippetTooBig, setSnippetTooBig] = useState(bookData?.summary?.length > 500);
    const [activeLinkPhone, setActiveLinkPhone] = useState('description');
    const dispatch = useDispatch();

    useEffect(() => {
        const openSidebar = localStorage.getItem('openSidebar');
        if (openSidebar && typeof window !== 'undefined') {
            setSidebarSelect('Commentary');
            localStorage.removeItem('openSidebar');
        }
    }, [])

    useEffect(() => {console.log(session)},[])

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


    const countNbOfChapters = useCallback(async () => {
        const nb = await CountNbOfChaptersService(bookData?._id);
        return setNbChapters(nb);
    },[]);

    useEffect(() => {console.log(session?.user?.accessToken)},[]);


    useEffect(() => {
        countNbOfChapters()
            .catch(() => console.log('err callback'))

    },[chapterList]);



    const openCommentaryOnPhone = () => {
        if (err) {
            return null;
        }

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
                authorImg={authorData?.img}
                likeAnswer={(id) => likeAnswer(id)}
                newPageAnswer={(id) => loadMoreAnswer(id)}
                type={'book'}
                canScroll={canScroll}
                loadingScroll={loadingScroll}
                isEmpty={noComments}
                activeFilter={activeFilterComments}
                changeFilter={(e) => {
                    setNoComments(false);
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
                select={sidebarSelect}/>
        </div>)
    }

    const checkSide = () => {
        if (err) {
            return null;
        }
        switch (sidebarSelect) {
            case 'Commentary':
                if (comments.length === 0 && canScroll) {
                    setNoComments(false);
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
                        isEmpty={noComments}
                        createNewComment={(res) => newComment(res)}
                        deleteAComment={(id) => deleteComment(id)}
                        seeMore={() => {
                            if(!loadingScroll){
                                getComment(pageComment);
                            }
                        }}
                        sendANewAnswer={(data) => sendAnswer(data)}
                        deleteAnswer={(id) => deleteAnswer(id)}
                        authorImg={authorData?.img}
                        likeAnswer={(id) => likeAnswer(id)}
                        newPageAnswer={(id) => loadMoreAnswer(id)}
                        type={'book'}
                        canScroll={canScroll}
                        loadingScroll={loadingScroll}
                        activeFilter={activeFilterComments}
                        changeFilter={(e) => {
                            setNoComments(false);
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
                        select={sidebarSelect}/>
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
                    setNoComments(false);
                }
                else {
                    setNoComments(true);
                }
            })
            .catch((err) => console.log(err));
    };

    const getComment = () => {
        setLoadingScroll(true);
        setCanScroll(false);
        setNoComments(false);
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

    const GetMoreChapters =  (state, setState, filter, page, setPage, setCanSeeMore) => {
        setLoadingScrollChapterList(true);
        GetChapterListService(bookData._id, filter, page)
            .then( async (res) => {
                if (res.length !== 0) {
                    setState(prevState => [...prevState, ...res]);
                    setPage(page + 1);
                } else {
                    setCanSeeMore(false);
                }
            })
            .then(() => setLoadingScrollChapterList(false))
            .catch(() => setLoadingScrollChapterList(false));
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
                        SendNotifService(authorData._id, 1, bookData._id, "null")
                    }
                })
                .catch((err) => console.log(err));
        } else {
            dispatch(setActiveModalState(true));
        }
    }

    const likeComment = (id) => {
        setComments(LikeCommentReduce(id, comments, authorData._id, session.user.id, bookData._id, "null"));
    }

    const newComment = (res) => {

        setComments((prevState) => [res, ...prevState])
        setLastCommentId(prevState => [...prevState, res._id])
        setPageComment((pageComment + 1));
        setNbCommentary(nbCommentary + 1);
        if (res.userId !== session.user.id) {
            setTimeout(() => setHasToScroll(!hasToScroll), 10);
        }
        setNoComments(false);
        SendNotifService(authorData._id, 10, bookData._id, "null");
    }

    const deleteComment = (id) => {
        setComments((list) => list.filter((item) => item._id !== id))
        setNbCommentary(nbCommentary - 1);
        if (comments.length === 1) {
            setNoComments(true);
        }
    }

    const sendAnswer = (data) => {
        setComments(SendAnswerReduce(comments, data.target_id, data));
        comments.forEach((elem) => {
            if (elem._id === data.target_id) {
                if (authorData._id != session.user.id)
                    SendNotifService(elem.userId, 20, bookData._id, "null")
                else
                    SendNotifService(elem.userId, 21, bookData._id, "null")
                return;
            }
        })
    };

    const deleteAnswer = (id) => {
        setComments(DeleteAnswerReduce(comments, id))
    };

    const likeAnswer = (replyId) => {
        setComments(LikeAnswerReduce(comments, replyId, authorData._id, session.user.id, bookData._id, "null"));
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
                    } else {
                        target.seeMoreAnswers = false;
                    }
                })
                .then(() => setComments(newState))
        }
    }


    if (err) {
        return (
            <div className={styles.containerErr}>
                <Header/>
                <ErrMsgOnChapter click={() => router.back()} textBtn={'Retour'} text={'Impossible de récupérer ce livre, veuillez réessayer.'} />

                <Footer/>
            </div>
        )
    } else {
        return (
            <div>
                {
                    width > 600 ?
                        <div className={styles.container}>
                            <Head>
                                <title>{'Ogla - ' + Capitalize(bookData.title)}</title>
                                <meta name="description" content="Generated by create next app" />
                                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"/>
                                <link rel="icon" href="/favicon.ico" />
                            </Head>
                            <HeaderMain/>
                            {checkSide()}

                            <div className={styles.containerC}>

                                <div className={styles.labelPresentation}>
                                    <div className={styles.imgContainer}>
                                        <div className={styles.img}>
                                            <img src={bookData?.img} onError={(e) =>e.target.src = GetDefaultBookImgWhenError()}/>
                                        </div>




                                        <div className={styles.btnRead}>
                                            {
                                                chapterData && chapterData?.length !== 0 &&
                                                <button
                                                    onClick={() => {
                                                        router.push({
                                                            pathname: "/chapitre/" + chapterData[0]._id, query: {
                                                                name: chapterData[0].title, slug: chapterData[0].slug, i: 1
                                                            },
                                                        })
                                                    }}
                                                >Lire le chapitre 1 <CursorArrowRaysIcon/>
                                                </button>
                                            }

                                        </div>
                                    </div>


                                    <div className={styles.chapterContainer}>
                                        <div className={styles.infoContainer}>
                                            <div className={styles.infosBook}>
                                                <div className={styles.authorInfos}  >
                                                    <p onClick={() => router.push({
                                                        pathname: '/auteur/' + authorData.pseudo
                                                    })}>Par <span>{Capitalize(authorData.pseudo)}</span></p>
                                                    <img onClick={() => router.push({
                                                        pathname: '/auteur/' + authorData.pseudo
                                                    })} src={authorData.img} referrerPolicy={'no-referrer'} onError={(e) => {
                                                        e.target.src = GetDefaultUserImgWhenError()
                                                    }
                                                    }/>
                                                </div>

                                                <CardCategory category={bookData?.category}/>

                                            </div>
                                            <h3>{bookData?.title}</h3>

                                            <Snippet line={3} maxSize={500} content={bookData?.summary}/>

                                        </div>

                                    </div>
                                </div>



                            </div>

                            <div className={styles.containerChapterList}>
                                {
                                    chapterList?.length > 0 &&
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
                                        }/>
                                        <div><p>{bookData.nbChapters} chapitre(s)</p>
                                        </div>
                                    </div>
                                }

                                <div className={styles.contentChapterList}>
                                    {
                                        chapterList?.length <= 0 &&
                                        <div className={styles.empty}>
                                            <img src={'/assets/jim/smile8.png'}/>
                                            <p><span>{authorData.pseudo}</span> n'a pas encore écrit de chapitres !</p>
                                        </div>
                                    }

                                    {chapterData && chapterList?.length > 0 && chapterList.map((item, index) => {
                                        let chapterNumber;
                                        if (activeFilterList === "recent") {
                                            chapterNumber = nbChapters - index;
                                        } else {
                                            chapterNumber = index + 1;
                                        }
                                        return (
                                            <div className={styles.list} key={item._id}>
                                                <CardChapterPublic id={item._id} title={item.title}
                                                                   date_creation={item.date_creation} likes={item.likes}
                                                                   index={chapterNumber} bookTitle={bookData.title}/>
                                            </div>
                                        )
                                    })}
                                    {
                                        canSeeMoreChapter  && chapterList.length !== 0 && bookData?.nbChapters > chapterList.length &&
                                        <div className={styles.seeMoreContainer}>
                                            {
                                                !loadingScrollChapterList &&
                                                <TextSeeMore
                                                    onclick={() => GetMoreChapters(chapterList, setChapterList, activeFilterList, pageChapter, setPageChapter, setCanSeeMoreChapter)}/>

                                            }
                                                {
                                                loadingScrollChapterList &&
                                                <LoaderCommentary/>
                                            }
                                        </div>
                                    }

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

                        </div>
                        /// LINE RESPONSIVE \\
                        :
                        <div className={styles.containerPhone}>


                            <div className={styles.headerBookPhone}>
                                <img className={styles.absoImg} src={bookData?.img} onError={(e) => e.target.src = GetDefaultBookImgWhenError()}/>
                                <img className={styles.imgBookPhone} src={bookData?.img} onError={(e) => e.target.src = GetDefaultBookImgWhenError()}/>
                            </div>

                            <div className={styles.contentContainerBookPhone}>
                                <div className={styles.bookMenuVerticalPhone}>
                                    <div className={styles.itemMenuBookPhone} onClick={() => router.push('/')}>
                                        <HomeIcon/>
                                    </div>

                                    <div className={styles.itemMenuBookPhone} onClick={() => setActiveLinkPhone('chapters')}>
                                        <ListBulletIcon/>
                                    </div>

                                    <div className={styles.like}>
                                        <LikeBtnSidebarPhone onLike={() => likeBook()} isLike={hasLike}/>
                                    </div>




                                    <div className={styles.itemMenuBookPhone} onClick={() => {
                                        setSidebarSelect('Commentary');
                                        setActiveLinkPhone('comments');
                                    }
                                    }>
                                        <ChatBubbleBottomCenterTextIcon/>
                                    </div>

                                    <div className={styles.itemMenuBookPhone}>
                                        <HeadPhoneBtn/>
                                    </div>
                                </div>

                                <div className={styles.overlay}>
                                    <div className={styles.titleBookPhone}>
                                        <div className={styles.t}>
                                            <h3>{bookData?.title}</h3>
                                            <img className={styles.abso} src={'/assets/diapo/book.png'}/>

                                            <div className={styles.authorAndStatsPhone}>
                                                <div className={styles.authorInfosContainerPhone} onClick={() => router.push({
                                                    pathname: '/auteur/' + authorData.pseudo
                                                })}>
                                                    <img src={authorData?.img} referrerPolicy={'no-referrer'} onError={(e) => e.target.src = GetDefaultUserImgWhenError()}/>
                                                    <p><span>{authorData?.pseudo}</span></p>
                                                </div>

                                                <div className={styles.likeBookPhone}>
                                                    <p>{likes} j'aimes</p>
                                                </div>
                                            </div>


                                        </div>

                                    </div>

                                    <div className={styles.menuBookPhone}>
                                        <div className={styles.link}>
                                            <p onClick={() => setActiveLinkPhone('description')}
                                               className={activeLinkPhone === 'description' ? styles.linkPhone + ' ' + styles.activeLinkPhone : styles.linkPhone}>Résumé</p>
                                            <p onClick={() => setActiveLinkPhone('chapters')}
                                               className={activeLinkPhone === 'chapters' ? styles.linkPhone + ' ' + styles.activeLinkPhone : styles.linkPhone}>Chapitre{bookData?.nbChapters !== 1 && <>s</>}
                                                <span> ({bookData?.nbChapters})</span></p>
                                            <p onClick={() => {
                                                setSidebarSelect('Commentary');
                                                setActiveLinkPhone('comments');
                                            }}
                                               className={activeLinkPhone === 'comments' ? styles.linkPhone + ' ' + styles.activeLinkPhone : styles.linkPhone}>Commentaire{nbCommentary !== 1 && <>s</>}
                                                <span> ({nbCommentary})</span></p>
                                        </div>
                                        <ChatBubbleLeftEllipsisIcon className={styles.svgDescription}/>
                                    </div>

                                    {
                                        activeLinkPhone === 'description' &&
                                        <div className={styles.descriptionContainerPhone + ' '+ styles.slideInRight}>
                                            {
                                                bookData?.summary === '' ?
                                                    <div className={styles.emptyContentPhone}>
                                                        <img src={'/assets/jim/smile8.png'}/>
                                                        <p><span>{authorData.pseudo}</span> n'a pas encore écrit de
                                                            résumé !</p>
                                                    </div>
                                                    :
                                                    <div className={styles.summaryPhone}>
                                                        <p>{bookData?.summary} </p>
                                                    </div>
                                            }
                                        </div>
                                    }
                                    {
                                        activeLinkPhone === 'chapters' &&
                                        <div className={styles.chaptersContainerPhone + ' ' + styles.slideInRight}>
                                            {
                                                bookData?.nbChapters > 0 &&
                                                <div className={styles.filterBtnPhone}>
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
                                                    }/>
                                                </div>
                                            }

                                            {
                                                bookData?.nbChapters <= 0 ?
                                                    <div className={styles.emptyContentPhone}>
                                                        <img src={'/assets/jim/smile8.png'}/>
                                                        <p><span>{authorData.pseudo}</span> n'a pas encore écrit de
                                                            chapitres !</p>
                                                    </div>
                                                    :
                                                    <div className={styles.chapterListPhone}>
                                                        {chapterData && chapterList?.length > 0 && chapterList.map((item, index) => {
                                                            let chapterNumber;
                                                            if (activeFilterList === "recent") {
                                                                chapterNumber = bookData?.nbChapters - index;
                                                            } else {
                                                                chapterNumber = index + 1;
                                                            }
                                                            return (
                                                                <Fragment key={item._id}>
                                                                    <CardChapterPublicPhone id={item._id}
                                                                                            title={item.title}
                                                                                            date_creation={item.date_creation}
                                                                                            likes={item.likes}
                                                                                            index={chapterNumber}
                                                                                            bookTitle={bookData.title}/>
                                                                </Fragment>
                                                            )
                                                        })}
                                                        {
                                                            canSeeMoreChapter && !loadingScrollChapterList && chapterList.length !== 0 && bookData?.nbChapters > chapterList.length &&
                                                            <div className={styles.seeMoreContainer}>
                                                                <TextSeeMore
                                                                    onclick={() => GetMoreChapters(chapterList, setChapterList, activeFilterList, pageChapter, setPageChapter, setCanSeeMoreChapter)}/>
                                                                {
                                                                    loadingScrollChapterList &&
                                                                    <LoaderCommentary/>
                                                                }
                                                            </div>
                                                        }
                                                    </div>
                                            }
                                        </div>
                                    }

                                    {
                                        activeLinkPhone === 'comments' &&
                                        openCommentaryOnPhone()
                                    }

                                </div>
                            </div>



                        </div>
                }


            </div>
        )
    }
}
export default Post;

