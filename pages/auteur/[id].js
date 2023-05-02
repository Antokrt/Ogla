import styles from '../../styles/Pages/User/ByUser.module.scss';

import {useRouter} from "next/router";
import React, {useEffect, useState} from "react";
import {getData, getPost, getPostByUser} from "../../services/Post";
import Header from "../../Component/Header";
import {FireIcon,} from "@heroicons/react/24/outline";
import MainSearchBar from "../../Component/MainSearchBar";
import FeaturedCategoryPostList from "../../Component/Post/FeaturedCategoryPostList";
import PreviewPost from "../../Component/Post/PreviewPost";
import Instagram from "../../Component/layouts/Icons/Social/instagram";
import Facebook from "../../Component/layouts/Icons/Social/facebook";
import Twitter from "../../Component/layouts/Icons/Social/twitter";
import {GetAuthorProfilAPI} from "../api/Author";
import {FormatDateNb} from "../../utils/Date";
import {GetBooksByAuthorService} from "../../service/Author";
import {CardBookPublic} from "../../Component/Card/CardBook";
import Footer from "../../Component/Footer";
import {Snippet} from "../../Component/Snippet";
import CardCategory from "../../Component/Card/CardCategory";
import {ListCard} from "../../Component/Card/ListCard";
import {LoaderCommentary} from "../../Component/layouts/Loader";
import ScreenSize from "../../utils/Size";


export async function getServerSideProps({params}) {

    const pseudo = params.id;
    const profil = await GetAuthorProfilAPI(pseudo);

    return {
        props: {
            profilData: profil.profil,
            booksData: profil.books,
            errProfil: profil.errProfil,
            errBooks: profil.errBook
        }
    }
}

const AuthorProfil = ({profilData, booksData, errProfil, errBooks}) => {

    const [profilAuthor, setProfilAuthor] = useState(profilData);
    const router = useRouter();
    const [page, setPage] = useState(2);
    const [activeFilter, setActiveFilter] = useState('popular');
    const [canSeeMore, setCanSeeMore] = useState(true);
    const [canSeeMoreRecent, setCanSeeMoreRecent] = useState(true);
    const [loading,setLoading] = useState(false);
    const [canSeeMorePopular, setCanSeeMorePopular] = useState(true);
    const [pagePopular, setPagePopular] = useState(2);
    const [pageRecent, setPageRecent] = useState(1);
    const [popular, setPopular] = useState(booksData);
    const [line,setLine] = useState(12);
    const [recent, setRecent] = useState([]);
    const [maxSize, setMaxSize] = useState(1600);
    const [width, height] = ScreenSize();


    const fetchRecentBooks = () => {
        setLoading(true)
        GetBooksByAuthorService(profilAuthor.pseudo, 'recent', 1)
            .then((res) => {
                if (res.length !== 0) {
                    setRecent(res)
                    setPageRecent(2);
                } else {
                    setCanSeeMoreRecent(false);
                }
            })
            .then(() => setLoading(false))
            .catch((err) => {
                setLoading(false);
                setCanSeeMoreRecent(false);
            });
    }


    const fetchMorePopularBooks = () => {
        setLoading(true);
        GetBooksByAuthorService(profilAuthor.pseudo, 'popular', pagePopular)
            .then((res) => {
                if (res.length !== 0) {
                    setPopular(prevState => [...prevState, ...res]);
                    setPagePopular(pagePopular + 1);
                } else {
                    setCanSeeMorePopular(false);
                }
            })
            .then(() => setLoading(false))
            .catch((err) => {
                setLoading(false);
                setCanSeeMorePopular(false);
            });
    }

    const fetchMoreRecentBooks = () => {
        setLoading(true);
        GetBooksByAuthorService(profilAuthor.pseudo, 'recent', pageRecent)
            .then((res) => {
                if (res.length !== 0) {
                    setRecent(prevState => [...prevState, ...res]);
                    setPageRecent(pageRecent + 1);
                } else {
                    setCanSeeMoreRecent(false);
                }
            })
            .then(() => setLoading(false))
            .catch((err) => {
                setLoading(false);
                setCanSeeMoreRecent(false)
            });
    }

    useEffect(() => {
        if(width < 1300){
            setMaxSize(1000);
            setLine(8)
        }
    },[width])


    return (
        <div className={styles.container}>
            <Header/>

            {
                profilData && !errProfil &&
                <>
                    <div className={styles.containerF}>

                        <div className={styles.imgContainer}>
                            <div className={styles.img}>
                                <img referrerPolicy={'no-referrer'} src={profilAuthor?.img}/>
                            </div>

                            <div className={styles.profil}>
                                <Instagram/>
                                <Facebook/>
                                <Twitter/>
                            </div>

                            {/*
                    <div className={styles.listCommentary}>
                        <form className={styles.form}>
                            <input type={"text"} placeholder={"Laissez votre avis sur "+ dataAuthor?.name + "..."}/>
                        </form>

                        <div className={styles.contentListCommentary}>
<CommentaryByUser commentary={"J'aime beaucoup cet auteur qui est très bon mais pas comme j'imaginais blablabla"}/>
                            <CommentaryByUser commentary={"J'aime beaucoup cet auteur qui est très bon"}/>
                            <CommentaryByUser commentary={"J'aime beaucoup cet auteur qui est très bon"}/>
                        </div>
                    </div>
*/}
                        </div>


                        <div className={styles.chapterContainer}>
                            <div className={styles.infoContainer}>
                                <p className={styles.absoText}>{profilAuthor?.pseudo}assasaasa</p>
                                <div className={styles.pseudo_date}>
                                    <h3>{profilAuthor?.pseudo}</h3>
                                    <p>Devenu auteur le : 18/02/29 {profilAuthor.author.became_author} </p>
                                </div>

                                <h6>Écrivain <span>OGLA</span> </h6>

                                <Snippet line={line} maxSize={maxSize} content={profilAuthor.author.description}/>
                            </div>
                        </div>

                    </div>

                    <div className={styles.containerS}>
                        <div className={styles.sortContainer}>
                            <div>
                                <button
                                    className={activeFilter === 'popular' && styles.activeBtn}
                                    onClick={() => {
                                        if (activeFilter !== 'popular') {
                                            setActiveFilter('popular');
                                        }
                                    }}>Populaire(s)
                                </button>
                                <button
                                    className={activeFilter === 'recent' && styles.activeBtn}
                                    onClick={() => {
                                        if (activeFilter !== 'recent') {
                                            if (recent.length === 0) {
                                                fetchRecentBooks();
                                            }
                                            setActiveFilter('recent');
                                            setPage(2);
                                        }
                                    }}>Récent(s)
                                </button>
                            </div>
                        </div>
                        {
                            !errBooks &&
                            <>
                                {
                                    activeFilter === 'recent' && recent.length !== 0 &&
                                    <ListCard books={recent}/>
                                }
                                {
                                    activeFilter === 'popular' && popular.length !== 0 &&
                                    <ListCard books={popular}/>
                                }
                                <div className={styles.seeMore}>

                                    {
                                        loading &&
                                        <LoaderCommentary/>
                                    }

                                    {
                                        activeFilter === 'popular' && canSeeMorePopular && !loading &&
                                        <p onClick={() => fetchMorePopularBooks()}>Voir plus</p>
                                    }

                                    {
                                        activeFilter === 'recent' && canSeeMoreRecent && !loading &&
                                        <p onClick={() => fetchMoreRecentBooks()}>Voir plus</p>
                                    }
                                </div>


                            </>
                        }

                    </div>

                </>
            }

            <Footer/>
        </div>
    )
}

export default AuthorProfil;

