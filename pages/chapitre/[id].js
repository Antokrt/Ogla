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
import {LikeBookService, LikeChapterService} from "../../service/Like/LikeService";
import {GetCommentService} from "../../service/Comment/CommentService";
import {GetAnswerByCommentService} from "../../service/Answer/AnswerService";
import {DeleteAnswerReduce, LikeAnswerReduce, LikeCommentReduce, SendAnswerReduce} from "../../utils/CommentaryUtils";

export async function getServerSideProps({req,params,query}){
    const id = params.id;
    const data = await GetOneChapterApi(id);
    const hasLike = await VerifLikeApi(req,'chapter',data.chapter._id);
    return {
        props:{
            err:data.err,
            chapterData: data.chapter,
            bookData: data.book,
            chapterList: data.chapterList,
            index:parseInt(query.i),
            authorData:data.author,
            hasLikeData:hasLike
        }
    }
}

const Chapter = ({chapterData,bookData, chapterList, authorData, err,index,hasLikeData}) => {

    const router = useRouter();
    const headerFixed = useRef();
    const [hasToBeFixed, setHasToBeFixed] = useState(false);
    const [likes,setLikes] = useState(chapterData?.likes);
    const [hasToScroll,setHasToScroll] = useState(false);
    const [hasLike, setHasLike] = useState(hasLikeData);
    const [nbCommentary, setNbCommentary] = useState(chapterData?.nbCommentary);
    const [lastCommentId,setLastCommentId]= useState([]);
    const [sidebarSelect, setSidebarSelect] = useState("Disable");
    const {data: session} = useSession();
    const [comments,setComments] = useState([]);
    const [page,setPage] = useState(1);
    const [size,setSize] = useState(1);


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

    const checkSide = () => {
        switch (sidebarSelect){
            case 'Commentary':
                if(comments.length === 0){
                    getComment(page,1);
                }
                return (
                    <div
                        className={sidebarSelect !== "None" ? styles.slideInRight + " " + styles.sidebar : styles.slideOut + " " + styles.sidebar}>
                        <SidebarCommentary
                            limit={size}
                            page={page}
                            refresh={() => {
                                getComment(page, 1);
                            }}
                            scrollChange={hasToScroll}
                            likeAComment={(id) => likeComment(id)}
                            createNewComment={(res) => newComment(res)}
                            deleteAComment={(id) => deleteComment(id)}
                            seeMore = {() => getComment(page)}
                            sendANewAnswer={(data) => sendAnswer(data)}
                            deleteAnswer={(id) => deleteAnswer(id)}
                            likeAnswer={(id) => likeAnswer(id)}
                            newPageAnswer={(id) => loadMoreAnswer(id)}
                            type={'chapter'}
                            typeId={chapterData._id}
                            title={chapterData.title}
                            author={chapterData.author_pseudo}
                            comments={comments}
                            select={sidebarSelect}/>
                    </div>
                )
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
                        <SidebarChapter title={bookData?.title} chapters={chapterList} select={sidebarSelect}/>
                    </div>
                )
                break;

            default:
                return (
                    <div></div>
                )
        }
    }

    const getComment =  () => {
        GetCommentService('chapter',chapterData._id, page, 1, session)
            .then((res) => {
                if(res.length !== 0){
                    setPage(page + 1);
                }
                res.forEach(element => {
                    if(!lastCommentId.includes(element._id)){
                        setComments((prevState)=> ([
                            ...prevState,
                            element
                        ]))
                    }
                })
            })
            .then(() => {
                if(comments.length !== 0){
                    setTimeout(() =>         setHasToScroll(!hasToScroll),50)
                }
            })
            .catch((err) => console.log(err))
    }

    const likeComment = (id) => {
        setComments(LikeCommentReduce(id,comments));
    }

    const newComment = (res) => {
        setComments((prevState)=> [
            ...prevState,
            res
        ])

        setLastCommentId(prevState => [
            ...prevState,
            res._id
        ])

        setPage((page + 1));
        setNbCommentary(nbCommentary + 1);

        setTimeout(() =>         setHasToScroll(!hasToScroll),10)
    }

    const deleteComment = (id) => {
        setComments((list) => list.filter((item) => item._id !== id))
        setPage(page - 1);
        setNbCommentary(nbCommentary - 1);
    }

    const sendAnswer = (data) => {
        setComments(SendAnswerReduce(comments,data.target_id,data));
    };

    const deleteAnswer = (id) => {
        setComments(DeleteAnswerReduce(comments,id));
    };


    const likeAnswer = (replyId) => {
        setComments(LikeAnswerReduce(comments,replyId));
    }

    const loadMoreAnswer = (id) => {
        const newState = [...comments];
        const target = newState.find(obj => obj._id === id);
        if (target) {
            GetAnswerByCommentService(id,target.answersPage,1, session)
                .then((res) => {
                    if(res.data.length > 0){
                        target.answersPage += 1;
                        target.answers = [...target.answers, ...res.data];
                    }
                })
                .then(() => setComments(newState))
        }
    }


    return (
        <div className={styles.container}>
            {
                checkSide()
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
                    <h3>Chapitre {index} - {chapterData.title}</h3>
                    <p>{chapterData._id}</p>

                    <div className={styles.thumbnailContainer}>
                        <p className={styles.category}><span>{bookData.category}</span><TagIcon/></p>
                        <p className={styles.mSide}>{likes} <HeartIcon/></p>
                        <p>{bookData.chapter_list.length} chapitre(s) <BookOpenIcon/></p>
                    </div>
                </div>

                <div
                    className={styles.contentChapter}>
                    <div className={styles.headerContent}>
                        <h5>{bookData.title}</h5>
                        <h6><img src={authorData.img} referrerPolicy={'no-referrer'} />{authorData.pseudo}</h6>
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
                nbCommentary={nbCommentary}
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