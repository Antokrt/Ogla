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
import {getConfigOfProtectedRoute} from "../api/utils/Config";
import {GetOneChapterApi} from "../api/chapter";
import {VerifLike, VerifLikeApi} from "../api/like";
import {useSession} from "next-auth/react";
import {LikeChapterService} from "../../service/Like/LikeService";

export async function getServerSideProps({req,params,query}){
    const id = params.id;
    const data = await GetOneChapterApi(id);
    const hasLike = await VerifLikeApi(req,'chapter',data.chapter._id);
    return {
        props:{
            err:data.err,
            chapterData: data.chapter,
            bookData: data.book,
            index:parseInt(query.i),
            authorData:data.author,
            hasLikeData:hasLike
        }
    }
}

const Chapter = ({chapterData,bookData, authorData, err,index,hasLikeData}) => {

    const headerFixed = useRef();
    const [hasToBeFixed, setHasToBeFixed] = useState(false);
    const [sidebarSelect, setSidebarSelect] = useState("Disable");
    const [likes,setLikes] = useState(bookData?.likes);
    const [hasLike, setHasLike] = useState(hasLikeData);
    const {data: session} = useSession();

    const likeChapter = () => {
        if(session){
            LikeChapterService(chapterData._id)
                .then((res) => setHasLike(!hasLike))
                .then(() => {
                    if(hasLike){
                        setLikes(likes - 1);
                    }
                    else{
                        setLikes(likes + 1);
                    }
                })
                .catch((err) => console.log(err));
        }
    }


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
                    <h3>Chapitre {index} - {bookData.title}</h3>

                    <div className={styles.thumbnailContainer}>
                        <p className={styles.category}><span>{bookData.category}</span><TagIcon/></p>
                        <p className={styles.mSide}>{likes} <HeartIcon/></p>
                        <p>{bookData.chapter_list.length} chapitre(s) <BookOpenIcon/></p>
                    </div>
                </div>

                <div
                    className={styles.contentChapter}>
                    <div className={styles.headerContent}>
                        <h5>{chapterData.title}</h5>
                        <h6><img src={authorData.img} />{authorData.pseudo}</h6>
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
                likeChapter={() => likeChapter()}
                title={chapterData?.title}
                likes={likes}
                index={index}
                author={bookData?.author_pseudo}
                nbChapter={bookData?.chapter_list.length}
                openList={() => {
                    ToogleSidebar("List",sidebarSelect,setSidebarSelect);
                }}

                openCommentary={() => {
                    ToogleSidebar("Commentary",sidebarSelect,setSidebarSelect);
                }}
                img={process.env.NEXT_PUBLIC_BASE_IMG_BOOK + bookData?.img}/>
        </div>
    )
}

export default Chapter;