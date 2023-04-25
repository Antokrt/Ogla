import styles from '../../../styles/Pages/Dashboard/OneBook.module.scss';
import {useEffect, useRef, useState} from "react";
import {
    DeleteBookService, GetMoreChapterService,
    UpdateBookPictureService, UpdateBookSummaryService,
} from "../../../service/Dashboard/BooksAuthorService";
import ErrorDashboard from "../../../Component/Dashboard/ErrorDashboard";
import VerticalAuthorMenu from "../../../Component/Menu/VerticalAuthorMenu";
import HeaderDashboard from "../../../Component/Dashboard/HeaderDashboard";
import {useRouter} from "next/router";
import {getConfigOfProtectedRoute} from "../../api/utils/Config";
import {
    Bars3CenterLeftIcon,
    InformationCircleIcon,
    PlusIcon,
    UserCircleIcon, XMarkIcon
} from "@heroicons/react/24/solid";
import {useSession} from "next-auth/react";
import {BookOpenIcon} from "@heroicons/react/24/solid";
import {ArrowTrendingUpIcon, CheckCircleIcon, TagIcon, XCircleIcon} from "@heroicons/react/20/solid";
import CommentaryDashboard from "../../../Component/Dashboard/CommentaryDashboard";
import chapter from "../../../Component/layouts/Icons/Chapter";
import {CardChapter} from "../../../Component/Dashboard/Card/CardChapter";
import {FormatDateNb, FormatDateStr} from "../../../utils/Date";
import {
    ArrowUturnLeftIcon,
    Bars3BottomRightIcon,
    BookmarkIcon,
    BookmarkSquareIcon,
    HeartIcon,
    CursorArrowRaysIcon,
    ClockIcon, ChevronDoubleUpIcon, ChartBarIcon, ChatBubbleBottomCenterTextIcon, PresentationChartBarIcon,
} from "@heroicons/react/24/outline";
import {Capitalize} from "../../../utils/String";
import {EyeIcon as EyeSolid} from "@heroicons/react/24/solid";
import {EyeIcon as EyeOutline} from "@heroicons/react/24/outline";
import {Loader1, Loader2, LoaderCommentary, LoaderImg} from "../../../Component/layouts/Loader";
import SmHeaderDashboard from "../../../Component/Dashboard/SmHeaderDashboard";
import {FilterBtn, SeeMoreBtn, TextSeeMore} from "../../../Component/layouts/Btn/ActionBtn";
import {ConfirmModal} from "../../../Component/Modal/ConfirmModal";

import {renderPrediction} from "../../../utils/ImageUtils";
import {toastDisplayError} from "../../../utils/Toastify";
import CardCategory from "../../../Component/Card/CardCategory";
import ScreenSize from "../../../utils/Size";
import VerticalPhoneMenu from "../../../Component/Menu/VerticalPhoneMenu";
import useOrientation from "../../../utils/Orientation";
import {CardStats, CardStatsDashboard} from "../../../Component/Dashboard/Card/CardStats";
import VerticalTabMenu from "../../../Component/Menu/VerticalTabMenu";



export async function getServerSideProps({req, params}) {
    const id = params.id;
    const config = await getConfigOfProtectedRoute(req);
    const book = await fetch('http://localhost:3008/author/book/' + id, config);
    const chapterList = await fetch('http://localhost:3008/chapter/dashboard/list/' + id + '/1/order', config);
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
                book: bookErrData
            },
            bookData: booksJson,
            chapterListData: chapterJson

        }
    }
}

const OneBook = ({bookData, chapterListData, err}) => {
    const [loading, setLoading] = useState(true);
    const {data: session} = useSession();
    const [active, setActive] = useState('chapter');
    const [book, setBook] = useState(bookData);
    const [chapterList, setChapterList] = useState(chapterListData);
    const [chapterPage, setChapterPage] = useState(2);
    const [activeFilter, setActiveFilter] = useState('order');
    const lastChapter = bookData.lastChapter;
    const [seeMoreChapter, setSeeMoreChapter] = useState(true);
    const [errSummary, setErrSummary] = useState(false);
    const [loadingImg,setLoadingImg] = useState(false);
    const [newSummary, setNewSummary] = useState(book.summary);
    const imgRef = useRef();
    const divRef = useRef(null);
    const [file, setFile] = useState(true);
    const [localImg, setLocalImg] = useState(null);
    const imageMimeType = /image\/(png|jpg|jpeg)/i;
    const router = useRouter();
    const [loadingScroll, setLoadingScroll] = useState(false);
    const [loadingChapter, setLoadingChapter] = useState(false);
    const [errListChapter, setErrChapter] = useState(false);
    const [seeConfirmModal, setSeeConfirmModal] = useState(false);
    const [phoneMenuLinkActive,setPhoneMenuLinkActive] = useState('infos');
    const [width, height] = ScreenSize();
    const orientation = useOrientation()



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
                    divRef.current.scrollTop = divRef.current.scrollHeight;
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
            const data = await renderPrediction(file,'book');
            if(data){
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
            }
            else {
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
        if (newSummary !== book.summary && newSummary.length < 2000) {
            UpdateBookSummaryService(book._id, newSummary)
                .then((res) => {
                    setBook((prevState) => ({
                        ...prevState,
                        summary: res.summary
                    }))
                    setNewSummary(res.summary);
                })
                .catch((err) => setErrSummary(true));
        } else {
            return null;
        }
    }

    return (
        <div className={width < 500 && phoneMenuLinkActive === 'infos' ? styles.container + ' ' + styles.scrollO : styles.container }>
            {
                width < 700 && orientation === 'portrait' ?
                    <VerticalPhoneMenu/>
                    :
                    <>
                        {
                            width  >= 700 && width <= 900 ?
                                <div className={styles.verticalTabContainer}>
                                    <VerticalTabMenu/>
                                </div>
                                :
                                <div className={styles.verticalMenuContainer}>
                                    <VerticalAuthorMenu/>
                                </div>
                        }
                    </>

            }


            <div className={styles.containerData}>
                {
                    !err.book &&
                    <div className={styles.containerHeader}>
                        <SmHeaderDashboard title={bookData.title}/>
                    </div>
                }

                {
                    !loading && err.book &&
                    <ErrorDashboard
                        title={'Impossible de récupérer les données du livre !'}
                        subTitle={"Réessayer ou contacter le support pour obtenir de l'aide..."}
                        btn={'Retour à la liste'}
                        link={() => {
                            router.push('/dashboard/books')
                        }
                        }
                        img={'/assets/diapo/mountain.png'}
                    />
                }
                {
                    !loading && !err.book && book.length !== 0 &&
                    <>
                        {/*      <div className={styles.menuContainer}>
                            <p onClick={() => setActive('chapter')}
                               className={active === 'chapter' ? styles.active : ''}>Chapitres</p>
                        </div>*/}

                        <div className={styles.containerOneBook}>
                            {
                                width <= 1300 &&
                                <div className={styles.containerBtnPhone}>
                                    <button className={phoneMenuLinkActive === 'infos' && styles.activeBtnPhone} onClick={() => setPhoneMenuLinkActive('infos')}>Informations <CursorArrowRaysIcon/></button>
                                    <button className={phoneMenuLinkActive === 'chapters' && styles.activeBtnPhone} onClick={() => setPhoneMenuLinkActive('chapters')}>Chapitre(s)</button>
                                </div>
                            }

                            {
                                width <= 1300 && phoneMenuLinkActive === 'infos' &&
                                <div className={styles.labelContainer}>

                                    <div className={styles.containerTitle}>
                                        <h2> {Capitalize(book.title)} <XCircleIcon           onClick={() => {
                                            setSeeConfirmModal(true);
                                        }}/></h2>
                                        <span></span>
                                    </div>


                                    <div className={styles.imgADescription}>
                                        <div className={styles.containerImg}>
                                            {
                                                loadingImg &&
                                                <div className={styles.loaderImg}>
                                                    <LoaderImg/>
                                                </div>
                                            }
                                            {
                                                localImg && file ?
                                                    <>
                                                        <img src={localImg} className={styles.darkImg}/>

                                                        <div className={styles.imgCheck}>
                                                            <CheckCircleIcon
                                                                onClick={() => updatePic()}
                                                                className={styles.check}/>
                                                            <XCircleIcon
                                                                onClick={() => {
                                                                    setLocalImg(null);
                                                                    setFile(null);
                                                                }
                                                                }
                                                                className={styles.off}/>
                                                        </div>
                                                    </>
                                                    :
                                                    <>
                                                        <img
                                                            onClick={() => {
                                                                imgClick();
                                                            }}
                                                            src={book.img}/>


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
                                                    <div
                                                        onClick={() => router.push({
                                                            pathname: '/livre/' + book._id,
                                                            query: book.slug
                                                        })}
                                                        className={styles.seeBtn}><EyeSolid/>
                                                    </div>
                                                    <button
                                                        onClick={() => sumUpdate()}
                                                        className={newSummary !== book.summary ? styles.activeBtn : ''}
                                                    >Modifier
                                                    </button>
                                                </div>

                                            </div>
                                            {
                                                errSummary &&
                                                <p className={styles.errMsgSummary}>Impossible de modifier le résumé</p>
                                            }

                                            {
                                                book?.summary?.length !== 0 ?
                                                    <textarea onChange={(e) => setNewSummary(e.target.value)}>
                                                    {newSummary}
                                            </textarea>

                                                    :
                                                    <textarea
                                                        placeholder={"Ajoutez un résumé pour donnez envie à vos lecteurs."}
                                                        onChange={(e) => setNewSummary(e.target.value)}
                                                    >

                                                    </textarea>
                                            }

                                        </div>
                                    </div>

                                    <div className={styles.presentationContainer}>


                                        <div className={styles.containerStats}>
                                            <h5>Statistiques <PresentationChartBarIcon/></h5>

                                            <div className={styles.listItem}>
                                                <div className={styles.itemStats}>

                                                    <img src={'/assets/stats/heart.png'}/>
                                                    <div>
                                                        <p className={styles.valueStats}> {book.likes}</p>
                                                        <p className={styles.labelStats}>like(s) <ChatBubbleBottomCenterTextIcon/></p>
                                                    </div>

                                                </div>
                                                <div className={styles.itemStats}>
                                                    <img src={'/assets/stats/bar.png'}/>

                                                    <div>
                                                        <p className={styles.valueStats}>{book.stats.view}</p>
                                                        <p className={styles.labelStats}>vue(s) <ChatBubbleBottomCenterTextIcon/></p>
                                                    </div>


                                                </div>

                                            </div>


                                            <div className={styles.listItem}>

                                                <div className={styles.itemStats}>
                                                    <img src={'/assets/stats/comments.png'}/>

                                                    <div>
                                                        <p className={styles.valueStats}>1287</p>

                                                        <p className={styles.labelStats}>commentaire(s) <ChatBubbleBottomCenterTextIcon/></p>
                                                    </div>


                                                </div>

                                                <div className={styles.itemStats + ' ' + styles.statsChapters}>

                                                    <img src={'/assets/diapo/book.png'}/>
                                                    <div>
                                                        <p className={styles.valueStats}>{book.chapter_list.length}</p>
                                                        <p className={styles.labelStats }>chapitre(s) <ChatBubbleBottomCenterTextIcon/></p>

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
                                                <>
                                                    <div className={styles.headerChapter}>
                                                        <h4>  {book.chapter_list.length} chapitre(s)</h4>
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
                                                            }/>
                                                            <button
                                                                className={styles.newChapter}
                                                                onClick={() => router.push('/dashboard/nouveau-chapitre/' + book._id)}

                                                            >
                                                                Nouveau chapitre
                                                                <CursorArrowRaysIcon/>
                                                            </button>


                                                        </div>

                                                    </div>

                                                </>


                                            }

                                            {
                                                book.chapter_list.length === 0 ?
                                                    <div className={styles.emptyContainer}>
                                                        <h6>Oups !</h6>
                                                        <img src={'/assets/jim/smile6.png'}/>
                                                        <p>C'est bien vide ici, écrivez votre prochain chapitre dès
                                                            maintenant</p>
                                                        <button
                                                            onClick={() => router.push('/dashboard/nouveau-chapitre/' + book._id)}
                                                        >Commencez à écrire
                                                        </button>
                                                    </div> :

                                                    errListChapter ?

                                                        <div className={styles.emptyContainer}>
                                                            <h6>Oups !</h6>
                                                            <p>Impossible de récupérer les chapitres</p>
                                                            <button
                                                                onClick={() => router.reload()}
                                                            >Rafraîchir <ArrowUturnLeftIcon/>
                                                            </button>
                                                        </div>
                                                        :

                                                        loadingChapter ?
                                                            <div className={styles.loadingChapter}><Loader1/></div>
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
                                                                                <>
                                                                                    <CardChapter
                                                                                        id={item._id}
                                                                                        date={item.date_creation}
                                                                                        title={item.title}
                                                                                        index={chapterNumber}
                                                                                        like={item.likes}
                                                                                        publish={item.publish}
                                                                                    />
                                                                                    <CardChapter
                                                                                        id={item._id}
                                                                                        date={item.date_creation}
                                                                                        title={item.title}
                                                                                        index={chapterNumber}
                                                                                        like={item.likes}
                                                                                        publish={item.publish}
                                                                                    />
                                                                                    <CardChapter
                                                                                        id={item._id}
                                                                                        date={item.date_creation}
                                                                                        title={item.title}
                                                                                        index={chapterNumber}
                                                                                        like={item.likes}
                                                                                        publish={item.publish}
                                                                                    />
                                                                                    <CardChapter
                                                                                        id={item._id}
                                                                                        date={item.date_creation}
                                                                                        title={item.title}
                                                                                        index={chapterNumber}
                                                                                        like={item.likes}
                                                                                        publish={item.publish}
                                                                                    />
                                                                                    <CardChapter
                                                                                        id={item._id}
                                                                                        date={item.date_creation}
                                                                                        title={item.title}
                                                                                        index={chapterNumber}
                                                                                        like={item.likes}
                                                                                        publish={item.publish}
                                                                                    />
                                                                                </>

                                                                            )
                                                                        }) :

                                                                        <p>C'est vide ici</p>
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
                                                                        <LoaderCommentary/>
                                                                    }
                                                                </div>
                                                            </div>
                                            }
                                        </div>
                                        /*              <>
                                                          <div className={styles.headerCommentary}>
                                                              <div className={styles.likesTotal}>
                                                                  <p className={styles.totalLabel}>Total like(s)</p>
                                                                  <p className={styles.totalNb}> 2128 </p>
                                                                  <p className={styles.smLabel}>Total like depuis sa sortie
                                                                      (18/29/23)</p>
                                                              </div>
                                                              <div className={styles.border}>

                                                              </div>
                                                              <div className={styles.likesTotal}>
                                                                  <p className={styles.totalLabel}>Total commentaire(s)</p>
                                                                  <p className={styles.totalNb}> 237 </p>
                                                                  <p className={styles.smLabel}>Total de commentaires depuis sa
                                                                      sortie </p>
                                                              </div>
                                                          </div>
                                                          <div className={styles.some}>
                                                              <h7>Quelques commentaires :</h7>
                                                          </div>
                                                          <div className={styles.commentaryContainer}>
                                                              <CommentaryDashboard
                                                                  pseudo={'JoséBeauvais'}
                                                                  img={'/assets/livre6.jpg'}
                                                                  role={'Lecteur'}
                                                                  date={'18/02/28'}
                                                                  likes={2891}
                                                                  content={"J'aime beaucoup ce livre qui qu qui qui qui qui qui qui qui qui qui qui qui sssssssssssssssssssssssssssssssssssssssssssssquisssssssssssssssssssssssssssssssssssssssssssssquisssssssssssssssssssssssssssssssssssssssssssssquisssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssquisssssssssssssssssssssssssssssssssssssssssssssquisssssssssssssssssssssssssssssssssssssssssssssquisssssssssssssssssssssssssssssssssssssssssssssquisssssssssssssssssssssssssssssssssssssssssssssquisssssssssssssssssssssssssssssssssssssssssssssquisssssssssssssssssssssssssssssssssssssssssssssquisssssssssssssssssssssssssssssssssssssssssssssquisssssssssssssssssssssssssssssssssssssssssssssqui fait parti mes préférés, je conseille à tous de lire ce chef d'oeuvre"}
                                                              />

                                                              <CommentaryDashboard
                                                                  pseudo={'JoséBeauvais'}
                                                                  img={'/assets/livre3.jpg'}
                                                                  role={'Lecteur'}
                                                                  date={'18/02/28'}
                                                                  likes={2891}
                                                                  content={"J'aime beaucoup ce livre qui qu qui qui qui qui qui qui qui qui qui qui qui sssssssssssssssssssssssssssssssssssssssssssssquisssssssssssssssssssssssssssssssssssssssssssssquisssssssssssssssssssssssssssssssssssssssssssssquisssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssquisssssssssssssssssssssssssssssssssssssssssssssquisssssssssssssssssssssssssssssssssssssssssssssquisssssssssssssssssssssssssssssssssssssssssssssquisssssssssssssssssssssssssssssssssssssssssssssquisssssssssssssssssssssssssssssssssssssssssssssquisssssssssssssssssssssssssssssssssssssssssssssquisssssssssssssssssssssssssssssssssssssssssssssquisssssssssssssssssssssssssssssssssssssssssssssqui fait parti mes préférés, je conseille à tous de lire ce chef d'oeuvre"}
                                                              />
                                                          </div>
                                                      </>*/
                                    }


                                </div>
                            }
                            {
                                width > 1300 &&
                                <>
                                    <div className={styles.labelContainer}>

                                        <div className={styles.containerTitle}>
                                            <h2> {Capitalize(book.title)} <XCircleIcon           onClick={() => {
                                                setSeeConfirmModal(true);
                                            }}/></h2>
                                            <span></span>
                                        </div>


                                        <div className={styles.imgADescription}>
                                            <div className={styles.containerImg}>
                                                {
                                                    loadingImg &&
                                                    <div className={styles.loaderImg}>
                                                        <LoaderImg/>
                                                    </div>
                                                }
                                                {
                                                    localImg && file ?
                                                        <>
                                                            <img src={localImg} className={styles.darkImg}/>

                                                            <div className={styles.imgCheck}>
                                                                <CheckCircleIcon
                                                                    onClick={() => updatePic()}
                                                                    className={styles.check}/>
                                                                <XCircleIcon
                                                                    onClick={() => {
                                                                        setLocalImg(null);
                                                                        setFile(null);
                                                                    }
                                                                    }
                                                                    className={styles.off}/>
                                                            </div>
                                                        </>
                                                        :
                                                        <>
                                                            <img className={styles.imgOriginal}
                                                                onClick={() => {
                                                                    imgClick();
                                                                }}
                                                                src={book.img}/>


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
                                                        <div
                                                            onClick={() => router.push({
                                                                pathname: '/livre/' + book._id,
                                                                query: book.slug
                                                            })}
                                                            className={styles.seeBtn}><EyeSolid/>
                                                        </div>
                                                        <button
                                                            onClick={() => sumUpdate()}
                                                            className={newSummary !== book.summary ? styles.activeBtn : ''}
                                                        >Modifier
                                                        </button>
                                                    </div>

                                                </div>
                                                {
                                                    errSummary &&
                                                    <p className={styles.errMsgSummary}>Impossible de modifier le résumé</p>
                                                }

                                                {
                                                    book?.summary?.length !== 0 ?
                                                        <textarea onChange={(e) => setNewSummary(e.target.value)}>
                                                    {newSummary}
                                            </textarea>

                                                        :
                                                        <textarea
                                                            placeholder={"Ajoutez un résumé pour donnez envie à vos lecteurs."}
                                                            onChange={(e) => setNewSummary(e.target.value)}
                                                        >

                                                    </textarea>
                                                }

                                            </div>
                                        </div>

                                        <div className={styles.presentationContainer}>


                                            <div className={styles.containerStats}>
                                                <h5>Statistiques <PresentationChartBarIcon/></h5>

                                                <div className={styles.listItem}>
                                                    <div className={styles.itemStats}>

                                                        <img src={'/assets/stats/heart.png'}/>
                                                        <div>
                                                            <p className={styles.valueStats}>{book.likes}</p>
                                                            <p className={styles.labelStats}>like(s) <ChatBubbleBottomCenterTextIcon/></p>
                                                        </div>

                                                    </div>
                                                    <div className={styles.itemStats}>
                                                        <img src={'/assets/stats/bar.png'}/>

                                                        <div>
                                                            <p className={styles.valueStats}>{book.stats.view}</p>
                                                            <p className={styles.labelStats}>vue(s) <ChatBubbleBottomCenterTextIcon/></p>
                                                        </div>


                                                    </div>

                                                </div>


                                                <div className={styles.listItem}>

                                                    <div className={styles.itemStats}>
                                                        <img src={'/assets/stats/comments.png'}/>

                                                        <div>
                                                            <p className={styles.valueStats}>1287</p>

                                                            <p className={styles.labelStats}>commentaire(s) <ChatBubbleBottomCenterTextIcon/></p>
</div>


                                                    </div>

                                                    <div className={styles.itemStats}>

                                                        <img src={'/assets/diapo/book.png'}/>
                                                        <div>
                                                            <p className={styles.valueStats}>{book.chapter_list.length}</p>
                                                            <p className={styles.labelStats}>chapitre(s) <ChatBubbleBottomCenterTextIcon/></p>

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
                                                    !errListChapter && !loadingChapter && chapterList.length > 0 &&
                                                    <>
                                                        <div className={styles.headerChapter}>
                                                            <h4>{book.chapter_list.length} chapitre(s)</h4>
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
                                                                }/>
                                                                <button
                                                                    className={styles.newChapter}
                                                                    onClick={() => router.push('/dashboard/nouveau-chapitre/' + book._id)}

                                                                >
                                                                    Nouveau chapitre
                                                                    <CursorArrowRaysIcon/>
                                                                </button>


                                                            </div>

                                                        </div>

                                                    </>


                                                }

                                                {
                                                    book.chapter_list.length === 0 ?
                                                        <div className={styles.emptyContainer}>
                                                            <h6>Oups !</h6>
                                                            <img src={'/assets/jim/smile6.png'}/>
                                                            <p>C'est bien vide ici, écrivez votre prochain chapitre dès
                                                                maintenant</p>
                                                            <button
                                                                onClick={() => router.push('/dashboard/nouveau-chapitre/' + book._id)}
                                                            >Commencez à écrire
                                                            </button>
                                                        </div> :

                                                        errListChapter ?

                                                            <div className={styles.emptyContainer}>
                                                                <h6>Oups !</h6>
                                                                <p>Impossible de récupérer les chapitres</p>
                                                                <button
                                                                    onClick={() => router.reload()}
                                                                >Rafraîchir <ArrowUturnLeftIcon/>
                                                                </button>
                                                            </div>
                                                            :

                                                            loadingChapter ?
                                                                <div className={styles.loadingChapter}><Loader1/></div>
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
                                                                                    <>
                                                                                        <CardChapter
                                                                                            id={item._id}
                                                                                            date={item.date_creation}
                                                                                            title={item.title}
                                                                                            index={chapterNumber}
                                                                                            like={item.likes}
                                                                                            publish={item.publish}
                                                                                        />


                                                                                    </>

                                                                                )
                                                                            }) :

                                                                            <p>C'est vide ici</p>
                                                                    }

                                                                    <div className={styles.seeMoreContainer}>
                                                                        {
                                                                            seeMoreChapter && chapterList && !loadingScroll  &&
                                                                            <TextSeeMore
                                                                                onclick={() => getMoreChapter()}
                                                                            />
                                                                        }
                                                                        {
                                                                            loadingScroll &&
                                                                            <LoaderCommentary/>
                                                                        }
                                                                    </div>

                                                                    {
                                                                        book.chapter_list.length <= 2 &&
                                                                        <div className={styles.oneChapter}>
                                                                            <img src={'/assets/diapo/moon.png'}/>
                                                                        </div>
                                                                    }



                                                                </div>
                                                }
                                            </div>
                                            /*              <>
                                                              <div className={styles.headerCommentary}>
                                                                  <div className={styles.likesTotal}>
                                                                      <p className={styles.totalLabel}>Total like(s)</p>
                                                                      <p className={styles.totalNb}> 2128 </p>
                                                                      <p className={styles.smLabel}>Total like depuis sa sortie
                                                                          (18/29/23)</p>
                                                                  </div>
                                                                  <div className={styles.border}>

                                                                  </div>
                                                                  <div className={styles.likesTotal}>
                                                                      <p className={styles.totalLabel}>Total commentaire(s)</p>
                                                                      <p className={styles.totalNb}> 237 </p>
                                                                      <p className={styles.smLabel}>Total de commentaires depuis sa
                                                                          sortie </p>
                                                                  </div>
                                                              </div>
                                                              <div className={styles.some}>
                                                                  <h7>Quelques commentaires :</h7>
                                                              </div>
                                                              <div className={styles.commentaryContainer}>
                                                                  <CommentaryDashboard
                                                                      pseudo={'JoséBeauvais'}
                                                                      img={'/assets/livre6.jpg'}
                                                                      role={'Lecteur'}
                                                                      date={'18/02/28'}
                                                                      likes={2891}
                                                                      content={"J'aime beaucoup ce livre qui qu qui qui qui qui qui qui qui qui qui qui qui sssssssssssssssssssssssssssssssssssssssssssssquisssssssssssssssssssssssssssssssssssssssssssssquisssssssssssssssssssssssssssssssssssssssssssssquisssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssquisssssssssssssssssssssssssssssssssssssssssssssquisssssssssssssssssssssssssssssssssssssssssssssquisssssssssssssssssssssssssssssssssssssssssssssquisssssssssssssssssssssssssssssssssssssssssssssquisssssssssssssssssssssssssssssssssssssssssssssquisssssssssssssssssssssssssssssssssssssssssssssquisssssssssssssssssssssssssssssssssssssssssssssquisssssssssssssssssssssssssssssssssssssssssssssqui fait parti mes préférés, je conseille à tous de lire ce chef d'oeuvre"}
                                                                  />

                                                                  <CommentaryDashboard
                                                                      pseudo={'JoséBeauvais'}
                                                                      img={'/assets/livre3.jpg'}
                                                                      role={'Lecteur'}
                                                                      date={'18/02/28'}
                                                                      likes={2891}
                                                                      content={"J'aime beaucoup ce livre qui qu qui qui qui qui qui qui qui qui qui qui qui sssssssssssssssssssssssssssssssssssssssssssssquisssssssssssssssssssssssssssssssssssssssssssssquisssssssssssssssssssssssssssssssssssssssssssssquisssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssquisssssssssssssssssssssssssssssssssssssssssssssquisssssssssssssssssssssssssssssssssssssssssssssquisssssssssssssssssssssssssssssssssssssssssssssquisssssssssssssssssssssssssssssssssssssssssssssquisssssssssssssssssssssssssssssssssssssssssssssquisssssssssssssssssssssssssssssssssssssssssssssquisssssssssssssssssssssssssssssssssssssssssssssquisssssssssssssssssssssssssssssssssssssssssssssqui fait parti mes préférés, je conseille à tous de lire ce chef d'oeuvre"}
                                                                  />
                                                              </div>
                                                          </>*/
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
                        .then(() => router.push('/dashboard/books'))
                        .catch((err) => console.log('err'))
                }
                } img={bookData?.img} btnConfirm={'Supprimer'}
                              subTitle={'Supprimer ' + bookData.title + ' et ses chapitres.'}
                              title={'Êtes-vous sûr de vouloir continuer ? '} close={() => setSeeConfirmModal(false)}/>
            }
        </div>


    )
}

export default OneBook;