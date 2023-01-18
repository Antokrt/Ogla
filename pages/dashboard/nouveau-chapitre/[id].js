import styles from '../../../styles/Pages/Dashboard/NewChapter.module.scss';
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import VerticalAuthorMenu from "../../../Component/Menu/VerticalAuthorMenu";
import {getConfigOfProtectedRoute} from "../../api/utils/Config";
import ErrorDashboard from "../../../Component/Dashboard/ErrorDashboard";
import {ArrowRightIcon, ChevronRightIcon, HomeIcon} from "@heroicons/react/24/outline";
import {useEditor, EditorContent, extensions} from "@tiptap/react";
import {StarterKit} from "@tiptap/starter-kit";
import {generateHTML} from "@tiptap/react";

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

const NouveauChapitre = ({bookData, err}) => {

    const [loading,setLoading] = useState(true);
    const [book,setBook] = useState(bookData);
    const [content,setContent] = useState({
        "type": "doc",
        "content": [
            {
                "type": "paragraph",
                "content": [
                    {
                        "type": "text",
                        "marks": [
                            {
                                "type": "bold"
                            }
                        ],
                        "text": "Hessyy"
                    }
                ]
            }
        ]
    });
    const router = useRouter();

    useEffect(() => {
        if(router.isReady){
            setLoading(false);
        }
    },[router.isReady])

useEffect(() => {
    console.log(content)
},[])

    const editor = useEditor({
        extensions:[
            StarterKit,
        ],
        onUpdate({editor}){
            console.log(editor.getJSON());
          setContent(editor?.getJSON());
        },
        content:'<p>Hessyy</p>'
    })

    const editorReadOnly = useEditor({
        extensions:[
            StarterKit,
        ],
        editable:false,
        content:content
    })

    return (
        <div className={styles.container}>
            <div className={styles.containerMain}>
                <div className={styles.verticalMenuContainer}>
                    <VerticalAuthorMenu/>
                </div>
                <div className={styles.containerData}>
                    {
                        loading &&
                        <p>Loading</p>
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
                            <button
                            onClick={() => {console.log(content)}}
                            >Publier</button>
                        </div>

                            <div className={styles.containerSecond}>
                                <div className={styles.containerText}>
                                    <div className={styles.containerTextEditor}>
                                        <h4></h4>
                                        <button
                                        onClick={() => editor.chain().focus().toggleBold().run()}
                                        disabled={
                                            !editor.can()
                                                .chain()
                                                .focus()
                                                .toggleBold()
                                                .run()
                                        }
                                        >Bold</button>
                                        <EditorContent editor={editor}/>

                                    </div>
                                </div>
                                    <EditorContent editor={editorReadOnly}/>

                            </div>

                        </>
                    }
                </div>

            </div>

        </div>
    )
}

export default NouveauChapitre;