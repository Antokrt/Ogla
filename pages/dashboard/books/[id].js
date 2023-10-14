import styles from '../../../styles/Pages/Dashboard/OneBook.module.scss';
import anim from '../../../styles/utils/anim.module.scss';
import { Fragment, useEffect, useRef, useState } from "react";
import {
    DeleteBookService, GetMoreChapterService,
    UpdateBookPictureService, UpdateBookSummaryService,
} from "../../../service/Dashboard/BooksAuthorService";
import ErrorDashboard from "../../../Component/Dashboard/ErrorDashboard";
import VerticalAuthorMenu from "../../../Component/Menu/VerticalAuthorMenu";
import { useRouter } from "next/router";
import { getConfigOfProtectedRoute } from "../../api/utils/Config";
import { useSession } from "next-auth/react";
import { CheckCircleIcon, XCircleIcon, ShareIcon } from "@heroicons/react/20/solid";
import { CardChapter } from "../../../Component/Dashboard/Card/CardChapter";
import {
    ArrowUturnLeftIcon,
    CursorArrowRaysIcon,
    ChatBubbleBottomCenterTextIcon, PresentationChartBarIcon,
} from "@heroicons/react/24/outline";
import { Capitalize } from "../../../utils/String";
import { EyeIcon as EyeSolid } from "@heroicons/react/24/solid";
import { Loader1, LoaderCommentary, LoaderImg } from "../../../Component/layouts/Loader";
import { FilterBtn, TextSeeMore } from "../../../Component/layouts/Btn/ActionBtn";
import { ConfirmModal } from "../../../Component/Modal/ConfirmModal";
import { GetDefaultBookImgWhenError, GetImgPathOfAssets, renderPrediction } from "../../../utils/ImageUtils";
import { toastDisplayError, toastDisplayInfo } from "../../../utils/Toastify";
import ScreenSize from "../../../utils/Size";
import VerticalPhoneMenu from "../../../Component/Menu/VerticalPhoneMenu";
import useOrientation from "../../../utils/Orientation";
import VerticalTabMenu from "../../../Component/Menu/VerticalTabMenu";
import { CardChapterDashboard } from "../../../Component/Card/CardChapterPublic";
import 'tippy.js/dist/tippy.css'
import Tippy from "@tippyjs/react";
import Head from "next/head";
import { FormatCount } from "../../../utils/NbUtils";
import { GetUrl } from "../../../utils/PathUtils";
import { GetFetchPath } from "../../api/utils/Instance";
import { useSelector } from 'react-redux';
import { selectTheme } from '../../../store/slices/themeSlice';

export async function getServerSideProps({ req, params }) {
    const id = params.id;
    const config = await getConfigOfProtectedRoute(req);
    const book = await fetch(GetFetchPath() + 'author/book/' + id, config);
    const chapterList = await fetch(GetFetchPath() + 'chapter/dashboard/list/' + id + '/1/order', config);
    const chapterErrData = !chapterList.ok;
    const bookErrData = !book.ok;
    let chapterJson = await chapterList.json();
    if (chapterJson.statusCode === 404) {
        chapterJson = null;
    }
    const booksJson = await book.json();
    return {
        props: {
            err: {
                book: bookErrData,
                chapter: chapterErrData
            },
            bookData: booksJson,
            chapterListData: chapterJson

        }
    }
}

const OneBook = ({ bookData, chapterListData, err }) => {
    const [chapterList, setChapterList] = useState(chapterListData);
    const [phoneMenuLinkActive, setPhoneMenuLinkActive] = useState('infos');
    const [seeConfirmModal, setSeeConfirmModal] = useState(false);
    const [loadingChapter, setLoadingChapter] = useState(false);
    const [seeMoreChapter, setSeeMoreChapter] = useState(true);
    const [book, setBook] = useState(bookData);
    const [newSummary, setNewSummary] = useState(book.summary);
    const [loadingModify, setLoadingModify] = useState(false);
    const [activeFilter, setActiveFilter] = useState('order');
    const [loadingScroll, setLoadingScroll] = useState(false);
    const [errListChapter, setErrChapter] = useState(false);
    const [errSummary, setErrSummary] = useState(false);
    const [loadingImg, setLoadingImg] = useState(false);
    const [tippyCopy, setTippyCopy] = useState(false);
    const [chapterPage, setChapterPage] = useState(2);
    const [localImg, setLocalImg] = useState(null);
    const [loading, setLoading] = useState(true);
    const [file, setFile] = useState(true);
    const imageMimeType = /image\/(png|jpg|jpeg)/i;
    const theme = useSelector(selectTheme);
    const orientation = useOrientation();
    const [width] = ScreenSize();
    const divRef = useRef(null);
    const router = useRouter();
    const imgRef = useRef();

    const copyLink = () => {
        navigator.clipboard.writeText(GetUrl() + 'livre/' + book._id + '?' + book.slug)
            .then(() => {
                if (!tippyCopy) {
                    setTippyCopy(true);
                    setTimeout(() => {
                        setTippyCopy(false);
                    }, 1000);
                }
            })
    };

    const handleFileSelect = async (event) => {
        if (event?.target.files && event.target.files[0]) {
            setFile(event.target.files[0]);
            setLocalImg(URL.createObjectURL(event.target.files[0]));
        }
    }

    const getMoreChapter = () => {
        setLoadingScroll(true);
        GetMoreChapterService(book._id, chapterPage, activeFilter)
            .then((res) => {
                if (res.length === 0) {
                    setSeeMoreChapter(false);
                } else {
                    setChapterList(prevState => [...prevState, ...res]);
                    setChapterPage(chapterPage + 1);
                }
            })
            .then(() => {
                setLoadingScroll(false);
                setTimeout(() => {
                    if (divRef) {
                        divRef.current.scrollTop = divRef.current.scrollHeight;
                    }
                }, 10)
            })
            .catch(() => {
                setLoadingScroll(false);
                setErrChapter(true);
            });
    }

    const getChapterWithNewFilter = (filter) => {
        setLoadingChapter(true);
        GetMoreChapterService(book._id, 1, filter)
            .then((res) => {
                setSeeMoreChapter(true);
                if (res.length === 0) {
                    setSeeMoreChapter(false);
                } else {
                    setChapterList(res);
                    setChapterPage(2);
                }
            })
            .then(() => setLoadingChapter(false))
            .catch(() => {
                setLoadingChapter(false);
                setErrChapter(true);
            })
    }

    const updatePic = async () => {
        if (file) {
            setLoadingImg(true);
            const data = await renderPrediction(file, 'book');
            if (data) {
                UpdateBookPictureService(file, book._id)
                    .then((res) => {
                        setBook((prevState) => ({
                            ...prevState,
                            img: res.data.img
                        }))
                    })
                    .then(() => {
                        setLocalImg(null);
                        setFile(null);
                        setLoadingImg(false);
                    })
                    .catch((err) => {
                        setLoadingImg(false);
                        toastDisplayError("Impossible de modifier l'image.");
                    })
            } else {
                setLoadingImg(false);
                toastDisplayError('Image non conforme.')
            }


        }
    }

    useEffect(() => {
        if (router.isReady) {
            setLoading(false);
        }
    }, [router.isReady]);

    const imgClick = () => {
        imgRef.current.click();
    }

    const sumUpdate = () => {
        setLoadingModify(true);
        if (newSummary !== book.summary && newSummary.length < 2000) {
            UpdateBookSummaryService(book._id, newSummary)
                .then((res) => {
                    setBook((prevState) => ({
                        ...prevState,
                        summary: res.summary
                    }))
                    setNewSummary(res.summary);
                    setLoadingModify(false);
                })
                .catch((err) => {
                    setErrSummary(true);
                    setLoadingModify(false);
                });
        } else {
            return null;
        }
    }

    return (
        <div
            className={theme ?
                (width < 500 && phoneMenuLinkActive === 'infos'
                    ?
                    styles.container + ' ' + styles.scrollO
                    :
                    styles.container)
                :
                (width < 500 && phoneMenuLinkActive === 'infos'
                    ?
                    styles.container + ' ' + styles.scrollO + ' ' + styles.dark
                    :
                    styles.container + ' ' + styles.dark)}>

            <Head>
                <title>{'Ogla - ' + !err ? Capitalize(bookData.title) : 'Erreur'}</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            {
                width < 700 && orientation === 'portrait' ?
                    <VerticalPhoneMenu />
                    :
                    <>
                        {
                            width >= 700 && width <= 1050 ?
                                <div className={styles.verticalTabContainer}>
                                    <VerticalTabMenu />
                                </div>
                                :
                                <div className={styles.verticalMenuContainer}>
                                    <VerticalAuthorMenu />
                                </div>
                        }
                    </>

            }


            <div className={styles.containerData}>
                {/*
                {
                    !err.book &&
                    <div className={styles.containerHeader}>
                        <SmHeaderDashboard title={bookData.title}/>
                    </div>
                }*/}


                {/*ERR MSG*/}
                <>
                    {
                        !loading && err.book && !err.chapter &&
                        <ErrorDashboard
                            title={'Impossible de récupérer les données du livre (ERR-001) !'}
                            subTitle={"Réessayer ou contacter le support pour obtenir de l'aide..."}
                            img={GetImgPathOfAssets() + 'diapo/old.png'}
                        />
                    }

                    {
                        !loading && err.chapter && !err.book &&
                        <ErrorDashboard
                            title={'Impossible de récupérer les données du livre (ERR-002) !'}
                            subTitle={"Réessayer ou contacter le support pour obtenir de l'aide..."}
                            img={GetImgPathOfAssets() + 'diapo/mountain.png'}
                        />
                    }
                </>

                {
                    !loading && err.chapter && err.book &&
                    <ErrorDashboard
                        title={'Impossible de récupérer les données du livre (ERR-003) !'}
                        subTitle={"Réessayer ou contacter le support pour obtenir de l'aide..."}
                        img={GetImgPathOfAssets() + 'diapo/mountain.png'}
                    />
                }
                {
                    !loading && !err.book && !err.chapter && book.length !== 0 &&
                    <>
                        {/*      <div className={styles.menuContainer}>
                            <p onClick={() => setActive('chapter')}
                               className={active === 'chapter' ? styles.active : ''}>Chapitres</p>
                        </div>*/}

                        <div className={styles.containerOneBook}>
                            {
                                width <= 1300 &&
                                <div className={styles.containerBtnPhone}>
                                    <button className={phoneMenuLinkActive === 'infos' ? styles.activeBtnPhone : styles.inactiveBtnPhone}
                                        onClick={() => setPhoneMenuLinkActive('infos')}>Informations <CursorArrowRaysIcon />
                                    </button>
                                    <button className={phoneMenuLinkActive === 'chapters' ? styles.activeBtnPhone : styles.inactiveBtnPhone}
                                        onClick={() => setPhoneMenuLinkActive('chapters')}>Chapitres
                                    </button>
                                </div>
                            }

                            {
                                width <= 1300 && phoneMenuLinkActive === 'infos' &&
                                <div className={styles.labelContainer}>

                                    <div className={styles.containerTitle}>
                                        {/*here*/}
                                        <h2> {Capitalize(book.title)} <XCircleIcon onClick={() => {
                                            setSeeConfirmModal(true);
                                        }} /></h2>
                                        <span></span>
                                    </div>


                                    <div className={styles.imgADescription}>
                                        <div className={styles.containerImg}>
                                            {
                                                loadingImg && width > 1050 &&
                                                <div className={styles.loaderImg}>
                                                    <LoaderImg />
                                                </div>
                                            }
                                            {
                                                localImg && file ?

                                                    <>
                                                        {
                                                            width > 1050 ?
                                                                <>
                                                                    <img alt={'Nouvelle Image Ogla'} src={localImg} className={styles.darkImg} />

                                                                    <div className={styles.imgCheck}>
                                                                        <CheckCircleIcon
                                                                            onClick={() => updatePic()}
                                                                            className={styles.check} />
                                                                        <XCircleIcon
                                                                            onClick={() => {
                                                                                setLocalImg(null);
                                                                                setFile(null);
                                                                            }
                                                                            }
                                                                            className={styles.off} />
                                                                    </div>
                                                                </>
                                                                :
                                                                <div
                                                                    className={styles.containerImgPhone + ' ' + anim.fadeIn}>
                                                                    <img alt={'Nouvelle Image Ogla'} src={localImg} className={styles.darkImg} />
                                                                    <div className={styles.containerBtnImgPhone}>
                                                                        {
                                                                            !loadingImg ?
                                                                                <>
                                                                                    <button
                                                                                        onClick={() => updatePic()}>Modifier
                                                                                    </button>
                                                                                    <button onClick={() => {
                                                                                        setLocalImg(null);
                                                                                        setFile(null);
                                                                                    }
                                                                                    } className={styles.darkBtn}>Annuler
                                                                                    </button>
                                                                                </>
                                                                                :
                                                                                <LoaderImg />

                                                                        }

                                                                    </div>
                                                                </div>
                                                        }

                                                    </>
                                                    :
                                                    <>

                                                        <img
                                                            onClick={() => {
                                                                imgClick();
                                                            }}
                                                            alt={'Image livre Ogla'}
                                                            src={book.img} onError={(e) => e.target.src = GetDefaultBookImgWhenError()} />
                                                        <input
                                                            type={'file'}
                                                            ref={imgRef}
                                                            accept={"image/png , image/jpeg , image/jpg"}
                                                            id={'file'}
                                                            onChange={(e) => {
                                                                const file = e.target.files[0];
                                                                if (!file?.type.match(imageMimeType)) {
                                                                    return null;
                                                                }


                                                                handleFileSelect(e);
                                                            }}
                                                        />
                                                    </>

                                            }


                                        </div>
                                        <div className={styles.description}>
                                            <div className={styles.headerTextarea}>
                                                <h5>Résumé</h5>
                                                <div className={styles.btn}>

                                                    <Tippy visible={tippyCopy} content={'Url copiée !'}>
                                                        <div
                                                            onClick={() => {
                                                                copyLink()
                                                            }
                                                            }
                                                            className={styles.seeBtn}><ShareIcon />
                                                        </div>

                                                    </Tippy>


                                                    <Tippy trigger={'mouseenter'} content={'Voir'}>
                                                        <div
                                                            onClick={() => router.push({
                                                                pathname: '/livre/' + book._id,
                                                                query: book.slug
                                                            })}
                                                            className={styles.seeBtn}><EyeSolid />
                                                        </div>
                                                    </Tippy>


                                                    <button
                                                        onClick={() => sumUpdate()}
                                                        className={newSummary !== book.summary ? styles.activeBtnModify : styles.inactiveBtn}
                                                    >
                                                        {
                                                            !loadingModify ? <>Modifier</> : <LoaderImg />
                                                        }
                                                    </button>


                                                </div>

                                            </div>
                                            {
                                                errSummary &&
                                                <p className={styles.errMsgSummary}>Impossible de modifier le résumé</p>
                                            }

                                            {
                                                book?.summary?.length !== 0 ?
                                                    <textarea onChange={(e) => setNewSummary(e.target.value)}
                                                        value={newSummary} />

                                                    :
                                                    <textarea
                                                        placeholder={"Ajoutez un résumé pour donnez envie à vos lecteurs."}
                                                        onChange={(e) => setNewSummary(e.target.value)}
                                                    />

                                            }

                                        </div>
                                    </div>

                                    <div className={styles.presentationContainer}>


                                        <div className={styles.containerStats}>
                                            <h5>Statistiques <PresentationChartBarIcon /></h5>

                                            <div className={styles.listItem}>
                                                <div className={styles.itemStats}>

                                                    <img alt={'Like Image Ogla'}
                                                        onError={(e) => e.target.src = '/assets/stats/likes.png'}
                                                        src={GetImgPathOfAssets() + 'stats/likes.png'} />
                                                    <div>
                                                        <p className={styles.valueStats}> {FormatCount(book.likes)}</p>
                                                        <p className={styles.labelStats}>j&apos;aimes <ChatBubbleBottomCenterTextIcon />
                                                        </p>
                                                    </div>

                                                </div>
                                                <div className={styles.itemStats}>
                                                    <img alt={'Image Chart Ogla'}
                                                        onError={(e) => e.target.src = '/assets/stats/bar.png'}
                                                        src={GetImgPathOfAssets() + 'stats/bar.png'} />

                                                    <div>
                                                        <p className={styles.valueStats}>{FormatCount(book?.stats?.view)}</p>
                                                        <p className={styles.labelStats}>vues <ChatBubbleBottomCenterTextIcon />
                                                        </p>
                                                    </div>


                                                </div>

                                            </div>


                                            <div className={styles.listItem}>

                                                <div className={styles.itemStats}>
                                                    <img alt={'Image Commentaire Ogla'}
                                                        onError={(e) => e.target.src = '/assets/stats/comments.png'}
                                                        src={GetImgPathOfAssets() + 'stats/comments.png'} />

                                                    <div>
                                                        <p className={styles.valueStats}>{FormatCount(book?.stats?.nbCommentary)}</p>

                                                        <p className={styles.labelStats}>commentaires <ChatBubbleBottomCenterTextIcon />
                                                        </p>
                                                    </div>


                                                </div>

                                                <div className={styles.itemStats + ' ' + styles.statsChapters}>

                                                    <img alt={'Image livre Ogla'}
                                                        src={GetImgPathOfAssets() + 'diapo/book.png'}
                                                        onError={(e) => e.target.src = '/assets/diapo/book.png'} />
                                                    <div>
                                                        <p className={styles.valueStats}>{FormatCount(book.chapter_list.length)}</p>
                                                        <p className={styles.labelStats}>chapitres <ChatBubbleBottomCenterTextIcon />
                                                        </p>

                                                    </div>


                                                </div>


                                            </div>
                                        </div>

                                    </div>
                                </div>
                            }
                            {
                                width <= 1300 && phoneMenuLinkActive === 'chapters' &&
                                <div className={styles.selectContainer}>
                                    {
                                        <div className={styles.chapterContainer}>
                                            {
                                                !errListChapter && !loadingChapter && chapterList.length > 0 &&
                                                <div className={anim.fadeIn}>
                                                    <div className={styles.headerChapter}>
                                                        <h4>  {book.chapter_list.length} chapitre{book.chapter_list.length > 1 && <>s</>}</h4>
                                                        <div>
                                                            <FilterBtn filter={activeFilter} onclick={() => {
                                                                if (activeFilter === 'order') {
                                                                    setActiveFilter('recent');
                                                                    getChapterWithNewFilter('recent');
                                                                } else {
                                                                    getChapterWithNewFilter('order');
                                                                    setActiveFilter('order');
                                                                }
                                                            }
                                                            } />
                                                            <button
                                                                className={styles.newChapter}
                                                                onClick={() => router.push('/dashboard/nouveau-chapitre/' + book._id)}
                                                            >
                                                                Nouveau chapitre
                                                                <CursorArrowRaysIcon />
                                                            </button>


                                                        </div>

                                                    </div>

                                                </div>


                                            }

                                            {
                                                book.chapter_list.length === 0 ?
                                                    <div className={styles.emptyContainer}>
                                                        <h6>Oups !</h6>
                                                        <img alt={'Lune Ogla Image'}
                                                            src={GetImgPathOfAssets() + 'diapo/moon.png'}
                                                            onError={(e) => e.target.src = '/assets/diapo/moon.png'} />
                                                        <p>C&apos;est bien vide ici, écrivez votre prochain chapitre dès
                                                            maintenant</p>
                                                        <button
                                                            onClick={() => router.push('/dashboard/nouveau-chapitre/' + book._id)}
                                                        >Commencez à écrire <CursorArrowRaysIcon />
                                                        </button>
                                                    </div> :

                                                    errListChapter ?

                                                        <div className={styles.emptyContainer}>
                                                            <h6>Oups !</h6>
                                                            <p>Impossible de récupérer les chapitres</p>
                                                            <button
                                                                onClick={() => router.reload()}
                                                            >Rafraîchir <ArrowUturnLeftIcon />
                                                            </button>
                                                        </div>
                                                        :

                                                        loadingChapter ?
                                                            <div className={styles.loadingChapter}><Loader1 /></div>
                                                            :

                                                            <div className={styles.contentChapterList} ref={divRef}>

                                                                {
                                                                    chapterListData && bookData && !errListChapter ?
                                                                        chapterList.map((item, index) => {

                                                                            let chapterNumber;
                                                                            if (activeFilter === "recent") {
                                                                                chapterNumber = bookData.chapter_list.length - index;
                                                                            } else {
                                                                                chapterNumber = index + 1;
                                                                            }

                                                                            return (
                                                                                <Fragment key={item._id}>
                                                                                    <CardChapter
                                                                                        id={item._id}
                                                                                        date={item.date_creation}
                                                                                        title={item.title}
                                                                                        index={chapterNumber}
                                                                                        like={item.likes}
                                                                                        publish={item.publish}
                                                                                    />
                                                                                </Fragment>

                                                                            )
                                                                        }) :

                                                                        <p>C&apos;est vide ici</p>
                                                                }


                                                                <div className={styles.seeMoreContainer}>
                                                                    {
                                                                        seeMoreChapter && chapterList && !loadingScroll &&

                                                                        <TextSeeMore
                                                                            onclick={() => getMoreChapter()}
                                                                        />
                                                                    }
                                                                    {
                                                                        loadingScroll &&
                                                                        <LoaderCommentary />
                                                                    }
                                                                </div>
                                                            </div>
                                            }
                                        </div>
                                    }


                                </div>
                            }
                            {
                                width > 1300 &&
                                <>
                                    <div className={styles.labelContainer}>

                                        <div className={styles.containerTitle}>
                                            <h2> {Capitalize(book.title)} <Tippy trigger={'mouseenter'}
                                                content={'Supprimer le livre'}>
                                                <XCircleIcon onClick={() => {
                                                    setSeeConfirmModal(true);
                                                }} />
                                            </Tippy></h2>
                                            <span></span>

                                        </div>


                                        <div className={styles.imgADescription}>
                                            <div className={styles.containerImg}>
                                                {
                                                    loadingImg &&
                                                    <div className={styles.loaderImg}>
                                                        <LoaderImg />
                                                    </div>
                                                }
                                                {
                                                    localImg && file ?
                                                        <>
                                                            <img alt={'Nouvelle Image Ogla'} src={localImg}
                                                                className={styles.darkImg} />

                                                            <div className={styles.imgCheck}>
                                                                {
                                                                    !loadingImg &&
                                                                    <>
                                                                        <CheckCircleIcon
                                                                            onClick={() => updatePic()}
                                                                            className={styles.check} />
                                                                        <XCircleIcon
                                                                            onClick={() => {
                                                                                setLocalImg(null);
                                                                                setFile(null);
                                                                            }
                                                                            }
                                                                            className={styles.off} />
                                                                    </>
                                                                }

                                                            </div>
                                                        </>
                                                        :
                                                        <>
                                                            <Tippy trigger={'mouseenter'} content={'Modifier'}
                                                                placement={'bottom'}>
                                                                <img className={styles.imgOriginal}
                                                                    onClick={() => {
                                                                        imgClick();
                                                                    }}
                                                                    src={book.img}
                                                                    onError={(e) => e.target.src = GetDefaultBookImgWhenError()}
                                                                    alt={'Image livre Ogla'}
                                                                />

                                                            </Tippy>


                                                            <input
                                                                type={'file'}
                                                                ref={imgRef}
                                                                accept={"image/png , image/jpeg , image/jpg"}
                                                                id={'file'}
                                                                onChange={(e) => {
                                                                    const file = e.target.files[0];
                                                                    if (!file?.type.match(imageMimeType)) {
                                                                        return null;
                                                                    }


                                                                    handleFileSelect(e);
                                                                }}
                                                            />
                                                        </>

                                                }


                                            </div>
                                            <div className={styles.description}>
                                                <div className={styles.headerTextarea}>
                                                    <h5>Résumé</h5>
                                                    <div className={styles.btn}>
                                                        <Tippy visible={tippyCopy} content={'Url copiée !'}>
                                                            <div
                                                                onClick={() => {
                                                                    copyLink()
                                                                }
                                                                }
                                                                className={styles.seeBtn}><ShareIcon />
                                                            </div>

                                                        </Tippy>

                                                        <Tippy trigger={'mouseenter'} content={'Voir'}>
                                                            <div
                                                                onClick={() => router.push({
                                                                    pathname: '/livre/' + book._id,
                                                                    query: book.slug
                                                                })}
                                                                className={styles.seeBtn}><EyeSolid />
                                                            </div>
                                                        </Tippy>

                                                        <button
                                                            onClick={() => sumUpdate()}
                                                            className={newSummary !== book.summary ? styles.activeBtnModify : styles.inactiveBtn}
                                                        >
                                                            {
                                                                !loadingModify ? <>Modifier</> : <LoaderImg />
                                                            }
                                                        </button>

                                                    </div>

                                                </div>
                                                {
                                                    errSummary &&
                                                    <p className={styles.errMsgSummary}>Impossible de modifier le
                                                        résumé</p>
                                                }

                                                {
                                                    book?.summary?.length !== 0 ?
                                                        <textarea onChange={(e) => setNewSummary(e.target.value)}
                                                            value={newSummary} />

                                                        :
                                                        <textarea
                                                            placeholder={"Ajoutez un résumé pour donnez envie à vos lecteurs."}
                                                            onChange={(e) => setNewSummary(e.target.value)}
                                                        />

                                                }

                                            </div>
                                        </div>

                                        <div className={styles.presentationContainer}>


                                            <div className={styles.containerStats}>
                                                <h5>Statistiques <PresentationChartBarIcon /></h5>

                                                <div className={styles.listItem}>
                                                    <div className={styles.itemStats}>

                                                        <img alt={'Image Like Ogla'}
                                                            src={GetImgPathOfAssets() + 'stats/likes.png'}
                                                            onError={(e) => e.target.src = '/assets/stats/likes.png'} />
                                                        <div>
                                                            <p className={styles.valueStats}>{book?.likes}</p>
                                                            <p className={styles.labelStats}>j&apos;aimes <ChatBubbleBottomCenterTextIcon />
                                                            </p>
                                                        </div>

                                                    </div>
                                                    <div className={styles.itemStats}>
                                                        <img src={GetImgPathOfAssets() + 'stats/bar.png'}
                                                            alt={'Image Chart Ogla'}
                                                            onError={(e) => e.target.src = '/assets/stats/bar.png'} />

                                                        <div>
                                                            <p className={styles.valueStats}>{book?.stats?.view}</p>
                                                            <p className={styles.labelStats}>vues <ChatBubbleBottomCenterTextIcon />
                                                            </p>
                                                        </div>


                                                    </div>

                                                </div>


                                                <div className={styles.listItem}>

                                                    <div className={styles.itemStats}>
                                                        <img alt={'Image Commentaire Ogla'}
                                                            src={GetImgPathOfAssets() + 'stats/comments.png'}
                                                            onError={(e) => e.target.src = '/assets/stats/comments.png'} />

                                                        <div>
                                                            <p className={styles.valueStats}>{book?.stats?.nbCommentary}</p>

                                                            <p className={styles.labelStats}>commentaires <ChatBubbleBottomCenterTextIcon />
                                                            </p>
                                                        </div>


                                                    </div>

                                                    <div className={styles.itemStats}>

                                                        <img alt={'Image livre violet Ogla'}
                                                            src={GetImgPathOfAssets() + 'diapo/chapter.png'}
                                                            onError={(e) => e.target.src = '/assets/diapo/chapter.png'} />
                                                        <div>
                                                            <p className={styles.valueStats}>{book?.chapter_list?.length}</p>
                                                            <p className={styles.labelStats}>chapitres <ChatBubbleBottomCenterTextIcon />
                                                            </p>

                                                        </div>


                                                    </div>


                                                </div>
                                            </div>

                                        </div>

                                    </div>
                                    <div className={styles.selectContainer}>
                                        {
                                            <div className={styles.chapterContainer}>
                                                {
                                                    !errListChapter && !err.book && !loadingChapter && chapterList.length > 0 &&
                                                    <div className={anim.fadeIn}>
                                                        <div className={styles.headerChapter}>
                                                            <h4>{book.chapter_list.length} chapitres</h4>
                                                            <div>
                                                                <FilterBtn filter={activeFilter} onclick={() => {
                                                                    if (activeFilter === 'order') {
                                                                        setActiveFilter('recent');
                                                                        getChapterWithNewFilter('recent');
                                                                    } else {
                                                                        getChapterWithNewFilter('order');
                                                                        setActiveFilter('order');
                                                                    }
                                                                }
                                                                } />
                                                                <button
                                                                    className={styles.newChapter}
                                                                    onClick={() => router.push('/dashboard/nouveau-chapitre/' + book._id)}

                                                                >
                                                                    Nouveau chapitre
                                                                    <CursorArrowRaysIcon />
                                                                </button>


                                                            </div>

                                                        </div>

                                                    </div>


                                                }

                                                {
                                                    book.chapter_list.length === 0 ?
                                                        <div className={styles.emptyContainer}>
                                                            <img alt={'Image Lune Ogla'}
                                                                src={GetImgPathOfAssets() + 'diapo/moon.png'}
                                                                onError={(e) => e.target.src = '/assets/diapo/moon.png'} />
                                                            <p>C&apos;est bien vide ici, écrivez votre prochain chapitre
                                                                dès
                                                                maintenant</p>
                                                            <button
                                                                onClick={() => router.push('/dashboard/nouveau-chapitre/' + book._id)}
                                                            >Commencez à écrire <CursorArrowRaysIcon />
                                                            </button>
                                                        </div>
                                                        :

                                                        loadingChapter ?
                                                            <div className={styles.loadingChapter}><LoaderCommentary /></div>
                                                            :

                                                            <div className={styles.contentChapterList} ref={divRef}>

                                                                {
                                                                    chapterListData && bookData && !errListChapter ?
                                                                        chapterList.map((item, index) => {

                                                                            let chapterNumber;
                                                                            if (activeFilter === "recent") {
                                                                                chapterNumber = bookData.chapter_list.length - index;
                                                                            } else {
                                                                                chapterNumber = index + 1;
                                                                            }

                                                                            return (
                                                                                <Fragment key={item._id}>
                                                                                    <CardChapterDashboard
                                                                                        id={item._id}
                                                                                        date={item.date_creation}
                                                                                        title={item.title}
                                                                                        index={chapterNumber}
                                                                                        likes={item.likes}
                                                                                        publish={item.publish}
                                                                                    />


                                                                                </Fragment>

                                                                            )
                                                                        }) :

                                                                        <p>C&apos;est vide ici</p>
                                                                }

                                                                <div className={styles.seeMoreContainer}>
                                                                    {
                                                                        seeMoreChapter && chapterList && !loadingScroll &&
                                                                        <button className={styles.getMore} onClick={() => getMoreChapter()}>Voir plus</button>
                                                                    }
                                                                    {
                                                                        loadingScroll &&
                                                                        <LoaderCommentary />
                                                                    }
                                                                </div>

                                                                {
                                                                    book.chapter_list.length <= 2 &&
                                                                    <div className={styles.oneChapter}>
                                                                        <img alt={'Image Lune Ogla'}
                                                                            src={GetImgPathOfAssets() + 'diapo/moon.png'}
                                                                            onError={(e) => e.target.src = '/assets/diapo/moon.png'} />
                                                                    </div>
                                                                }


                                                            </div>
                                                }
                                            </div>
                                        }


                                    </div>

                                </>
                            }

                        </div>
                    </>

                }
            </div>
            {
                seeConfirmModal &&
                <ConfirmModal confirm={() => {
                    DeleteBookService(book._id)
                        .then(() => toastDisplayInfo('Livre supprimé avec succès !'))
                        .then(() => router.push('/dashboard/books'))
                        .catch((err) => console.log('err delete book'))
                }
                } img={bookData?.img} btnConfirm={'Supprimer'}
                    subTitle={'Supprimer ' + bookData.title + ' et ses chapitres.'}
                    title={'Êtes-vous sûr de vouloir continuer ? '} close={() => setSeeConfirmModal(false)} />
            }
        </div>
    )
}

export default OneBook;