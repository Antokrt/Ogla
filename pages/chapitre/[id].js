import {useEffect, useLayoutEffect, useRef, useState} from "react";
import {getPost} from "../../services/Post";
import {useRouter} from "next/router";
import Header from "../../Component/Header";
import styles from "../../styles/Pages/ChapterPage.module.scss";
import scroll from "../../styles/utils/scrollbar.module.scss";
import {HeartIcon, UserCircleIcon} from "@heroicons/react/20/solid";
import {TagIcon} from "@heroicons/react/24/solid";
import {BookOpenIcon} from "@heroicons/react/24/solid";
import FooterOnChapter from "../../Component/Post/FooterOnChapter";
import SidebarPost from "../../Component/Post/SidebarCommentary";
import SidebarCommentary from "../../Component/Post/SidebarCommentary";
import SidebarChapter from "../../Component/Post/SidebarChapter";
import FooterOnBook from "../../Component/Post/FooterOnBook";
import ToogleSidebar from "../../utils/ToogleSidebar";
import HeaderOnChapter from "../../Component/Post/HeaderOnChapter";
import {EditorContent, useEditor} from "@tiptap/react";
import {StarterKit} from "@tiptap/starter-kit";

export async function getServerSideProps({req,params,query}){
    const id = params.id;
    const chapter = await fetch('http://localhost:3008/chapter-render/one/'+ id);
    const chapterErrData = !chapter.ok;
    let chapterJson = await chapter.json();

    if(chapterJson.statusCode === 404){
        chapterJson = null;
    }

    return {
        props:{
            err:{
                chapter:chapterErrData
            },
            chapterData: chapterJson.chapter,
            bookData: chapterJson.book,
            index:query.i,
            author:chapterJson.author
        }
    }
}

const Chapter = ({chapterData,bookData, author, err,index}) => {

    const router = useRouter();
    const headerFixed = useRef();
    const fHeader = useRef();
    const [hasToBeFixed, setHasToBeFixed] = useState(false);
    const [openSideBar, setOpenSidebar] = useState(false);
    const [sidebarSelect, setSidebarSelect] = useState("Disable");

    useLayoutEffect(() => {
        console.log(author)
        const divAnimate = headerFixed.current.getBoundingClientRect().top;
        const onScroll = (div) => {
            if (div < window.scrollY) {
                setHasToBeFixed(true);
            } else {
                setHasToBeFixed(false);
            }
        };

        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const editorReadOnly = useEditor({
        extensions:[
            StarterKit,
        ],
        editable:false,
        content:JSON.parse(chapterData?.content)
    })

    return (
        <div className={styles.container}>
            {
                 sidebarSelect === "Commentary" &&
                <div
                    className={sidebarSelect !== "None" ? styles.slideInRight + " " + styles.sidebar : styles.slideOut + " " + styles.sidebar}>
                    <SidebarCommentary select={sidebarSelect}/>
                </div>
            }

            {
                 sidebarSelect === "None" &&
                <div className={styles.slideOut + " " + styles.sidebar}>
                </div>
            }

            {
                sidebarSelect === "List" &&
                <div
                    className={sidebarSelect !== "None" ? styles.slideInRight + " " + styles.sidebar : styles.slideOut + " " + styles.sidebar}>
                    <SidebarChapter select={sidebarSelect}/>
                </div>
            }

            <div>
                <Header/>
                <HeaderOnChapter/>
            </div>

            <div
                className={styles.containerC}>

                <div
                    className={hasToBeFixed ? styles.fixedActive + " " + styles.bannerChapter : styles.fixedInitial + " " + styles.bannerChapter}
                    ref={headerFixed}
                >
                    <h3>Chapitre 1 - {bookData.title}</h3>

                    <div className={styles.thumbnailContainer}>
                        <p className={styles.category}><span>{bookData.category}</span><TagIcon/></p>
                        <p className={styles.mSide}>{chapterData.likes} <HeartIcon/></p>
                        <p>{bookData.chapter_list.length} chapitre(s) <BookOpenIcon/></p>
                    </div>
                </div>

                <div
                    className={styles.contentChapter}>
                    <div className={styles.headerContent}>
                        <h5>{chapterData.title}</h5>
                        <h6><img src={author.img} />{bookData.author_pseudo}</h6>
                    </div>
                    <div className={styles.nextChapterContainer}>

                    </div>

                    <div className={styles.textContainer}>
                        <EditorContent editor={editorReadOnly}>
                        </EditorContent>
                    </div>

                </div>

            </div>


            <FooterOnChapter
                openList={() => {
                    ToogleSidebar("List",sidebarSelect,setSidebarSelect);
                }}

                openCommentary={() => {
                    ToogleSidebar("Commentary",sidebarSelect,setSidebarSelect);
                }}
                img={"/assets/livre2.jpg"}/>
        </div>
    )
}

export default Chapter;