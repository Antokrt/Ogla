import styles from '../../../styles/Pages/Dashboard/NewChapter.module.scss';
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import VerticalAuthorMenu from "../../../Component/Menu/VerticalAuthorMenu";
import {getConfigOfProtectedRoute} from "../../api/utils/Config";
import ErrorDashboard from "../../../Component/Dashboard/ErrorDashboard";
import {Placeholder} from "@tiptap/extension-placeholder";
import {
    ChevronRightIcon, CursorArrowRaysIcon, HomeIcon
} from "@heroicons/react/24/outline";
import {useEditor, EditorContent, extensions} from "@tiptap/react";
import {StarterKit} from "@tiptap/starter-kit";
import {DateNow} from "../../../utils/Date";
import {NewChapterService} from "../../../service/Dashboard/ChapterAuthorService";
import {Capitalize} from "../../../utils/String";
import VerticalPhoneMenu from "../../../Component/Menu/VerticalPhoneMenu";
import VerticalTabMenu from "../../../Component/Menu/VerticalTabMenu";
import useOrientation from "../../../utils/Orientation";
import ScreenSize from "../../../utils/Size";
import {ArrowPathIcon} from "@heroicons/react/24/solid";
import Head from "next/head";
import {toastDisplayError} from "../../../utils/Toastify";
import {GetDefaultBookImgWhenError, GetImgPathOfAssets} from "../../../utils/ImageUtils";
import {GetFetchPath} from "../../api/utils/Instance";
import {LoaderImg} from "../../../Component/layouts/Loader";
import { useSelector } from 'react-redux';
import { selectTheme } from '../../../store/slices/themeSlice';

export async function getServerSideProps({req, params}) {

    const id = params.id;
    const config = await getConfigOfProtectedRoute(req);
    const book = await fetch(GetFetchPath() + 'author/book/' + id, config);
    const booksJson = await book.json();
    const bookErrData = !book.ok;

    return {
        props: {
            err: {
                book: bookErrData
            },
            bookData: booksJson,
        }
    }
}

const NouveauChapitre = ({bookData, err}) => {

    const [publishLoading,setPublishLoading] = useState(false);
    const [saveLoading,setSaveLoading] = useState(false);
    const [canSend, setCanSend] = useState(false);
    const [loading, setLoading] = useState(true);
    const [book, setBook] = useState(bookData);
    const [content, setContent] = useState();
    const [title, setTitle] = useState('');
    const theme = useSelector(selectTheme);
    const orientation = useOrientation();
    const [text, setText] = useState('');
    const [width, height] = ScreenSize();
    const router = useRouter();

    const onPageChange = () => {
        const object = {
            bookId: bookData?._id,
            text: text,
            content: content,
            title: title
        }
        localStorage.setItem('new', JSON.stringify(object))
    }

    useEffect(() => {
        router.events.on('routeChangeStart', onPageChange);

        return () => {
            router.events.off('routeChangeStart', onPageChange);
        };
    }, [router]);

    useEffect(() => {
        if (router.isReady) {
            setLoading(false);
        }
    }, [router.isReady])

    useEffect(() => {
        if (title !== "" && title.length < 200 && text !== '' && content) {
            setCanSend(true);
        } else {
            setCanSend(false)
        }
    }, [content, title])

    const renderContent = () => {
        if (typeof window !== 'undefined') {
            const localObject = localStorage.getItem('book-' + bookData._id);
            if (localObject) {
                const parseLocalObject = JSON.parse(localStorage.getItem('book-' + bookData._id));
                return parseLocalObject.content
            } else {
                return '<p></p>'
            }
        } else {
            return '<p></p>'
        }
    }

    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({
                emptyEditorClass: 'is-editor-empty',
                placeholder: 'Commencez à écrire votre chapitre ici...'
            })
        ],
        enableInputRules: false,
        onUpdate({editor}) {
            setContent(editor?.getJSON());
            setText(editor?.getText());
            updateTextInLocal(editor?.getText());
            updateContentInLocal(editor?.getJSON());
        },
        content: renderContent()
    })

    const bold = () => {
        return editor.chain().focus().toggleBold().run();
    }

    const italic = () => {
        return editor.chain().focus().toggleItalic().run();
    }

    const editorReadOnly = useEditor({
        extensions: [
            StarterKit,
        ],
        editable: false,
        content: content
    })

    const sendData = (publish) => {
        if(publish){
            setPublishLoading(true);
        }
        else {
            setSaveLoading(true);
        }
        if (canSend) {
            const data = {
                book_id: book._id,
                content: JSON.stringify(content),
                title,
                text,
                publish
            }


            NewChapterService(data)
                .then((res) => {
                    localStorage.removeItem('book-' + bookData._id);
                    router.push('/dashboard/books/' + book._id);
                    if(publish){
                        setPublishLoading(false);
                    }
                    else {
                        setSaveLoading(false);
                    }
                })
                .catch((err) => {
                    if (err.response.data.message === 'Chapter-120') {
                        toastDisplayError('Titre incorrect.');
                    } else {
                        toastDisplayError('Impossible de modifier le chapitre.')
                    }

                    if(publish){
                        setPublishLoading(false);
                    }
                    else {
                        setSaveLoading(false);
                    }
                });
        }

    }

    const updateTitleInLocal = (value) => {
        if (typeof window !== 'undefined') {
            let bookInLocal = JSON.parse(localStorage.getItem('book-' + bookData._id));
            bookInLocal.title = value;
            localStorage.setItem('book-' + bookData._id, JSON.stringify(bookInLocal));
        }
    }

    const updateTextInLocal = (value) => {
        if (typeof window !== 'undefined') {
            let bookInLocal = JSON.parse(localStorage.getItem('book-' + bookData._id));
            bookInLocal.text = value;
            localStorage.setItem('book-' + bookData._id, JSON.stringify(bookInLocal));
        }
    }

    const updateContentInLocal = (content) => {
        if (typeof window !== 'undefined') {
            let bookInLocal = JSON.parse(localStorage.getItem('book-' + bookData._id));
            bookInLocal.content = content;
            localStorage.setItem('book-' + bookData._id, JSON.stringify(bookInLocal));
        }
    }

    useEffect(() => {
        if (typeof window !== 'undefined') {
            let localObject = localStorage.getItem('book-' + bookData._id);
            if (!localObject) {
                const object = {
                    title: '',
                    content: {},
                    text: ''
                }
                localStorage.setItem('book-' + bookData._id, JSON.stringify(object));
            } else {
                const parseLocalObject = JSON.parse(localObject);
                setTitle(parseLocalObject.title);
                setText(parseLocalObject.text);
                setContent(parseLocalObject.content);
            }
        }

    }, [editor])

    return (
        <div className={theme ? styles.container : styles.container + ' ' + styles.dark}>

            <Head>
                <title>Ogla - Nouveau chapitre</title>
                <meta name="description" content="Generated by create next app"/>
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>

            <div className={styles.containerMain}>

                {
                    width < 700 && /*height <= 600 ?*/ orientation === 'portrait' ?
                        <VerticalPhoneMenu/>
                        :
                        <>
                            {
                                width >= 700 && width <= 1050 ?
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
                    err.chapter && !err.book && !loading &&
                    <div className={styles.errContainer}>
                        <ErrorDashboard
                            title={'Impossible de récupérer ce chapitre (ERR-001)'}
                            img={'/assets/diapo/old.png'}
                            subTitle={'Réessayer ou contacter le support pour obtenir de l\'aide...\n' +
                                '\n'}
                        />
                    </div>
                }

                {
                    err.book && !err.chapter && !loading &&
                    <div className={styles.errContainer}>
                        <ErrorDashboard
                            title={'Impossible de récupérer ce chapitre (ERR-002)'}
                            img={'/assets/diapo/old.png'}
                            subTitle={'Réessayer ou contacter le support pour obtenir de l\'aide...\n' +
                                '\n'}
                        />
                    </div>
                }


                {
                    !loading && !err.book && book.length !== 0 &&
                    <div className={styles.containerData}>
                        {
                            width > 1200 &&
                            <div className={styles.header}>
                                <div className={styles.list}>
                                    <HomeIcon/>
                                    <ChevronRightIcon className={styles.arrow}/>
                                    <h6
                                        onClick={() => router.push('/dashboard/books/' + book._id)}
                                    >{book.title}</h6>
                                    <ChevronRightIcon className={styles.arrow}/>
                                    <p>Nouveau chapitre</p>
                                    <ChevronRightIcon className={styles.arrow}/>
                                    <p><span>{book?.chapter_list?.length + 1}</span></p>
                                </div>
                                <div className={styles.btnList}>
                                    <button
                                        className={canSend ? styles.activeSaveBtn : ''}
                                        onClick={() => sendData(false)}
                                    >
                                        {
                                            !saveLoading ?
                                              <>
                                                  Enregistrer en tant que brouillon <ArrowPathIcon/>
                                              </>
                                                :
                                                <LoaderImg/>
                                        }
                                    </button>



                                    <button
                                        className={canSend ? styles.activePublishBtn : ''}
                                        onClick={() => sendData(true)}
                                    >
                                        {
                                            !publishLoading ?
                                                <>
                                                    Publier <CursorArrowRaysIcon/>
                                                </>
                                                :
                                                <LoaderImg/>
                                        }
                                    </button>
                                </div>

                            </div>
                        }
                        {
                            width >= 700 && width <= 1200 &&
                            <div className={styles.headerResp}>
                                <div className={styles.list}>
                                    <HomeIcon className={styles.homeHResp}/>
                                    <ChevronRightIcon className={styles.arrow + ' ' + styles.arrowResp}/>
                                    <h6
                                        onClick={() => router.push('/dashboard/books/' + book._id)}
                                    >{book.title}</h6>
                                    <ChevronRightIcon className={styles.arrow + ' ' + styles.arrowResp}/>

                                    {
                                        width >= 1100 &&
                                        <>
                                            <p className={styles.newPad}>Nouveau chapitre</p>
                                        </>
                                    }

                                </div>
                                <div className={styles.btnList}>
                                    <button
                                        className={canSend ? styles.activeSaveBtn : ''}
                                        onClick={() => sendData(false)}
                                    >
                                        {
                                            !saveLoading ?
<>
    Brouillon <ArrowPathIcon/>
</>
:
                                                <LoaderImg/>
                                        }
                                    </button>


                                    <button
                                        className={canSend ? styles.activePublishBtn : ''}
                                        onClick={() => sendData(true)}
                                    >Publier <CursorArrowRaysIcon/>
                                    </button>
                                </div>


                            </div>

                        }


                        {
                            width > 700 ?
                                <div className={styles.containerSecond}>
                                    <div className={styles.containerText}>
                                        <div className={styles.containerTitle}>
                                            <div className={styles.titleL}>
                                                <p>Chapitre {book.chapter_list.length + 1}</p>
                                                <input
                                                    onChange={(e) => {
                                                        setTitle(e.target.value);
                                                        updateTitleInLocal(e.target.value)
                                                    }}
                                                    value={title}
                                                    name={"title"}
                                                    type={'text'}
                                                    placeholder={'Ajoutez un titre ici'}
                                                />
                                            </div>

                                            <div className={styles.titleR}>
                                                <p>{DateNow()}</p>
                                                <div className={styles.containerImgBook}>
                                                    <img alt={'Image livre Ogla'}
                                                         onError={(e) => e.target.src = GetDefaultBookImgWhenError()}
                                                         src={bookData?.img}/>
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
                                                <img alt={'Image Défaut Ogla'} onError={(e) => e.target.src = '/assets/diapo/book.png'}
                                                     className={styles.bookEditor} src={GetImgPathOfAssets() + 'diapo/book.png'}/>
                                            }

                                        </div>
                                        <div className={styles.text}>

                                            <EditorContent editor={editor}/>
                                        </div>

                                        {
                                            width < 1100 &&
                                            <div className={styles.btnListResp}>
                                                <button
                                                    className={canSend ? styles.activeSaveBtn : ''}
                                                    onClick={() => sendData(false)}
                                                >
                                                    {
                                                        !saveLoading ?
                                                            <>
                                                                Brouillon <ArrowPathIcon/>
                                                            </>
                                                            :
                                                            <LoaderImg/>
                                                    }
                                                </button>


                                                <button
                                                    className={canSend ? styles.activePublishBtn : ''}
                                                    onClick={() => sendData(true)}
                                                >
                                                    {
                                                        !publishLoading ?
<>
    Publier <CursorArrowRaysIcon/>
</>
:
<LoaderImg/>
                                                    }
                                                </button>
                                            </div>
                                        }
                                    </div>
                                    <div className={styles.containerPresentationBook}>
                                        <div onClick={() => router.push('/dashboard/books/' + book._id)}
                                             className={styles.headPresentation}>
                                            <img alt={'Image Livre Ogla'} onError={(e) => e.target.src = GetDefaultBookImgWhenError()} src={book?.img}/>
                                            <h3>{bookData?.title}</h3>
                                        </div>

                                        <div className={styles.summary}>
                                            <p>{Capitalize(bookData?.summary)}</p>
                                        </div>

                                        <div className={styles.statsPresentation}>
                                            <h6>Apprenez à donner vie à vos idées et à captiver vos lecteurs grâce à
                                                notre guide d&apos;écriture...</h6>
                                            <p>Cliquez ici pour en savoir plus !</p>
                                        </div>
                                    </div>
                                </div>

                                :

                                <div className={styles.containerPhone}>
                                    <div className={styles.containerTitlePhone}>
                                        <div className={styles.titleLPhone}>
                                            <h6>Nouveau chapitre</h6>
                                            <p className={styles.new}>{book.title} ({book.chapter_list.length + 1})</p>

                                        </div>

                                        <div className={styles.titleRPhone}>
                                            <p>{DateNow()}</p>
                                            <div className={styles.containerImgBook}>
                                                <img onClick={() => router.push({
                                                    pathname:'/dashboard/books/'+book._id
                                                })} alt={'Image Livre Ogla'} onError={(e) => e.target.src = GetDefaultBookImgWhenError()} src={book?.img}/>
                                            </div>
                                        </div>

                                        <input
                                            onChange={(e) => {
                                                setTitle(e.target.value);
                                                updateTitleInLocal(e.target.value);
                                            }}
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
                                            className={canSend ? styles.activeSaveBtn : ''}
                                            onClick={() => sendData(false)}
                                        >
                                            {
                                                !saveLoading ?
                                                    <>
                                                        Brouillon <ArrowPathIcon/>
                                                    </>
                                                    :
                                                    <LoaderImg/>
                                            }
                                        </button>


                                        <button
                                            className={canSend ? styles.activePublishBtn : ''}
                                            onClick={() => sendData(true)}
                                        >
                                            {
                                                !publishLoading ?
                                                    <>
                                                        Publier <CursorArrowRaysIcon/>
                                                    </> :
                                                    <LoaderImg/>
                                            }
                                        </button>

                                    </div>
                                </div>

                        }

                    </div>
                }
            </div>

        </div>
    )
}

export default NouveauChapitre;