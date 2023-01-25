import urlSlug, {revert} from "url-slug";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {getPost} from "../../services/Post";
import styles from "../../styles/Pages/BookPage.module.scss";
import Header from "../../Component/Header";
import CategoryHeader from "../../Component/Category/CategoryHeader";
import {
    ArrowsUpDownIcon,
    ChatBubbleBottomCenterTextIcon,
    DocumentTextIcon
} from "@heroicons/react/24/outline";
import {HeartIcon} from "@heroicons/react/20/solid";
import Book from "../../Component/layouts/Icons/Book";
import Like from "../../Component/layouts/Icons/Like";
import ToogleSidebar from "../../utils/ToogleSidebar";
import SidebarCommentary from "../../Component/Post/SidebarCommentary";
import SidebarChapter from "../../Component/Post/SidebarChapter";
import FooterOnBook from "../../Component/Post/FooterOnBook";
import {useSession} from "next-auth/react";
import {VerifLikeService} from "../../service/Like/VerifLikeService";
import {getToken} from "next-auth/jwt";
import {getConfigOfProtectedRoute} from "../api/utils/Config";
import {LikeBookService} from "../../service/Like/LikeService";
import {VerifLike, VerifLikeApi} from "../api/like";
import {GetOneBookApi} from "../api/book";


export async function getServerSideProps({req,params}){
    const id = params.id;
    const data = await GetOneBookApi(id);
    const hasLikeJson = await VerifLikeApi(req,'book',data.book._id);

    return {
        props:{
            err:{
                book:data.err
            },
            bookData: data?.book,
            chapterData: data?.chapter,
            hasLikeData:hasLikeJson
        }
    }
}


const Post = ({bookData,chapterData,err, hasLikeData}) => {

    const router = useRouter();
    const [sidebarSelect, setSidebarSelect] = useState("Disable");
    const checkSide = () => {
        switch (sidebarSelect){
            case 'Commentary':
                return (
                    <div
                        className={sidebarSelect !== "None" ? styles.slideInRight + " " + styles.sidebar : styles.slideOut + " " + styles.sidebar}>
                        <SidebarCommentary select={sidebarSelect}/>
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
                        <SidebarChapter title={bookData?.title} chapters={chapterData} select={sidebarSelect}/>
                    </div>
                )
                break;

            default:
                return (
                    <div className={styles.slideOut + " " + styles.sidebar}>
                    </div>
                )
        }

    }

    const [likes,setLikes] = useState(bookData?.likes);
    const [hasLike, setHasLike] = useState(hasLikeData);
    const {data: session} = useSession();

    const likeBook = () => {
        if(session){
            LikeBookService(bookData._id)
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

    return (
        <div className={styles.container}>

            <Header/>

            {
                checkSide()
            }

            <div className={styles.containerC}>

                <div className={styles.imgContainer}>
                    <div className={styles.img}>
                        <img src={process.env.NEXT_PUBLIC_BASE_IMG_BOOK + bookData?.img}/>
                    </div>

                    <div className={styles.btnContainer}>
                        <div
                            onClick={() => likeBook()}
                            className={styles.btnItem}>
                            <HeartIcon className={styles.cursor}/>
                            <p>({likes})</p>
                        </div>
                        <div className={styles.btnItem}>
                            <DocumentTextIcon/>
                            <p>({chapterData?.length})</p>

                        </div>

                        <div className={styles.btnItem}>
                            <ChatBubbleBottomCenterTextIcon className={styles.cursor}/>
                            <p>(32)</p>

                        </div>


                    </div>


                    <div className={styles.btnRead}>
                        <button>Lire le chapitre 1</button>
                    </div>
                </div>


                <div className={styles.chapterContainer}>
                    <div className={styles.infoContainer}>
                        <h4> {bookData?.category} | Par : <span onClick={() => {
                            router.push("/auteur/" + bookData?.author_pseudo)
                        }}>{bookData?.author_pseudo}</span></h4>
                        <h3>{bookData?.title}</h3>
                        <p className={styles.snippet}> {bookData?.summary}</p>
                        <div className={styles.btnFilter}>
                            <button>Trier <ArrowsUpDownIcon/></button>
                            <div><p>({chapterData?.length})</p>
                                <Book/>
                            </div>
                        </div>
                    </div>

                    <div className={styles.contentChapterList}>
                        {
                            chapterData &&
                            chapterData.map((item, index) => {
                                return (
                                    <div
                                        onClick={() => {
                                            router.push({
                                                pathname: "/chapitre/" + item._id,
                                                query:{
                                                    name:bookData.title,
                                                    slug:item.title,
                                                    i:index+ 1
                                                },
                                            })
                                        }}
                                        className={styles.chapter}>
                                        <div className={styles.headerChapter}>
                                            <h6>{item.title}</h6>
                                            <h7>{item.date_creation}</h7>
                                        </div>

                                        <div className={styles.likeChapter}>
                                            <Like/>
                                            <p>({item.likes})</p>

                                        </div>
                                    </div>

                                )
                            })
                        }


                    </div>
                </div>

            </div>
            <FooterOnBook
                title={bookData?.title}
                like={bookData?.likes}
                nbCommentary={28}
                author={bookData?.author_pseudo}
                nbChapter={chapterData?.length}
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

export default Post;

