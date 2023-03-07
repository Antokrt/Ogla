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
import {UserCircleIcon} from "@heroicons/react/24/solid";
import {useSession} from "next-auth/react";
import {BookOpenIcon} from "@heroicons/react/24/solid";
import {ArrowTrendingUpIcon, CheckCircleIcon, TagIcon, XCircleIcon} from "@heroicons/react/20/solid";
import CommentaryDashboard from "../../../Component/Dashboard/CommentaryDashboard";
import {PencilIcon} from "@heroicons/react/24/solid";
import chapter from "../../../Component/layouts/Icons/Chapter";
import {CardChapter} from "../../../Component/Dashboard/Card/CardChapter";


export async function getServerSideProps({req, params}) {
    const id = params.id;
    const config = await getConfigOfProtectedRoute(req);
    const book = await fetch('http://localhost:3008/author/book/' + id, config);
    const chapterList = await fetch('http://localhost:3008/chapter/dashboard/list/' + id + '/1', config);
    const chapterErrData = !chapterList.ok;
    const bookErrData = !book.ok;
    let chapterJson = await chapterList.json();
    if (chapterJson.statusCode === 404) {
        chapterJson = null;
    }
    const booksJson = await book.json();
    booksJson.img = process.env.NEXT_PUBLIC_BASE_IMG_BOOK + booksJson.img;
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
    const [seeMoreChapter, setSeeMoreChapter] = useState(true);
    const [errSummary, setErrSummary] = useState(false);
    const [newSummary, setNewSummary] = useState(book.summary);
    const imgRef = useRef();
    const [file, setFile] = useState(true);
    const [localImg, setLocalImg] = useState(null);
    const [errImg, setErrImg] = useState(false);
    const imageMimeType = /image\/(png|jpg|jpeg)/i;
    const router = useRouter();

    const handleFileSelect = (event) => {
        if (event?.target.files && event.target.files[0]) {
            setFile(event.target.files[0]);
            setLocalImg(URL.createObjectURL(event.target.files[0]));
        }
    }

    const getMoreChapter = () => {
        GetMoreChapterService(book._id,chapterPage)
            .then((res) => {
                if (res.length === 0) {
                    setSeeMoreChapter(false);
                } else {
                    setChapterList(prevState => [...prevState, ...res]);
                    setChapterPage(chapterPage + 1);
                }
            })
    }

    const updatePic = () => {
        if (file) {
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
                    setErrImg(false);
                })
                .catch((err) => {
                    setErrImg(true);
                })
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
        <div className={styles.container}>
            <div className={styles.verticalMenuContainer}>
                <VerticalAuthorMenu/>
            </div>

            <div className={styles.containerData}>
                <div className={styles.containerHeader}>
                    <HeaderDashboard/>
                </div>
                {
                    loading &&
                    <p>Loading...</p>
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
                        img={'/assets/chara/chara5.png'}
                    />
                }
                {
                    !loading && !err.book && book.length !== 0 &&
                    <>
                        <div className={styles.menuContainer}>
                            <p onClick={() => setActive('chapter')}
                               className={active === 'chapter' ? styles.active : ''}>Chapitres</p>
                            <p onClick={() => setActive('commentary')}
                               className={active === 'commentary' ? styles.active : ''}>Meilleurs commentaires</p>
                        </div>

                        <div className={styles.containerOneBook}>
                            <div className={styles.labelContainer}>
                                <div className={styles.containerTitle}>
                                    <h2>{book.title}</h2>
                                    <span></span>
                                </div>
                                <div className={styles.imgADescription}>
                                    <div className={styles.containerImg}>
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
                                                    {
                                                        errImg &&
                                                        <p className={styles.errMsgSummary + " " + styles.errImg}>Impossible
                                                            de modifier l'image</p>
                                                    }
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
                                                <button
                                                    onClick={() => router.push({
                                                        pathname: '/livre/' + book._id,
                                                        query: book.slug
                                                    })}
                                                    className={styles.seeBtn}>Voir le livre
                                                </button>
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
                                    <div className={styles.statsLabelContainer}>
                                        <div className={styles.chapterNbLabel}>
                                            <p className={styles.length}>239</p>
                                            <h6>like(s)</h6>
                                        </div>
                                        <div className={styles.chapterNbLabel}>
                                            <p className={styles.length}>67{book.chapter_list.length}</p>
                                            <h6>chapitre(s)</h6>
                                        </div>
                                        <div className={styles.dateLabel}>
                                            <p>17/02/2022</p>
                                            <h6>depuis le</h6>
                                        </div>
                                    </div>
                                    <div className={styles.contentContainer}>
                                        <div>
                                            <TagIcon className={styles.tag}/>
                                            <p className={styles.category}>{book.category}</p>
                                            <p>{book._id}</p>
                                        </div>
                                        <div>
                                            <BookOpenIcon/>
                                            <p className={styles.last}>Dernier chapitre - 18/09/23 </p>
                                        </div>
                                        <div>
                                            <ArrowTrendingUpIcon/>
                                            <p className={styles.last}>178 <br/>commentaires </p>
                                        </div>
                                        <p
                                            onClick={() => {
                                                DeleteBookService(book._id)
                                                    .then(() => router.push('/dashboard/books'))
                                                    .catch((err) => console.log('err'))
                                            }
                                            }
                                            className={styles.delete}>Supprimer le livre</p>

                                    </div>
                                </div>

                            </div>
                            <div className={styles.selectContainer}>
                                {
                                    active === 'chapter' ?
                                        <div className={styles.chapterContainer}>
                                            <div className={styles.headerChapter}>
                                                <h4>Chapitres ({book.chapter_list.length})</h4>
                                            </div>
                                            {
                                                book.chapter_list.length === 10 ?
                                                    <div className={styles.emptyContainer}>
                                                        <h6>Oups !</h6>
                                                        <p>C'est bien vide ici, écrivez votre prochain chapitre dès
                                                            maintenant</p>
                                                        <button
                                                            onClick={() => router.push('/dashboard/nouveau-livre')}>Ecrire... <PencilIcon/>
                                                        </button>
                                                    </div> :


                                                    <div className={styles.contentChapterList}>
                                                        <button className={styles.newChapter}
                                                                onClick={() => router.push('/dashboard/nouveau-chapitre/' + book._id)}
                                                        >Nouveau chapitre
                                                        </button>

                                                        {
                                                            chapterList ?
                                                                chapterList.map((item, index) => {
                                                                    return (
                                                                        <>
                                                                            <CardChapter
                                                                                id={item._id}
                                                                                date={item.date}
                                                                                title={item.title}
                                                                                index={index + 1}
                                                                                like={item.like}
                                                                                publish={item.publish}
                                                                            />
                                                                        </>

                                                                    )
                                                                }) :

                                                                <p>C'est vide ici</p>
                                                        }

                                                        {
                                                            seeMoreChapter &&
                                                            <p onClick={() => getMoreChapter()}>Voir plus</p>
                                                        }

                                                    </div>
                                            }
                                        </div> :
                                        <>
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
                                        </>
                                }


                            </div>
                        </div>
                    </>

                }
            </div>
        </div>


    )
}

export default OneBook;