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


export async function getServerSideProps({req,params}){
    const id = params.id;
    const book = await fetch('http://localhost:3008/book-render/one/'+ id);
    const bookErrData = !book.ok;
    let booksJson = await book.json();

    if(booksJson.statusCode === 404){
        booksJson = null;
    }
    return {
        props:{
            err:{
                book:bookErrData
            },
            bookData: booksJson.book,
            chapterData: booksJson.chapter,
        }
    }
}


const Post = ({bookData,chapterData,err}) => {

    const [post, setPost] = useState({});
    const router = useRouter();
    const [chapterList, setChapterList] = useState([
        {
            title: "Chapitre 1 - Le commencement",
            like: 67,
            date: "18/08/22"
        },
        {
            title: "Chapitre 1 - Le commencement",
            like: 67,
            date: "18/08/22"
        }, {
            title: "Chapitre 1 - Le commencement",
            like: 67,
            date: "18/08/22"
        }, {
            title: "Chapitre 1 - Le commencement",
            like: 67,
            date: "18/08/22"
        }, {
            title: "Chapitre 1 - Le commencement",
            like: 67,
            date: "18/08/22"
        }, {
            title: "Chapitre 1 - Le commencement",
            like: 67,
            date: "18/08/22"
        }, {
            title: "Chapitre 1 - Le commencement",
            like: 67,
            date: "18/08/22"
        }, {
            title: "Chapitre 1 - Le commencement",
            like: 67,
            date: "18/08/22"
        }, {
            title: "Chapitre 1 - Le commencement",
            like: 67,
            date: "18/08/22"
        }, {
            title: "Chapitre 1 - Le commencement",
            like: 67,
            date: "18/08/22"
        }, {
            title: "Chapitre 1 - Le commencement",
            like: 67,
            date: "18/08/22"
        },
        {
            title: "Chapitre 2 - Découverte macabre",
            like: 107,
            date: "18/08/22"
        },
        {
            title: "Chapitre 3 - N'oublies pas ton manteau",
            like: 11,
            date: "18/08/22"
        },
        {
            title: "Chapitre 4 - Pierre qui mousse...",
            like: 89,
            date: "18/08/22"
        },
        {
            title: "Chapitre 5 - Une classé sur R6",
            like: 27,
            date: "18/08/22"
        },
        {
            title: "Chapitre 6 - Un Zebu pas concentré",
            like: 21,
            date: "18/08/22"
        }
    ]);
    useEffect(() => {
        if (router.isReady) {
            getPost(router.query.id)
                .then((res) => setPost(res))
                .catch((err) => console.log(err))
        }
    }, [router.isReady]);


    const [sidebarSelect, setSidebarSelect] = useState("Disable");



    return (
        <div className={styles.container}>
            <Header/>

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
                    <SidebarChapter title={bookData?.title} chapters={chapterData} select={sidebarSelect}/>
                </div>
            }


            <div className={styles.containerC}>

                <div className={styles.imgContainer}>
                    <div className={styles.img}>
                        <img src={process.env.NEXT_PUBLIC_BASE_IMG_BOOK + bookData?.img}/>
                    </div>

                    <div className={styles.btnContainer}>
                        <div className={styles.btnItem}>
                            <HeartIcon className={styles.cursor}/>
                            <p>({bookData?.likes})</p>
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
                            <div><p>({chapterData.length})</p>
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

