import styles from '../../../styles/Pages/Dashboard/OneChapter.module.scss';

import {useRouter} from "next/router";

import {getConfigOfProtectedRoute} from "../../api/utils/Config";
import VerticalAuthorMenu from "../../../Component/Menu/VerticalAuthorMenu";
import HeaderDashboard from "../../../Component/Dashboard/HeaderDashboard";
import {useSession} from "next-auth/react";
import {useEffect, useState} from "react";
import ErrorDashboard from "../../../Component/Dashboard/ErrorDashboard";
import {EditorContent, useEditor} from "@tiptap/react";
import {StarterKit} from "@tiptap/starter-kit";
import {Placeholder} from "@tiptap/extension-placeholder";
import {deleteChapter, newChapter, publishChapter, saveChapter} from "../../../service/Dashboard/ChapterAuthorService";
import {
    ArrowPathIcon,
    ChevronDoubleLeftIcon,
    ChevronDoubleRightIcon,
    ChevronRightIcon, CursorArrowRaysIcon, FolderArrowDownIcon,
    HomeIcon, InboxArrowDownIcon,
    TrashIcon
} from "@heroicons/react/24/outline";
import {DateNow} from "../../../utils/Date";
import {ChatBubbleLeftRightIcon} from "@heroicons/react/20/solid";
import scrollbar from "../../../styles/utils/scrollbar.module.scss";
import CommentaryNewChapter from "../../../Component/Dashboard/CommentaryNewChapter";
import {EyeIcon} from "@heroicons/react/24/solid";
import {Capitalize} from "../../../utils/String";
import {ConfirmModal} from "../../../Component/Modal/ConfirmModal";
import {LoaderCommentary} from "../../../Component/layouts/Loader";
import VerticalPhoneMenu from "../../../Component/Menu/VerticalPhoneMenu";
import VerticalTabMenu from "../../../Component/Menu/VerticalTabMenu";
import useOrientation from "../../../utils/Orientation";
import ScreenSize from "../../../utils/Size";


export async function getServerSideProps({req, params}) {
    const id = params.id;
    const config = await getConfigOfProtectedRoute(req);
    const chapter = await fetch('http://localhost:3008/chapter/' + id, config);
    const chapterErrData = !chapter.ok;
    let chapterJson = await chapter.json();
    const book = await fetch('http://localhost:3008/author/book/' + chapterJson.book_id, config);
    const bookErrData = !book.ok;
    let booksJson = await book.json();
    if (chapterJson.statusCode === 404) {
        chapterJson = null;
    }

    if (booksJson.statusCode === 404) {
        booksJson = null;
    }

    return {
        props: {
            err: {
                chapter: chapterErrData,
                book: bookErrData
            },
            chapterData: chapterJson,
            bookData: booksJson
        }
    }
}

export default function ChapitrePage({chapterData, bookData, err}) {

    const router = useRouter();
    const {data: session} = useSession();
    const [loading, setLoading] = useState(true);
    const [chapter, setChapter] = useState([]);
    const [book, setBook] = useState();
    const [title, setTitle] = useState(chapterData.title);
    const [content, setContent] = useState(JSON.parse(chapterData.content));
    const [text, setText] = useState(chapterData.text);
    const [hasChange, setHasChange] = useState(false);
    const [seeConfirmModal, setSeeConfirmModal] = useState(false);
    const orientation = useOrientation();
    const [width, height] = ScreenSize();
    const index = router.query.index

    useEffect(() => {
        setChapter(chapterData);
        setBook(bookData);
        setLoading(false);
    }, [])


    useEffect(() => {
        if (JSON.stringify(content) !== chapterData.content || title !== chapterData.title) {
            setHasChange(true);
        } else {
            setHasChange(false);
        }
    }, [content, title])


    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({
                emptyEditorClass: 'is-editor-empty',
                placeholder: 'Commencez à écrire votre chapitre ici...'
            })
        ],
        onUpdate({editor}) {
            setContent(editor?.getJSON());
            setText(editor?.getText());
        },
        content: content
    })

    const bold = () => {
        return editor.chain().focus().toggleBold().run();
    }

    const italic = () => {
        return editor.chain().focus().toggleItalic().run();
    }

    const saveThis = () => {
        if (hasChange) {
            const data = {
                id: chapterData._id,
                title,
                content: JSON.stringify(content),
                text,
            }

            saveChapter(data)
                .then((res) => {
                    chapterData.content = res.data.content;
                    chapterData.title = res.data.title;
                    setTitle(chapterData.title);
                    setContent(JSON.parse(chapterData.content));
                    setHasChange(false);
                })
                .catch((err) => console.log(err))
        }
    }

    const publishThis = () => {
        if (hasChange || !chapterData.publish) {
            const data = {
                id: chapterData._id,
                title,
                content: JSON.stringify(content),
                text,
            }

            publishChapter(data)
                .then((res) => {
                    chapterData.content = res.data.content;
                    chapterData.title = res.data.title;
                    chapterData.publish = res.data.publish;
                    setTitle(chapterData.title);
                    setContent(JSON.parse(chapterData.content));
                    setHasChange(false);
                })
                .catch((err) => console.log(err))
        }
    }

    const deleteThis = () => {
        deleteChapter(chapterData._id)
            .then((res) => router.replace('/dashboard/books/' + bookData._id))
            .catch((err) => console.log(err));
    }
    return (
        <div className={styles.container}>
            <div className={styles.containerMain}>
                {
                    width < 700 && orientation === 'portrait' ?
                        <VerticalPhoneMenu/>
                        :
                        <>
                            {
                                width  >= 700 && width <= 1050 ?
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



                {
                    err.chapter || err.book && !loading &&
                    <div className={styles.errContainer}>
                        <ErrorDashboard
                            title={'Impossible de récupérer ce chapitre'}
                            img={'/assets/jim/angry2.png'}
                            link={() => router.push('/dashboard/books/')}
                            btn={'Retour'}
                            subTitle={'Réessayer ou contacter le support pour obtenir de l\'aide...\n' +
                                '\n'}
                        />
                    </div>
                }
                {
                    !err.chapter && !err.book && !loading && chapterData &&
                    <div className={styles.containerData}>
                        {
                            width > 1200 ?
                                <div className={styles.header}>
                                    <div className={styles.list}>
                                        <HomeIcon/>
                                        <ChevronRightIcon className={styles.arrow}/>
                                        <h6
                                            onClick={() => router.push('/dashboard/books/' + book._id)}
                                        >{book.title}</h6>
                                        <ChevronRightIcon className={styles.arrow}/>
                                        <p>{chapter.title} ({index})</p>
                                    </div>
                                    <div className={styles.btnList}>
                                        {
                                            !chapterData.publish &&
                                            <button
                                                className={hasChange ? styles.activeSaveBtn : ''}
                                                onClick={() => {
                                                    saveThis()
                                                }
                                                }
                                            >Enregistrer <ArrowPathIcon/></button>
                                        }


                                        <button
                                            className={hasChange || !chapterData.publish ? styles.activePublishBtn : ''}
                                            onClick={() => publishThis()}
                                        >Publier <CursorArrowRaysIcon/>
                                        </button>


                                        {
                                            chapterData?.publish &&
                                            <div
                                                onClick={() => router.push({
                                                    pathname: "/chapitre/" + chapterData._id, query: {
                                                        name: chapterData?.title, slug: chapterData?.slug, i: index
                                                    },
                                                })}
                                                className={styles.eyeDiv}>
                                                <EyeIcon/>
                                            </div>
                                        }


                                        <div
                                            onClick={() => {
                                                setSeeConfirmModal(true);
                                            }
                                            }
                                            className={styles.iconDiv}>
                                            <TrashIcon/>
                                        </div>


                                    </div>


                                </div>
                                :
                                <div className={styles.headerResp}>
                                    <div className={styles.list}>
                                        <HomeIcon className={styles.homeHResp}/>
                                        <ChevronRightIcon className={styles.arrow + ' ' + styles.arrowResp}/>
                                        <h6
                                        >{book.title} et d'autres filouteries ({index})</h6>
                                    </div>
                                    <div className={styles.btnList}>
                                        {
                                            !chapterData.publish &&
                                            <button
                                                className={hasChange ? styles.activeSaveBtn : ''}
                                                onClick={() => {
                                                    saveThis()
                                                }
                                                }
                                            >Enregistrer <ArrowPathIcon/>
                                            </button>
                                        }



                                        <button
                                            className={hasChange || !chapterData.publish ? styles.activePublishBtn : ''}
                                            onClick={() => publishThis()}
                                        >Publier <CursorArrowRaysIcon/>

                                        </button>


                                        <div
                                            onClick={() => {
                                                setSeeConfirmModal(true);
                                            }
                                            }
                                            className={styles.iconDiv}>
                                            <TrashIcon/>
                                        </div>

                                        {
                                            chapterData?.publish &&
                                            <div
                                                onClick={() => router.push({
                                                    pathname: "/chapitre/" + chapterData._id, query: {
                                                        name: chapterData?.title, slug: chapterData?.slug, i: index
                                                    },
                                                })}
                                                className={styles.eyeDiv}>
                                                <EyeIcon/>
                                            </div>
                                        }
                                    </div>


                                </div>

                        }

                        {
                            width > 700 ?
                                <div className={styles.containerSecond}>

                                    <div className={styles.containerText}>

                                        <div className={styles.containerTitle}>
                                            <div className={styles.titleL}>
                                                <p>Chapitre {index}</p>
                                                <input
                                                    onChange={(e) => setTitle(e.target.value)}
                                                    name={"title"}
                                                    type={'text'}
                                                    value={Capitalize(title)}
                                                    placeholder={'Ajoutez un titre ici'}
                                                />
                                            </div>
                                            <div className={styles.titleR}>
                                                <p>{DateNow()}</p>
                                                <div className={styles.containerImgBook}>
                                                    <img src={'/assets/diapo/chapter.png'}/>
                                                </div>
                                            </div>

                                        </div>


                                        <div className={styles.containerTextEditor}>
                                            <button
                                                onClick={() => bold()}
                                                className={editor.isActive('bold') ? styles.bold : ''}>B
                                            </button>
                                            <div className={styles.separatorEditor}></div>
                                            <button
                                                onClick={() => italic()}
                                                className={editor.isActive('italic') ? styles.italic : ''}>I
                                            </button>
                                            <div className={styles.separatorEditor}></div>
                                            {
                                                width <= 700 &&
                                                <img className={styles.bookEditor} src={'/assets/diapo/book.png'}/>
                                            }
                                        </div>

                                        <div className={styles.text}>
                                            {
                                                content &&
                                                <EditorContent editor={editor}/>
                                            }
                                        </div>

                                        {
                                            width < 1100 &&
                                            <div className={styles.btnListResp}>
                                                <button
                                                    className={hasChange ? styles.activeSaveBtn : ''}
                                                    onClick={() => {
                                                        saveThis()
                                                    }
                                                    }
                                                >Enregistrer <ArrowPathIcon/>
                                                </button>


                                                <button
                                                    className={hasChange || !chapterData.publish ? styles.activePublishBtn : ''}
                                                    onClick={() => publishThis()}
                                                >Publier <CursorArrowRaysIcon/>
                                                </button>

                                                <div
                                                    onClick={() => {
                                                        setSeeConfirmModal(true);
                                                    }
                                                    }
                                                    className={styles.iconDiv}>
                                                    <TrashIcon/>
                                                </div>
                                            </div>
                                        }
                                    </div>

                                    <div className={styles.containerPresentationBook}>
                                        <div onClick={() => router.push('/dashboard/books/' + book._id)}
                                             className={styles.headPresentation}>
                                            <img src={book.img}/>
                                            <h3>{bookData?.title}</h3>
                                        </div>
                                        <div className={styles.summary}>
                                            <p>"{Capitalize(bookData?.summary)}"</p>
                                        </div>

                                        <div className={styles.statsPresentation}>
                                            <img src={'/assets/jim/cool2.png'}/>
                                            <h6>Apprenez à donner vie à vos idées et à captiver vos lecteurs grâce à notre guide
                                                d'écriture...</h6>
                                            <p>Cliquez ici pour en savoir plus !</p>
                                        </div>
                                    </div>
                                </div>
                                :
                                <div className={styles.containerPhone}>
                                    <div className={styles.containerTitlePhone}>
                                        <div className={styles.titleLPhone}>
                                            <h6>{chapter.title}</h6>
                                            <p className={styles.new}>{book.title} ({book.chapter_list.length}) {!chapterData.publish && <>(brouillon)</>}</p>

                                        </div>

                                        <div className={styles.titleRPhone}>
                                            <p>{DateNow()}</p>
                                            <div className={styles.containerImgBook}>
                                                <img src={book.img}/>
                                            </div>
                                        </div>

                                        <input
                                            onChange={(e) => setTitle(e.target.value)}
                                            name={"title"}
                                            type={'text'}
                                            value={title}
                                            placeholder={'Ajoutez un titre ici'}
                                        />
                                    </div>


                                    <div className={styles.containerTextEditorPhone}>
                                        <button
                                            onClick={() => bold()}
                                            className={editor.isActive('bold') ? styles.bold : ''}>B
                                        </button>
                                        <div className={styles.separatorEditor}></div>
                                        <button
                                            onClick={() => italic()}
                                            className={editor.isActive('italic') ? styles.italic : ''}>I
                                        </button>
                                        <div className={styles.separatorEditor}></div>

                                    </div>

                                    <div className={styles.textPhone}>

                                        <EditorContent editor={editor}/>
                                    </div>

                                    <div className={styles.containerBtnPhone}>
                                        <button
                                            className={hasChange ? styles.activeSaveBtn : ''}
                                            onClick={() => saveThis()}
                                        >Enregistrer <ArrowPathIcon/>
                                        </button>


                                        <button
                                            className={hasChange ? styles.activePublishBtn : ''}
                                            onClick={() => publishThis()}
                                        >Publier <CursorArrowRaysIcon/>
                                        </button>

                                        <button
                                            onClick={() => {
                                                setSeeConfirmModal(true);
                                            }
                                            }
                                            className={styles.iconDiv}>
                                            <TrashIcon/>
                                        </button>

                                    </div>
                                </div>

                        }

                    </div>
                }
            </div>
            {
                seeConfirmModal &&
                <ConfirmModal confirm={() => deleteThis()} btnConfirm={'Supprimer'}
                              close={() => setSeeConfirmModal(false)} title={'Supprimer le chapitre'} subTitle={'Êtes-vous sûr de vouloir supprimer "'+chapter.title +'" ?'}/>
            }
        </div>
    )
}