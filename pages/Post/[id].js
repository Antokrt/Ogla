import urlSlug, {revert} from "url-slug";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {getPost} from "../../services/Post";
import styles from "../../styles/Pages/BookPage.module.scss";
import Header from "../../Component/Header";
import CategoryHeader from "../../Component/Category/CategoryHeader";
import {
    ArrowDownIcon,
    ArrowsUpDownIcon,
    BookOpenIcon, ChatBubbleBottomCenterTextIcon,
    ChevronDoubleUpIcon,
    DocumentTextIcon
} from "@heroicons/react/24/outline";
import {HeartIcon} from "@heroicons/react/20/solid";
import Book from "../../Component/layouts/Icons/Book";
import Like from "../../Component/layouts/Icons/Like";
import ToogleSidebar from "../../utils/ToogleSidebar";
import Sort from "../../Component/layouts/Icons/Sort";
import SidebarCommentary from "../../Component/Post/SidebarCommentary";
import SidebarChapter from "../../Component/Post/SidebarChapter";
import FooterOnChapter from "../../Component/Post/FooterOnChapter";
import FooterOnBook from "../../Component/Post/FooterOnBook";


const Post = (props) => {

    const [post, setPost] = useState({});
    const router = useRouter();
    const [slug, setSlug] = useState(router.query.id);
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
    const [sortDown, setSortDown] = useState(false);
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
                    <SidebarChapter select={sidebarSelect}/>
                </div>
            }


            <div className={styles.containerC}>

                <div className={styles.imgContainer}>
                    <div className={styles.img}>
                        <img src={post?.img}/>
                    </div>

                    <div className={styles.btnContainer}>
                        <div className={styles.btnItem}>
                            <HeartIcon className={styles.cursor}/>
                            <p>({post?.like})</p>
                        </div>
                        <div className={styles.btnItem}>
                            <DocumentTextIcon/>
                            <p>({chapterList.length})</p>

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
                        <h4> {post?.category} | Par : <span onClick={() => {
                            router.push("/auteur/" + post.author)
                        }}>{post?.author}</span></h4>
                        <h3>{post?.title}</h3>
                        <p className={styles.snippet}> {post?.snippet}</p>
                        <div className={styles.btnFilter}>
                            <button>Trier <ArrowsUpDownIcon/></button>
                            <div><p>({chapterList.length})</p>
                                <Book/>
                            </div>
                        </div>
                    </div>

                    <div className={styles.contentChapterList}>
                        {
                            chapterList.map((item, index) => {
                                return (
                                    <div
                                        onClick={() => {
                                            router.push("/Chapter/" + urlSlug(item.title))
                                        }}
                                        className={styles.chapter}>
                                        <div className={styles.headerChapter}>
                                            <h6>{item.title}</h6>
                                            <h7>{item.date}</h7>
                                        </div>

                                        <div className={styles.likeChapter}>
                                            <Like/>
                                            <p>({item.like})</p>

                                        </div>
                                    </div>

                                )
                            })
                        }


                    </div>
                </div>

            </div>
            <FooterOnBook
                title={post?.title}
                like={post?.like}
                nbCommentary={32}
                author={post?.author}
                nbChapter={chapterList?.length}
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

