import Header from "../../Component/Header";
import BannerOnPost from "../../Component/BannerOnPost";
import {useRouter} from "next/router";
import PreviewPost from "../../Component/Post/PreviewPost";
import styles from "../../styles/Pages/Cat.module.scss";
import React, {useEffect, useState} from "react";
import FeaturedCategoryPostList from "../../Component/Post/FeaturedCategoryPostList";
import CategoryHeader from "../../Component/Category/CategoryHeader";
import {getData} from "../../services/Post";
import NewFeatured from "../../Component/Category/New";
import {DateNow, FormatDateMonthYear, FormatDateStr} from "../../utils/Date";
import Footer from "../../Component/Footer";
import {getSession, useSession} from "next-auth/react";

import {CardBookPublic} from "../../Component/Card/CardBook";
import {GetAuthorProfilAPI} from "../api/Author";
import {GetBookByCategoryApi, GetOneBookApi} from "../api/book";
import {GetBooksWithCategoryService} from "../../service/Book/BookService";
import {TextSeeMore} from "../../Component/layouts/Btn/ActionBtn";
import {Loader1, Loader2, LoaderCard} from "../../Component/layouts/Loader";
import {Capitalize} from "../../utils/String";
import {ErrModal} from "../../Component/Modal/ErrModal";
import ErrMsg from "../../Component/ErrMsg";
import {HotPost, HotPostPhone} from "../../Component/Post/HotPost";
import {HorizontalCard} from "../../Component/Card/HorizontalCard";

import {ListCard} from "../../Component/Card/ListCard";
import ScreenSize from "../../utils/Size";
import {ScrollDownUtils} from "../../utils/Scroll";
import { useSelector } from "react-redux";
import { selectTheme } from "../../store/slices/themeSlice";
import HeaderResponsive from "../../Component/HeaderResponsive";

export async function getServerSideProps({req, params}) {
    let category = 'popular';

    const data = await GetBookByCategoryApi(category, 'popular');


    return {
        props: {
            err: data.err,
            bookListData: data.book,
            topData: data.top
        }
    }
}

export default function CatPage({cat, err, bookListData,topData}) {

    const router = useRouter();
    const [filter, setFilter] = useState('popular');
    const [page, setPage] = useState(2);
    const {data: session} = useSession();
    const [bookList, setBookList] = useState(bookListData);
    const [canSeeMore, setCanSeeMore] = useState(true);
    const [loadingScroll, setLoadingScroll] = useState(false);
    const [width, height] = ScreenSize();
    const theme = useSelector(selectTheme);
    const getBooksWithNewFilter = (filter) => {
        setLoadingScroll(true);
        setCanSeeMore(true);
        GetBooksWithCategoryService('popular', filter, 1)
            .then((res) => {
                setBookList(res);
            })
            .then(() => {
                setPage(2);
                setLoadingScroll(false);
            })
            .catch((err) => console.log(err))
    }

    const loadMoreBooks = () => {
        setLoadingScroll(true);
        setCanSeeMore(false);
        GetBooksWithCategoryService('popular', filter, page)
            .then((res) => {
                if (res.length !== 0) {
                    setBookList((prevState) => [
                        ...prevState,
                        ...res
                    ]);
                    setCanSeeMore(true);
                    setPage(page + 1);
                } else {
                    setCanSeeMore(false);
                }
            })
            .then(() => setLoadingScroll(false))
            .then(() => ScrollDownUtils(104))
            .catch((err) => setLoadingScroll(false));
    }

    useEffect(() => {
       console.log(topData)
    },[])


    return (
        <div className={theme? styles.container : styles.darkContainer}>
            {
                width > 800 &&
                <Header/>
            }
            {
                width <= 800 &&
                <HeaderResponsive />
            }
            <CategoryHeader/>
            {
                !err && bookListData &&
                <div className={styles.containerM}>
                    {
                        width < 530 && topData &&
                        <h5 className={styles.thisMonthPhone}>Ce mois ci :</h5>
                    }
                    {
                        topData &&
                        <div className={styles.hotContainer}>

                            {
                                width > 530 ?
                                    <HotPost className={styles.hotItem}
                                             top={true}
                                             likes={topData.likes}
                                             title={topData.title} nbChapter={topData.nbChapters} author={topData.author_pseudo}
                                             img={topData.img} category={topData.category}
                                             description={topData.summary}
                                       />
                                    :
                                    <HotPostPhone className={styles.hotItem}
                                                  likes={topData.likes}
                                                  title={topData.title} nbChapter={topData.nbChapters} author={topData.author_pseudo}
                                                  img={topData.img} category={topData.category}
                                                  description={topData.summary}
                                    />
                            }

                        </div>

                    }
                    <div className={styles.containerCategory}>
                        <div className={styles.rankingContainer}>
                            <div className={styles.headerRanking}>
                                {
                                    cat === undefined &&
                                    <h3>Populaire(s) {cat} </h3>
                                }
                                {
                                    cat !== undefined &&
                                    <h3><span className={styles.f}> Populaires</span></h3>
                                }
                                <p> {FormatDateMonthYear(Date.now())} </p>
                                
                            </div>
                        </div>

                        <div className={styles.containerCardPreview}>
                            <div className={styles.sortContainer}>
                                <div>
                                    <button
                                        onClick={() => {
                                            getBooksWithNewFilter('popular');
                                            setFilter('popular');
                                        }}
                                        className={filter === 'popular' && styles.activeBtn}
                                    >Populaire(s)
                                    </button>

                                    <button
                                        onClick={() => {
                                            setFilter('recent');
                                            getBooksWithNewFilter('recent');
                                        }}
                                        className={filter === 'recent' && styles.activeBtn}
                                    >Récent(s)
                                    </button>
                                </div>
                            </div>
                            {
                                !err && bookListData &&
                                <>
                                    <ListCard books={bookList}/>
                                    {
                                        canSeeMore && !loadingScroll &&
                                        <div className={styles.containerSeeMore}>
                                            <TextSeeMore onclick={() => loadMoreBooks()}/>
                                        </div>
                                    }
                                    {
                                        loadingScroll &&
                                        <div className={styles.containerSeeMore}>
                                            <LoaderCard/>
                                        </div>
                                    }
                                </>
                            }


                        </div>
                    </div>
                </div>

            }
            {
                err &&
                <ErrMsg textBtn={'Retour'} click={() => router.back()} text={'Impossible de récupérer les livres, veuillez réessayer...'}/>
            }
            <Footer/>
        </div>
    )
}