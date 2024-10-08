import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from "../../styles/Pages/ChapterPage.module.scss";
import anim from '../../styles/utils/anim.module.scss';
import { BookOpenIcon } from "@heroicons/react/24/outline";
import FooterOnChapter from "../../Component/Post/FooterOnChapter";
import SidebarChapter from "../../Component/Post/SidebarChapter";
import ToogleSidebar from "../../utils/ToogleSidebar";
import { EditorContent, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { GetOneChapterApi } from "../api/chapter";
import { VerifLikeApi } from "../api/like";
import { useSession } from "next-auth/react";
import { LikeChapterService } from "../../service/Like/LikeService";
import { GetCommentService, GetMyCommentsService } from "../../service/Comment/CommentService";
import { CountNbOfChaptersService, GetChapterListService } from "../../service/Chapter/ChapterService";
import { Capitalize } from "../../utils/String";
import { setActiveModalState } from "../../store/slices/modalSlice";
import { useDispatch, useSelector } from "react-redux";
import { AddViewToChapterApi } from "../api/book";
import { ErrMsg } from "../../Component/ErrMsg";
import { SendNotifService } from "../../service/Notifications/NotificationsService";
import ScreenSize from "../../utils/Size";
import {
    ChatBubbleBottomCenterTextIcon, ChevronLeftIcon, ChevronRightIcon, HomeIcon,
} from "@heroicons/react/24/outline";
import { LikeBtnSidebarPhone } from "../../Component/layouts/Btn/Like";
import { HeadPhoneBtn } from "../../Component/layouts/Btn/ActionBtn";
import useOrientation from "../../utils/Orientation";
import Footer from "../../Component/Footer";
import { GetDefaultBookImgWhenError, GetDefaultUserImgWhenError } from "../../utils/ImageUtils";
import Head from "next/head";
import { HeaderMain } from "../../Component/HeaderMain";
import { HeaderMainResponsive } from "../../Component/HeaderMainResponsive";
import useMountComment from "../../utils/hook/MountComment";
import {
    activeLoading, addComment,
    addMyComments, cleanComments, cleanInfos, disableLoading,
    hasGetMyComments, incrPages, selectComments, selectErrComments,
    selectInfosComment,
    throwAnErr
} from "../../store/slices/commentSlice";
import NewSidebarCommentary from "../../Component/Post/NewSidebarCommentary";
import { selectTheme } from "../../store/slices/themeSlice";

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

    const [loadingScrollChapterSidebar, setLoadingScrollChapterSidebar] = useState(false);
    const [activeFilterChapterSidebar, setActiveFilterChapterSidebar] = useState('order');
    const [canSeeMoreChapterSidebar, setCanSeeMoreChapterSidebar] = useState(true);
    const [canScrollChapterSidebar, setCanScrollChapterSidebar] = useState(false);
    const [chapterListSidebar, setChapterListSidebar] = useState(chapterList);
    const [nbChapters, setNbChapters] = useState(bookData?.nbChapters);
    const [activeLinkPhone, setActiveLinkPhone] = useState('content');
    const [pageChapterSideBar, setPageChapterSideBar] = useState(2);
    const [sidebarSelect, setSidebarSelect] = useState("Disable");
    const [likes, setLikes] = useState(chapterData?.likes);
    const [errChapters, setErrChapters] = useState(false);
    const infosComment = useSelector(selectInfosComment);
    const [hasLike, setHasLike] = useState(hasLikeData);
    const commentsReducer = useSelector(selectComments);
    const errComments = useSelector(selectErrComments);
    const theme = useSelector(selectTheme);
    const { data: session } = useSession();
    const [width, height] = ScreenSize();
    const orientation = useOrientation();
    const dispatch = useDispatch();
    const router = useRouter();

    useMountComment(chapterData._id, chapterData.title, authorData, 'chapter', chapterData.nbCommentary, bookData._id);

    useEffect(() => {
        const openSidebar = localStorage.getItem('openSidebar');
        if (openSidebar && typeof window !== 'undefined') {
            if (commentsReducer.length <= 0) getCommentReducer();
            setSidebarSelect('Commentary');
            localStorage.removeItem('openSidebar');
        }

        return () => {
            dispatch(cleanInfos());
            dispatch(cleanComments());
        }
    }, [])

    const countNbOfChapters = useCallback(async () => {
        const nb = await CountNbOfChaptersService(bookData?._id);
        return setNbChapters(nb);
    }, []);

    useEffect(() => {
        countNbOfChapters()
            .catch(() => console.log('err callback'))
    }, [chapterList, activeFilterChapterSidebar]);

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
            .catch(() => setErrChapters(true));
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
                        SendNotifService(authorData._id, 2, chapterData._id, bookData._id);
                    }
                })
                .catch((err) => console.log('err'));
        }
        else {
            dispatch(setActiveModalState(true));
        }
    }

    const editorReadOnly = useEditor({
        extensions: [
            StarterKit,
        ],
        editable: false,
        content: chapterData ? JSON.parse(chapterData?.content) : null
    })

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
                            errChapters={errChapters}
                            loadingScroll={loadingScrollChapterSidebar}
                            canScroll={canScrollChapterSidebar}
                            getMoreChapter={async () => GetMoreChaptersSidebar(chapterListSidebar, setChapterListSidebar, activeFilterChapterSidebar, pageChapterSideBar, setPageChapterSideBar, setCanSeeMoreChapterSidebar)}
                            bookTitle={bookData?.title}
                            title={chapterData?.title}
                            nbChapters={nbChapters}
                            bookId={bookData?._id}
                            bookSlug={bookData?.slug}
                            author={authorData?.pseudo}
                            filter={activeFilterChapterSidebar}
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

    const openCommentaryPhone = () => {
        if (err) {
            return null;
        }

        return (
            <div
                className={sidebarSelect !== "None" ? styles.slideInRight + " " + styles.sidebar : styles.slideOut + " " + styles.sidebar}>

                {
                    errComments.err ?
                        <div className={styles.errContainer}>
                            <h4>Erreur</h4>
                            <p>Impossible de récupérer les commentaires.</p>
                        </div>
                        :
                        <NewSidebarCommentary authorImg={authorData.img} />
                }


            </div>
        )
    }

    const GetMoreChaptersSidebar = (state, setState, filter, page, setPage, setCanSeeMore) => {
        setLoadingScrollChapterSidebar(true);
        setCanSeeMore(false);
        GetChapterListService(bookData._id, filter, page)
            .then((res) => {
                if (res.length !== 0) {
                    setState(prevState => [...prevState, ...res]);
                    setPage(page + 1);
                    setCanSeeMoreChapterSidebar(true);
                } else {
                    setCanSeeMoreChapterSidebar(false);
                }
            })
            .then(() => {
                setLoadingScrollChapterSidebar(false)
            });
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

    const navBlockPrev = () => {

        if (chapterData.navChapter && chapterData.navChapter.prev) {
            return (
                <div className={styles.navBlock} onClick={() => {
                    router.push({
                        pathname: "/chapitre/" + chapterData.navChapter.prev._id, query: {
                            name: chapterData.navChapter.prev.title, slug: chapterData.navChapter.prev.slug, i: index - 1,
                        }
                    })
                }}>
                    <ChevronLeftIcon />
                    <p>{chapterData.navChapter.prev.title} ({index - 1})</p>
                </div>
            )
        }
        else {
            return null
        }

    }

    const navBlockNext = () => {
        if (chapterData.navChapter && chapterData.navChapter.next) {
            return (
                <div className={styles.navBlock} onClick={() => {
                    router.push({
                        pathname: "/chapitre/" + chapterData.navChapter.next._id, query: {
                            name: chapterData.navChapter.next.title, slug: chapterData.navChapter.next.slug, i: index + 1,
                        }
                    })
                }}>
                    <p>{chapterData.navChapter.next.title} ({index + 1})</p>
                    <ChevronRightIcon />

                </div>
            )
        }

    }

    const disableCopy = (e) => {
        if (session && session.user.id === bookData?.author_id) {
            return null;
        }
        if (typeof window !== 'undefined') {
            navigator.clipboard.writeText('');
        }
    }

    return (
        <div className={theme ? styles.container : styles.container + ' ' + styles.dark}>

            <Head>
                <title>{'Ogla - ' + (!err ? Capitalize(chapterData?.title) : 'Erreur')}</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            {
                chapterData && width > 900 &&
                checkSide()
            }

            {
                chapterData && !err ?
                    <>

                        {
                            width > 950 ?
                                <HeaderMain /> :
                                <div style={{ width: '100%' }}>
                                    <HeaderMainResponsive />
                                </div>
                        }
                        {
                            width > 600 ?
                                <>

                                    <div
                                        className={styles.containerC}>

                                        <div
                                            className={styles.fixedInitial + " " + styles.bannerChapter}
                                        >

                                            <div className={styles.title}>
                                                <p>Chapitre {index}</p>
                                                <h3>{Capitalize(chapterData?.title)}</h3>
                                            </div>
                                        </div>

                                        <div
                                            className={styles.contentChapter}>
                                            <div className={styles.headerContent}>
                                                <h5 onClick={() => router.push({
                                                    pathname: '/livre/' + bookData?._id,
                                                    query: bookData?.slug
                                                })}>{bookData?.title}</h5>
                                                <h6 onClick={() => router.push('/auteur/' + authorData.pseudo)}>
                                                    <img alt={'Image Ecrivain Ogla'} src={authorData.img} onError={(e) => e.target.src = GetDefaultUserImgWhenError()}
                                                        referrerPolicy={'no-referrer'} />{Capitalize(authorData.pseudo)}
                                                </h6>
                                            </div>
                                            <div className={styles.nextChapterContainer}></div>

                                            <div className={styles.textContainer}>
                                                {
                                                    chapterData &&
                                                    <div onCopy={(e) => disableCopy(e)} >
                                                        <EditorContent editor={editorReadOnly}></EditorContent>
                                                    </div>

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
                                                }}>Suivant (<span>{Capitalize(chapterData.navChapter.next.title)}</span>)</button>
                                            }
                                        </div>

                                    </div>
                                    {
                                        width > 600 && orientation === 'landscape' &&
                                        <FooterOnChapter
                                            likeChapter={() => likeChapter()}
                                            hasLike={hasLike}
                                            title={chapterData?.title}
                                            likes={likes}
                                            index={index}
                                            navChapters={chapterData.navChapter}
                                            author={bookData?.author_pseudo}
                                            nbChapter={bookData?.nbChapters}
                                            nbCommentary={infosComment.nbComments}
                                            openList={() => {
                                                ToogleSidebar("List", sidebarSelect, setSidebarSelect);
                                            }}
                                            openCommentary={() => {
                                                ToogleSidebar("Commentary", sidebarSelect, setSidebarSelect);
                                                if (commentsReducer.length <= 0) getCommentReducer();
                                            }}
                                            img={bookData?.img} />
                                    }

                                </>
                                // LINE RESPONSIVE \\
                                :
                                <div className={styles.containerPhone}>
                                    <div className={styles.bookMenuVerticalPhone}>
                                        <div className={styles.fMenuPhone}>
                                            <div className={styles.labelChapterPhone}>
                                                <p>Chapitre {index}</p>
                                                <h4 onClick={() => router.push({
                                                    pathname: '/livre/' + bookData?._id,
                                                    query: bookData?.slug
                                                })}>{bookData?.title}</h4>
                                            </div>

                                            <img onError={(e) => GetDefaultBookImgWhenError()} src={bookData?.img} alt={'Image du livre'} />

                                        </div>
                                        <div className={styles.sMenuPhone}>
                                            <div className={styles.itemMenuBookPhone} onClick={() => router.push('/')}>
                                                <HomeIcon />
                                            </div>

                                            <div className={styles.itemMenuBookPhone} onClick={() => setActiveLinkPhone('content')}>
                                                <BookOpenIcon />
                                            </div>
                                            <div className={styles.like}>
                                                <LikeBtnSidebarPhone onLike={likeChapter} isLike={hasLike} />
                                            </div>

                                            <div className={styles.itemMenuBookPhone} onClick={() => {
                                                setSidebarSelect('Commentary');
                                                setActiveLinkPhone('comments');
                                                if (commentsReducer.length <= 0) getCommentReducer();
                                            }
                                            }>
                                                <ChatBubbleBottomCenterTextIcon />
                                            </div>

                                            <div className={styles.itemMenuBookPhone} >
                                                <HeadPhoneBtn />
                                            </div>
                                        </div>

                                    </div>

                                    {navBlockPrev()}

                                    <div className={styles.titlePhone}>
                                        <p>Chapitre {index}</p>
                                        <h2>{chapterData?.title}</h2>
                                    </div>

                                    {
                                        activeLinkPhone === 'content' &&
                                        <div className={styles.contentChapterPhone + ' ' + anim.slideInRight}>
                                            <div className={styles.editorPhone}>
                                                {
                                                    chapterData &&
                                                    <EditorContent editor={editorReadOnly}>

                                                    </EditorContent>
                                                }
                                            </div>

                                        </div>
                                    }

                                    {
                                        activeLinkPhone === 'comments' &&
                                        <div className={styles.containerCommentary}>
                                            {openCommentaryPhone()}
                                        </div>
                                    }

                                    {activeLinkPhone === 'content' && navBlockNext()}
                                </div>

                        }

                    </>
                    :
                    <>
                        {
                            width > 950 ?
                                <HeaderMain /> :
                                <div style={{ width: '100%' }}>
                                    <HeaderMainResponsive />
                                </div>
                        }
                        <ErrMsg click={() => router.back()} text={'Impossible de récupérer le chapitre, veuillez réessayer.'} />
                        <Footer />
                    </>
            }

        </div>
    )
}

export default Chapter;