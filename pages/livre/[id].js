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
    DeleteAnswerReduce, GetCommentsUtils, LikeAnswerReduce, LikeCommentReduce, SendAnswerReduce
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
import {SendNotifService} from "../../service/Notifications/NotificationsService";
import {CardChapterPublic, CardChapterPublicPhone} from "../../Component/Card/CardChapterPublic";
import ErrorDashboard from "../../Component/Dashboard/ErrorDashboard";
import CategoryCard from "../../Component/Category/CategoryCard";
import {Capitalize} from "../../utils/String";
import {LikeBtnSidebarPhone} from "../../Component/layouts/Btn/Like";
import Footer from "../../Component/Footer";
import {ErrMsg, ErrMsgOnChapter} from "../../Component/ErrMsg";
import {GetDefaultBookImgWhenError, GetDefaultUserImgWhenError, GetImgPathOfAssets} from "../../utils/ImageUtils";
import Head from "next/head";
import {HeaderMain} from "../../Component/HeaderMain";
import {HeaderMainResponsive} from "../../Component/HeaderMainResponsive";
import {
    activeLoading,
    addComment, addMyComments, cleanComments, cleanInfos,
    disableLoading, hasGetMyComments,
    incrPages,
    mountComment, removeAnErr,
    selectComments, selectErrComments,
    selectInfosComment, setReady,
    setRecent,
    throwAnErr
} from "../../store/slices/commentSlice";
import useMountComment from "../../utils/hook/MountComment";
import NewSidebarCommentary from "../../Component/Post/NewSidebarCommentary";

export async function getServerSideProps({req, params, query}) {
    const id = params.id;

    const data = await GetOneBookApi(id, req);
    if (!data.err) {
        return {
            props: {
                key: id,
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
    const {data: session} = useSession();
    const [sidebarSelect, setSidebarSelect] = useState("/");
    const [likes, setLikes] = useState(bookData?.likes);
    const [hasLike, setHasLike] = useState(hasLikeData);
    const [nbChapters, setNbChapters] = useState(bookData?.nbChapters);
    const [pageChapter, setPageChapter] = useState(2);
    const [loadingScrollChapterList, setLoadingScrollChapterList] = useState(false);
    const [chapterList, setChapterList] = useState(chapterData);
    const [canSeeMoreChapter, setCanSeeMoreChapter] = useState(true);
    const [activeFilterList, setActiveFilterList] = useState('order');
    const [activeLinkPhone, setActiveLinkPhone] = useState('description');
    const infosComment = useSelector(selectInfosComment);
    const errComments = useSelector(selectErrComments);
    const commentsReducer = useSelector(selectComments);
    const dispatch = useDispatch();

    useMountComment(bookData._id, bookData.title, authorData, 'book', bookData?.nbCommentary,bookData?._id);

    useEffect(() => {
        const openSidebar = localStorage.getItem('openSidebar');
        if (openSidebar && typeof window !== 'undefined') {
            setSidebarSelect('Commentary');
            localStorage.removeItem('openSidebar');
        }
        return () => {
            dispatch(cleanInfos());
            dispatch(cleanComments());
        }
    }, []);

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
                .catch(() => console.log('err like book'));
        } else {
            dispatch(setActiveModalState(true));
        }
    }

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

    const countNbOfChapters = useCallback(async () => {
        const nb = await CountNbOfChaptersService(bookData?._id);
        return setNbChapters(nb);
    }, []);

    useEffect(() => {
        countNbOfChapters()
            .catch(() => console.log('err callback'));
    }, [chapterList]);

    const openCommentaryOnPhone = () => {
        if (err) {
            return null;
        }

        return (<div
            className={sidebarSelect !== "None" ? styles.slideInRight + " " + styles.sidebar : styles.slideOut + " " + styles.sidebar}>
            {errComments.err ? <div className={styles.errContainer}>
                    <h4>Erreur</h4>
                    <p>Impossible de récupérer les commentaires.</p>
                </div>

                :

                <NewSidebarCommentary authorImg={authorData.img}/>}

        </div>)
    }

    const checkSide = () => {
        if (err) {
            return null;
        }
        switch (sidebarSelect) {
            case 'Commentary':
                return (<div
                    className={sidebarSelect !== "None" ? styles.slideInRight + " " + styles.sidebar : styles.slideOut + " " + styles.sidebar}>
                    <NewSidebarCommentary
                        authorImg={authorData.img}
                    />
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

    const getMyCommentsReducer = async (page, filter) => {
        try {
            const res = await GetMyCommentsService(infosComment.type, infosComment.activeId, page, filter);

            if (res.length !== 0) {
                dispatch(addMyComments(res));
            }
        } catch (error) {
            dispatch(throwAnErr());
        }
    };

    const getCommentReducer = async () => {
        try {
            if (commentsReducer.length >= infosComment.nbComments) {
                return null;
            }

            if (session && !infosComment.getMyComments) {
                await getMyCommentsReducer(1, infosComment.filter);
                await dispatch(hasGetMyComments());
            }

            dispatch(activeLoading());
            // setCanScroll(false);

            const res = await GetCommentService(infosComment.type, infosComment.activeId, infosComment.pages, 5, session, infosComment.filter);

            res.forEach(element => {
                    dispatch(addComment(element));
            });

            if (res.length !== 0) {
                dispatch(incrPages());
            }

            dispatch(disableLoading());
        } catch (error) {
            // Gérer les erreurs ici (vous pouvez ajouter une fonction de gestion d'erreur appropriée)
            dispatch(throwAnErr());
        }
    };

    const GetMoreChapters = (state, setState, filter, page, setPage, setCanSeeMore) => {
        setLoadingScrollChapterList(true);
        GetChapterListService(bookData._id, filter, page)
            .then(async (res) => {
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

    if (err) {
        return (<div className={styles.containerErr}>
            {width > 950 ? <HeaderMain/> : <div style={{width: '100%'}}>
                <HeaderMainResponsive/>
            </div>}


            <ErrMsg click={() => router.back()} text={'Impossible de récupérer ce livre, veuillez réessayer.'}/>

            <Footer/>
        </div>)
    } else {
        return (<div id={'portal'}>

            {width > 600 ? <div className={styles.container}>
                    <Head>
                        <title>{'Ogla - ' + Capitalize(bookData.title)}</title>
                        <meta name="description" content="Generated by create next app"/>
                        <meta name="viewport"
                              content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"/>
                        <link rel="icon" href="/favicon.ico"/>
                    </Head>
                    <HeaderMain/>
                    {checkSide()}

                    <div className={styles.containerC}>
                        <div className={styles.labelPresentation}>
                            <div className={styles.imgContainer}>
                                <div className={styles.img}>
                                    <img src={bookData?.img}
                                         alt={'Image Livre Ogla'}
                                         onError={(e) => e.target.src = GetDefaultBookImgWhenError()}/>
                                </div>


                                <div className={styles.btnRead}>
                                    {chapterData && chapterData?.length !== 0 && <button
                                        onClick={() => {
                                            router.push({
                                                pathname: "/chapitre/" + chapterData[0]._id, query: {
                                                    name: chapterData[0].title, slug: chapterData[0].slug, i: 1
                                                },
                                            })
                                        }}
                                    >Lire le chapitre 1 <CursorArrowRaysIcon/>
                                    </button>}
                                </div>
                            </div>


                            <div className={styles.chapterContainer}>
                                <div className={styles.infoContainer}>
                                    <div className={styles.infosBook}>
                                        <div className={styles.authorInfos}>
                                            <p onClick={() => router.push({
                                                pathname: '/auteur/' + authorData.pseudo
                                            })}>Par <span>{Capitalize(authorData.pseudo)}</span></p>
                                            <img onClick={() => router.push({
                                                pathname: '/auteur/' + authorData.pseudo
                                            })} src={authorData.img}
                                                 alt={'Image Profil Ecrivain Ogla'}
                                                 referrerPolicy={'no-referrer'}
                                                 onError={(e) => {
                                                     e.target.src = GetDefaultUserImgWhenError()
                                                 }}/>
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
                        {chapterList?.length > 0 && <div className={styles.btnFilter}>
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
                            }}/>
                            <div><p>{bookData.nbChapters} chapitres</p>
                            </div>
                        </div>}

                        <div className={styles.contentChapterList}>
                            {chapterList?.length <= 0 && <div className={styles.empty}>
                                <img alt={'Image Jim Ogla'} src={GetImgPathOfAssets() + 'utils/smile8.png'}
                                     onError={(e) => e.target.src = '/assets/jim/smile8.png'}
                                />
                                <p><span>{authorData.pseudo}</span> n&apos;a pas encore écrit de chapitres !
                                </p>
                            </div>}

                            {chapterData && chapterList?.length > 0 && chapterList.map((item, index) => {
                                let chapterNumber;
                                if (activeFilterList === "recent") {
                                    chapterNumber = nbChapters - index;
                                } else {
                                    chapterNumber = index + 1;
                                }
                                return (<div className={styles.list} key={item._id}>
                                    <CardChapterPublic id={item._id} title={item.title}
                                                       date_creation={item.date_creation} likes={item.likes}
                                                       index={chapterNumber} bookTitle={bookData.title}/>
                                </div>)
                            })}
                            {canSeeMoreChapter && chapterList.length !== 0 && bookData?.nbChapters > chapterList.length &&
                                <div className={styles.seeMoreContainer}>
                                    {!loadingScrollChapterList && <TextSeeMore
                                        onclick={() => GetMoreChapters(chapterList, setChapterList, activeFilterList, pageChapter, setPageChapter, setCanSeeMoreChapter)}/>

                                    }
                                    {loadingScrollChapterList && <LoaderCommentary/>}
                                </div>}

                        </div>

                    </div>


                    <FooterOnBook
                        likeBook={() => likeBook()}
                        title={bookData?.title}
                        like={likes}
                        img={bookData?.img}
                        nbCommentary={infosComment.nbComments}
                        author={bookData?.author_pseudo}
                        nbChapter={bookData?.nbChapters}
                        hasLike={hasLike}
                        openList={() => {
                            ToogleSidebar("List", sidebarSelect, setSidebarSelect);
                        }}
                        openCommentary={() => {
                            ToogleSidebar("Commentary", sidebarSelect, setSidebarSelect);
                            if (commentsReducer.length <= 0) getCommentReducer();
                        }}
                    />

                </div>
                /// LINE RESPONSIVE \\
                : <div className={styles.containerPhone}>


                    <div className={styles.headerBookPhone}>
                        <img
                            alt={'Fond Livre Ogla'}
                            className={styles.absoImg} src={bookData?.img}
                            onError={(e) => e.target.src = GetDefaultBookImgWhenError()}/>
                        <img
                            alt={'Image Livre Ogla'}
                            className={styles.imgBookPhone} src={bookData?.img}
                            onError={(e) => e.target.src = GetDefaultBookImgWhenError()}/>
                    </div>

                    <div className={styles.contentContainerBookPhone}>
                        <div className={styles.bookMenuVerticalPhone}>
                            <div className={styles.itemMenuBookPhone} onClick={() => router.push('/')}>
                                <HomeIcon/>
                            </div>

                            <div className={styles.itemMenuBookPhone}
                                 onClick={() => setActiveLinkPhone('chapters')}>
                                <ListBulletIcon/>
                            </div>

                            <div className={styles.like}>
                                <LikeBtnSidebarPhone onLike={() => likeBook()} isLike={hasLike}/>
                            </div>


                            <div className={styles.itemMenuBookPhone} onClick={() => {
                                setSidebarSelect('Commentary');
                                setActiveLinkPhone('comments');
                                if (commentsReducer.length <= 0) getCommentReducer();

                            }}>
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
                                    <img
                                        alt={'Image Défaut Ogla'}
                                        onError={(e) => e.target.src = '/assets/diapo/book.png'}
                                        className={styles.abso} src={GetImgPathOfAssets() + 'diapo/book.png'}/>

                                    <div className={styles.authorAndStatsPhone}>
                                        <div className={styles.authorInfosContainerPhone}
                                             onClick={() => router.push({
                                                 pathname: '/auteur/' + authorData.pseudo
                                             })}>
                                            <img
                                                alt={'Image Profil Ogla'}
                                                src={authorData?.img} referrerPolicy={'no-referrer'}
                                                onError={(e) => e.target.src = GetDefaultUserImgWhenError()}/>
                                            <p><span>{authorData?.pseudo}</span></p>
                                        </div>

                                        <div className={styles.likeBookPhone}>
                                            <p>{likes} j&apos;aimes</p>
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
                                        if (commentsReducer.length <= 0) getCommentReducer();
                                        setSidebarSelect('Commentary');
                                        setActiveLinkPhone('comments');
                                    }}
                                       className={activeLinkPhone === 'comments' ? styles.linkPhone + ' ' + styles.activeLinkPhone : styles.linkPhone}>Commentaires
                                        <span> ({infosComment.nbComments})</span></p>
                                </div>
                                <ChatBubbleLeftEllipsisIcon className={styles.svgDescription}/>
                            </div>

                            {activeLinkPhone === 'description' &&
                                <div className={styles.descriptionContainerPhone + ' ' + styles.slideInRight}>
                                    {bookData?.summary === '' ? <div className={styles.emptyContentPhone}>
                                        <img
                                            alt={'Image Jim Ogla'}
                                            onError={(e) => e.target.src = '/assets/jim/smile8.png'}
                                            src={GetImgPathOfAssets() + 'utils/smile8.png'}/>
                                        <p><span>{authorData.pseudo}</span> n&apos;a pas encore écrit de
                                            résumé !</p>
                                    </div> : <div className={styles.summaryPhone}>
                                        <p>{Capitalize(bookData?.summary)} </p>
                                    </div>}
                                </div>}
                            {activeLinkPhone === 'chapters' &&
                                <div className={styles.chaptersContainerPhone + ' ' + styles.slideInRight}>
                                    {bookData?.nbChapters > 0 && <div className={styles.filterBtnPhone}>
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
                                        }}/>
                                    </div>}

                                    {bookData?.nbChapters <= 0 ? <div className={styles.emptyContentPhone}>
                                        <img
                                            alt={'Image Jim Ogla'}
                                            onError={(e) => e.target.src = '/assets/jim/smile8.png'}
                                            src={GetImgPathOfAssets() + 'jim/smile8.png'}/>
                                        <p><span>{authorData.pseudo}</span> n&apos;a pas encore écrit de
                                            chapitres !</p>
                                    </div> : <div className={styles.chapterListPhone}>
                                        {chapterData && chapterList?.length > 0 && chapterList.map((item, index) => {
                                            let chapterNumber;
                                            if (activeFilterList === "recent") {
                                                chapterNumber = bookData?.nbChapters - index;
                                            } else {
                                                chapterNumber = index + 1;
                                            }
                                            return (<Fragment key={item._id}>
                                                <CardChapterPublicPhone id={item._id}
                                                                        title={item.title}
                                                                        date_creation={item.date_creation}
                                                                        likes={item.likes}
                                                                        index={chapterNumber}
                                                                        bookTitle={bookData.title}/>
                                            </Fragment>)
                                        })}
                                        {canSeeMoreChapter && !loadingScrollChapterList && chapterList.length !== 0 && bookData?.nbChapters > chapterList.length &&
                                            <div className={styles.seeMoreContainer}>
                                                <TextSeeMore
                                                    onclick={() => GetMoreChapters(chapterList, setChapterList, activeFilterList, pageChapter, setPageChapter, setCanSeeMoreChapter)}/>
                                                {loadingScrollChapterList && <LoaderCommentary/>}
                                            </div>}
                                    </div>}
                                </div>}

                            {activeLinkPhone === 'comments' && openCommentaryOnPhone()}

                        </div>
                    </div>


                </div>}


        </div>)
    }
}
export default Post;

