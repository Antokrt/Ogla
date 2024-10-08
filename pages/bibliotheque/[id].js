import Header from "../../Component/Header";
import BannerOnPost from "../../Component/BannerOnPost";
import { useRouter } from "next/router";
import PreviewPost from "../../Component/Post/PreviewPost";
import styles from "../../styles/Pages/Cat.module.scss";
import React, { useEffect, useState } from "react";
import FeaturedCategoryPostList from "../../Component/Post/FeaturedCategoryPostList";
import CategoryHeader from "../../Component/Category/CategoryHeader";
import { getData } from "../../services/Post";
import NewFeatured from "../../Component/Category/New";
import { DateNow, FormatDateMonthYear } from "../../utils/Date";
import Footer from "../../Component/Footer";
import { getSession, useSession } from "next-auth/react";
import { CardBookPublic } from "../../Component/Card/CardBook";
import { GetAuthorProfilAPI } from "../api/Author";
import { GetBookByCategoryApi } from "../api/book";
import { Capitalize } from "../../utils/String";
import { GetBooksWithCategoryService } from "../../service/Book/BookService";
import { TextSeeMore } from "../../Component/layouts/Btn/ActionBtn";
import { LoaderCard, LoaderCommentary } from "../../Component/layouts/Loader";
import {ErrMsg} from "../../Component/ErrMsg";
import { HotPost, HotPostPhone } from "../../Component/Post/HotPost";
import { ListCard } from "../../Component/Card/ListCard";
import { BannerCategory } from "../../Component/Category/BannerCategory";
import { GetPresentationOfCategory } from "../../utils/CategoryUtils";
import ScreenSize from "../../utils/Size";
import { ScrollDownUtils } from "../../utils/Scroll";
import { useSelector } from "react-redux";
import { selectTheme } from "../../store/slices/themeSlice";
import {selectCategories} from "../../store/slices/categorySlice";
import Head from "next/head";
import {GetTopUtils} from "../../utils/TopUtils";
import {HeaderMain} from "../../Component/HeaderMain";
import {HeaderMainResponsive} from "../../Component/HeaderMainResponsive";
import {GetCategory} from "../api/utils/Category";

export async function getServerSideProps({ req, params }) {

    let category = params.id;

    if(!GetCategory().includes(category)){
        return {
            redirect: {
                permanent: false,
                destination:'/bibliotheque'
            }
        }
    }

    const data = await GetBookByCategoryApi(category, 'popular',false);

    return {
        props: {
            key: category,
            err: data.err,
            cat: category,
            bookListData: data.book,
        }
    }
}

export default function CatPage({ cat, err, bookListData,topBookData }) {

    const router = useRouter();
    const [filter, setFilter] = useState('popular');
    const [page, setPage] = useState(2);
    const [bookList, setBookList] = useState(bookListData);
    const [canSeeMore, setCanSeeMore] = useState(true);
    const [loadingScroll, setLoadingScroll] = useState(false);
    const [width] = ScreenSize();
    const theme = useSelector(selectTheme);
    const [activeCat,setActiveCat] = useState(cat);
    const topBook = !err ? bookListData[0] : null;
    const categories = useSelector(selectCategories);

    useEffect(() => {
        for(const category of categories){
            if(cat === category.name.toLowerCase()){
                setActiveCat(category);
            }
        }
    },[categories])

    const getBooksWithNewFilter = (filter) => {
        setLoadingScroll(true);
        setCanSeeMore(true);
        GetBooksWithCategoryService(cat, filter, 1)
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
        GetBooksWithCategoryService(cat, filter, page)
            .then((res) => {
                if (res.length !== 0) {
                    setBookList((prevState) => [
                        ...prevState,
                        ...res
                    ]);
                    setCanSeeMore(true);
                    setPage(page + 1);
                }
                else {
                    setCanSeeMore(false);
                }
            })
            .then(() => setLoadingScroll(false))
            .then(() => ScrollDownUtils(104))
            .catch((err) => setLoadingScroll(false));
    }

    return (
        <div className={theme ? styles.container : styles.container + ' ' + styles.dark}>
            <Head>
                <title>{'Ogla - ' + Capitalize(cat)}</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"/>
                <link rel="icon" href="/favicon.ico" />
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
            <BannerCategory presentation={activeCat.description} category={Capitalize(cat)} />
            {
                width < 530 &&
                <h5 className={styles.thisMonthPhone}>Ce mois ci :</h5>
            }
            {
                !err && bookListData && bookList && bookList.length > 0 &&
                <div className={styles.containerM}>
                    {
                        topBook &&
                        <div className={styles.hotContainer}>
                            {
                                width > 530 ?
                                    <HotPost className={styles.hotItem}
                                        likes={topBook.likes}
                                        title={topBook.title} author={topBook.author_pseudo}
                                        img={topBook.img} category={topBook.category}
                                        nbChapter={topBook.nbChapters}
                                        slug={topBook.slug}
                                             authorImg={topBook?.author?.img}
                                        id={topBook._id}
                                        top={true}
                                        description={topBook.summary}
                                    />
                                    :
                                    <>
                                        <HotPostPhone className={styles.hotItem}
                                            likes={topBook.likes}
                                            title={topBook.title} author={topBook.author_pseudo}
                                            img={topBook.img} category={topBook.category}
                                            nbChapter={topBook.nbChapters}
                                            slug={topBook.slug}
                                            id={topBook._id}
                                            top={true}
                                            description={topBook.summary}
                                        />
                                    </>

                            }

                        </div>

                    }


                    <div className={styles.containerCategory}>
                        <div className={styles.rankingContainer}>

                            <div className={styles.headerRanking}>
                                {
                                    cat === undefined &&
                                    <h3>Populaires {cat} - <span className={styles.f}>Tout voir</span></h3>
                                }
                                {
                                    cat !== undefined &&
                                    <h3><span className={styles.f}> Librairie  ({Capitalize(cat)})</span></h3>
                                }

                                <p>{FormatDateMonthYear(Date.now())}</p>
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
                                    >Populaires
                                    </button>

                                    <button
                                        onClick={() => {
                                            setFilter('recent');
                                            getBooksWithNewFilter('recent');
                                        }}
                                        className={filter === 'recent' ? styles.activeBtn : undefined}
                                    >Récents
                                    </button>
                                </div>
                            </div>
                            {
                                !err && bookListData &&
                                <ListCard topId={filter === 'popular' ? GetTopUtils(bookList) : null} books={bookList} />
                            }
                                <div className={styles.containerSeeMore}>
                                    {
                                        canSeeMore && !loadingScroll && bookList.length !== 0 &&
                                        <TextSeeMore onclick={() => {
                                            loadMoreBooks();
                                        }}/>
                                    }

                                    {
                                        loadingScroll &&
                                        <LoaderCard />
                                    }
                                </div>
                        </div>
                    </div>
                </div>
            }
            {
                err &&
                <ErrMsg click={() => router.back()} text={'Impossible de récupérer les livres, veuillez réessayer...'} />
            }

            <Footer />


            {/*     <div className={styles.emailTest}>
                <h1>Bienvenue chez Ogla</h1>
                <p className={styles.thanks}>Merci de nous avoir rejoins, validez votre email en cliquant sur le <span>lien de confirmation. </span> </p>
                <p className={styles.citation}>Ogla est une plateforme d’écriture et de lecture ouverte à tous.  <br/>Grâce à Ogla, personne ne vous empêchera d’écrire votre histoire parce que nous croyons au pouvoir des mots.
</p>
            </div>
*/}
        </div>
    )
}