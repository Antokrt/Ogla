import Header from "../../Component/Header";
import BannerOnPost from "../../Component/BannerOnPost";
import {useRouter} from "next/router";
import PreviewPost from "../../Component/Post/PreviewPost";
import styles from "../../styles/Pages/Cat.module.scss";
import anim from '../../styles/utils/anim.module.scss';
import React, {useEffect, useState} from "react";
import FeaturedCategoryPostList from "../../Component/Post/FeaturedCategoryPostList";
import CategoryHeader from "../../Component/Category/CategoryHeader";
import {getData} from "../../services/Post";
import NewFeatured from "../../Component/Category/New";
import {DateNow, FormatDateMonthYear, FormatDateStr} from "../../utils/Date";
import Footer from "../../Component/Footer";
import {getSession, useSession} from "next-auth/react";

import {CardBookPublic} from "../../Component/Card/CardBook";
import {GetBookByCategoryApi, GetOneBookApi} from "../api/book";
import {GetBooksWithCategoryService} from "../../service/Book/BookService";
import {TextSeeMore} from "../../Component/layouts/Btn/ActionBtn";
import {Loader1, Loader2, LoaderCard} from "../../Component/layouts/Loader";
import {Capitalize} from "../../utils/String";
import {ErrModal} from "../../Component/Modal/ErrModal";
import {ErrMsg} from "../../Component/ErrMsg";
import {HotPost, HotPostPhone} from "../../Component/Post/HotPost";
import {HorizontalCard} from "../../Component/Card/HorizontalCard";

import {ListCard} from "../../Component/Card/ListCard";
import ScreenSize from "../../utils/Size";
import {ScrollDownUtils} from "../../utils/Scroll";
import {useSelector} from "react-redux";
import {selectTheme} from "../../store/slices/themeSlice";
import Header2 from "../../Component/Header2";
import HeaderResponsive from "../../Component/HeaderResponsive";
import Head from "next/head";
import {GetTopUtils} from "../../utils/TopUtils";
import {HeaderMain} from "../../Component/HeaderMain";
import {HeaderMainResponsive} from "../../Component/HeaderMainResponsive";

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

export default function CatPage({cat, err, bookListData, topData}) {

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

    return (
        <div className={theme ? styles.container : styles.darkContainer}>
            <Head>
                <title>Ogla - Catégorie</title>
                <meta name="description" content="Generated by create next app"/>
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            {
                width > 950 ?
                    <HeaderMain/> :
                    <HeaderMainResponsive/>
            }

            {
                width <= 950 &&
                <div className={styles.catListContainer}>
                <CategoryHeader/>
                </div>
            }

            <div className={styles.bannerContainer + ' ' + anim.fadeIn}>
                <img src={'/assets/diapo/5.png'}/>
                <div>
                    <h1>Bibliothèque <span>OGLA</span></h1>
                    <p>Plongez dans des histoires de fantaisie époustouflantes, où les rois et les reines, les chevaliers et les sorciers, les elfes et les dragons se côtoient dans des mondes étonnants remplis de dangers et de merveilles. Laissez-vous transporter dans des univers épiques où l&apos;imagination n&apos;a pas de limites.

                    </p>
                </div>

            </div>
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
                                             title={topData.title} nbChapter={topData.nbChapters}
                                             author={topData.author_pseudo}
                                             img={topData.img} category={topData.category}
                                             description={topData.summary}
                                    />
                                    :
                                    <HotPostPhone className={styles.hotItem}
                                                  likes={topData.likes}
                                                  title={topData.title} nbChapter={topData.nbChapters}
                                                  author={topData.author_pseudo}
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
                                        className={filter === 'popular' ? styles.activeBtn : undefined}
                                    >Populaire(s)
                                    </button>

                                    <button
                                        onClick={() => {
                                            setFilter('recent');
                                            getBooksWithNewFilter('recent');
                                        }}
                                        className={filter === 'recent' ? styles.activeBtn : undefined}
                                    >Récent(s)
                                    </button>
                                </div>
                            </div>
                            {
                                !err && bookListData &&
                                <>
                                    <ListCard topId={filter === 'popular' ? GetTopUtils(bookList) : null}
                                              books={bookList}/>
                                    {

                                        <div className={styles.containerSeeMore}>
                                            {
                                                canSeeMore && !loadingScroll &&
                                                <TextSeeMore onclick={() => loadMoreBooks()}/>
                                            }
                                            {
                                                loadingScroll &&
                                                <LoaderCard/>
                                            }
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
                <ErrMsg textBtn={'Retour'} click={() => router.back()}
                        text={'Impossible de récupérer les livres, veuillez réessayer...'}/>
            }
            <Footer/>
        </div>
    )
}