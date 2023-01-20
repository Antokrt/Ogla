import styles from '../../../styles/Pages/Dashboard/NewChapter.module.scss';
import scrollbar from '../../../styles/utils/scrollbar.module.scss';
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import VerticalAuthorMenu from "../../../Component/Menu/VerticalAuthorMenu";
import {getConfigOfProtectedRoute} from "../../api/utils/Config";
import ErrorDashboard from "../../../Component/Dashboard/ErrorDashboard";
import {Placeholder} from "@tiptap/extension-placeholder";
import {
    ArrowRightIcon,
    ChevronDoubleLeftIcon,
    ChevronDoubleRightIcon,
    ChevronRightIcon,
    HomeIcon
} from "@heroicons/react/24/outline";
import {useEditor, EditorContent, extensions} from "@tiptap/react";
import {StarterKit} from "@tiptap/starter-kit";
import DateNow from "../../../utils/Date";
import {ChatBubbleLeftRightIcon} from "@heroicons/react/20/solid";
import CommentaryNewChapter from "../../../Component/Dashboard/CommentaryNewChapter";
import {newChapter} from "../../../service/Dashboard/ChapterAuthorService";
import {data} from "autoprefixer";

export async function getServerSideProps({req,params}){
    const id = params.id;
    const config = await getConfigOfProtectedRoute(req);
    const book = await fetch('http://localhost:3008/author/book/'+ id,config);
    const bookErrData = !book.ok;
    const booksJson = await book.json();

    return {
        props:{
            err:{
                book:bookErrData
            },
            bookData: booksJson,
        }
    }
}

const NouveauChapitre = ({bookData,  err}) => {

    const [loading,setLoading] = useState(true);
    const [book,setBook] = useState(bookData);
    const [title,setTitle] = useState('')
    const [content,setContent] = useState();
    const [text,setText] = useState('');
    const router = useRouter();
    const [closeMenu,setCloseMenu ] = useState(true);


    useEffect(() => {
        if(router.isReady){
            setLoading(false);
        }
    },[router.isReady])


    const editor = useEditor({
        extensions:[
            StarterKit,
            Placeholder.configure({
                emptyEditorClass:'is-editor-empty',
                placeholder:'Commencez à écrire votre chapitre ici...'
            })
        ],
        onUpdate({editor}){
          setContent(editor?.getJSON());
          setText(editor?.getText());
        },
        content:'<p></p>'
    })

    const bold = () => {
       return editor.chain().focus().toggleBold().run();
    }

    const italic = () => {
        return  editor.chain().focus().toggleItalic().run();
    }

    const editorReadOnly = useEditor({
        extensions:[
            StarterKit,
        ],
        editable:false,
        content:content
    })

    const sendData = (publish) => {
        if( title !== "" &&
            title.length < 200 &&
            text !== ''
            && content)
        {
            const data = {
                book_id: book._id,
                content:JSON.stringify(content),
                title,
                text,
                publish
            }

            newChapter(data)
                .then((res) => console.log(res))
                .catch((err) => console.log(err));
        }

        else{
            console.log('small')
        }



    }

    return (
        <div className={styles.container}>
            <div className={styles.containerMain}>
                <div className={styles.verticalMenuContainer}>
                    <VerticalAuthorMenu/>
                </div>

                    {
                        loading &&
                        <div className={styles.errContainer}>
                            <p>Loading</p>
                        </div>
                    }

                    {
                        err.chapter && !loading &&
                        <div className={styles.errContainer}>
                            <ErrorDashboard
                                title={'Impossible de récupérer ce chapitre'}
                                img={'/assets/chara/chara5.png'}
                                link={() => router.push('/dashboard/books/')}
                                btn={'Retour'}
                                subTitle={'Réessayer ou contacter le support pour obtenir de l\'aide...\n' +
                                    '\n'}
                            />
                        </div>

                    }

                    {
                        !loading && !err.book && book.length !== 0 &&
                        <div className={styles.containerData}>
                        <div className={styles.header}>
                            <div className={styles.list}>
                                <HomeIcon/>
                                <ChevronRightIcon className={styles.arrow}/>
                                <h6
                                onClick={() => router.push('/dashboard/books/'+ book._id)}
                                >{book.title}</h6>
                                <ChevronRightIcon className={styles.arrow}/>
                                <p>Nouveau Chapitre</p>
                                <ChevronRightIcon className={styles.arrow}/>
                                <p><span>{book.chapter_list.length + 1 }</span></p>
                            </div>
                            <div className={styles.btnList}>
                                <button
                                    className={styles.draft}
                                    onClick={() => sendData(false)}
                                >Enregistrer en tant que brouillon</button>

                                <button
                                    onClick={() => sendData(true)}
                                >Publier</button>
                            </div>


                        </div>

                            <div className={styles.containerSecond}>

                                <div className={styles.containerText}>
                                    <div onClick={() => setCloseMenu(!closeMenu)}
                                        className={styles.toogleMenuContainer}>
                                        {
                                            closeMenu ?
                                                <ChevronDoubleRightIcon/> :
                                                <ChevronDoubleLeftIcon/>
                                        }
                                    </div>
                                    <div className={styles.containerTitle}>
                                        <div className={styles.titleL}>
                                            <p>Chapitre {book.chapter_list.length + 1 }</p>
                                            <input
                                                onChange={(e) => setTitle(e.target.value)}
                                                name={"title"}
                                                type={'text'}
                                                placeholder={'Ajoutez un titre ici'}
                                            />
                                        </div>

                                        <div className={styles.titleR}>
                                            <p>{DateNow()}</p>
                                        </div>

                                    </div>


                                    <div className={styles.containerTextEditor}>
                                        <button
                                            onClick={() => bold()}
                                            className={editor.isActive('bold') ? styles.bold : ''}>B</button>
                                        <div className={styles.separatorEditor}></div>
                                        <button
                                            onClick={() => italic()}
                                            className={editor.isActive('italic') ? styles.italic : ''}>I</button>
                                        <div className={styles.separatorEditor}></div>
                                    </div>

                                    <div className={styles.text}>
<EditorContent editor={editor}/>
                                    </div>
                                </div>

                                {
                                    closeMenu ?
                                        <div className={styles.containerCommentary}>
                                            <div className={styles.headerCommentary}>
                                                <p>Dernier chapitre : {DateNow()}</p>
                                                <h5>Le méchant troubadour</h5>
                                            </div>
                                            <h6> <ChatBubbleLeftRightIcon/>Commentaires du dernier chapitre</h6>

                                            <div className={styles.listCommentary + ' ' + scrollbar.scrollbar}>
                                                <CommentaryNewChapter
                                                    content={'J\'aime beaucoup ce chapitre qui me rappelle mon enfance en Normandie avec mon chat et mon frère josué.\n' +
                                                        '\nJ\'aime beaucoup ce chapitre qui me rappelle mon enfance en Normandie avec mon chat et mon frère josué.\n' +
                                                        '\nJ\'aime beaucoup ce chapitre qui me rappelle mon enfance en Normandie avec mon chat et mon frère josué.\n' +
                                                        '\nJ\'aime beaucoup ce chapitre qui me rappelle mon enfance en Normandie avec mon chat et mon frère josué.\n' +
                                                        '\nJ\'aime beaucoup ce chapitre qui me rappelle mon enfance en Normandie avec mon chat et mon frère josué.\n' +
                                                        '\nJ\'aime beaucoup ce chapitre qui me rappelle mon enfance en Normandie avec mon chat et mon frère josué.\n' +
                                                        '\n'}
                                                    img={'/assets/profil-example.png'}
                                                    pseudo={'Jimmy Lefuté'}
                                                    date={DateNow()}
                                                    likes={279}
                                                />

                                                <CommentaryNewChapter
                                                    content={'J\'aime beaucoup ce chapitre qui me rappelle mon enfance en Normandie avec mon chat et mon frère josué.\n' +
                                                        '\nJ\'aime beaucoup ce chapitre qui me rappelle mon enfance en Normandie avec mon chat et mon frère josué.\n' +
                                                        '\nJ\'aime beaucoup ce chapitre qui me rappelle mon enfance en Normandie avec mon chat et mon frère josué.\n' +
                                                        '\nJ\'aime beaucoup ce chapitre qui me rappelle mon enfance en Normandie avec mon chat et mon frère josué.\n' +
                                                        '\nJ\'aime beaucoup ce chapitre qui me rappelle mon enfance en Normandie avec mon chat et mon frère josué.\n' +
                                                        '\nJ\'aime beaucoup ce chapitre qui me rappelle mon enfance en Normandie avec mon chat et mon frère josué.\n' +
                                                        '\n'}
                                                    img={'/assets/profil-example.png'}
                                                    pseudo={'Jimmy Lefuté'}
                                                    date={DateNow()}
                                                    likes={279}
                                                />

                                                <CommentaryNewChapter
                                                    content={'J\'aime beaucoup ce chapitre qui me rappelle mon enfance en Normandie avec mon chat et mon frère josué.\n' +
                                                        '\nJ\'aime beaucoup ce chapitre qui me rappelle mon enfance en Normandie avec mon chat et mon frère josué.\n' +
                                                        '\nJ\'aime beaucoup ce chapitre qui me rappelle mon enfance en Normandie avec mon chat et mon frère josué.\n' +
                                                        '\nJ\'aime beaucoup ce chapitre qui me rappelle mon enfance en Normandie avec mon chat et mon frère josué.\n' +
                                                        '\nJ\'aime beaucoup ce chapitre qui me rappelle mon enfance en Normandie avec mon chat et mon frère josué.\n' +
                                                        '\nJ\'aime beaucoup ce chapitre qui me rappelle mon enfance en Normandie avec mon chat et mon frère josué.\n' +
                                                        '\n'}
                                                    img={'/assets/profil-example.png'}
                                                    pseudo={'Jimmy Lefuté'}
                                                    date={DateNow()}
                                                    likes={279}
                                                />

                                                <CommentaryNewChapter
                                                    content={'J\'aime beaucoup ce chapitre qui me rappelle mon enfance en Normandie avec mon chat et mon frère josué.\n' +
                                                        '\nJ\'aime beaucoup ce chapitre qui me rappelle mon enfance en Normandie avec mon chat et mon frère josué.\n' +
                                                        '\nJ\'aime beaucoup ce chapitre qui me rappelle mon enfance en Normandie avec mon chat et mon frère josué.\n' +
                                                        '\nJ\'aime beaucoup ce chapitre qui me rappelle mon enfance en Normandie avec mon chat et mon frère josué.\n' +
                                                        '\nJ\'aime beaucoup ce chapitre qui me rappelle mon enfance en Normandie avec mon chat et mon frère josué.\n' +
                                                        '\nJ\'aime beaucoup ce chapitre qui me rappelle mon enfance en Normandie avec mon chat et mon frère josué.\n' +
                                                        '\n'}
                                                    img={'/assets/profil-example.png'}
                                                    pseudo={'Jimmy Lefuté'}
                                                    date={DateNow()}
                                                    likes={279}
                                                />
                                            </div>
                                        </div> :
                                        <div className={styles.closedMenuContainer}>
                                        </div>
                                }
                            </div>

                        </div>
                    }
            </div>

        </div>
    )
}

export default NouveauChapitre;