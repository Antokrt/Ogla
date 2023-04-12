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
import {DateNow} from "../../utils/Date";
import Footer from "../../Component/Footer";
import {getSession, useSession} from "next-auth/react";

import {CardBookPublic} from "../../Component/Card/CardBook";
import {GetAuthorProfilAPI} from "../api/Author";
import {GetBookByCategoryApi, GetOneBookApi} from "../api/book";
import {GetBooksWithCategoryService} from "../../service/Book/BookService";
import {TextSeeMore} from "../../Component/layouts/Btn/ActionBtn";
import {Loader1, Loader2, LoaderCommentary} from "../../Component/layouts/Loader";
import {Capitalize} from "../../utils/String";
import {ErrModal} from "../../Component/Modal/ErrModal";
import ErrMsg from "../../Component/ErrMsg";
import HotPost from "../../Component/Post/HotPost";
import {HorizontalCard} from "../../Component/Card/HorizontalCard";
import {ListCard} from "../../Component/Card/ListCard";

export async function getServerSideProps({req, params}) {
    let category = 'popular';

    const data = await GetBookByCategoryApi(category, 'popular');


    return {
        props: {
            err: data.err,
            bookListData: data.book
        }
    }
}

export default function CatPage({cat, err, bookListData}) {

    const router = useRouter();
    const [filter, setFilter] = useState('popular');
    const [page, setPage] = useState(2);
    const {data: session} = useSession();
    const [bookList, setBookList] = useState(bookListData);
    const [canSeeMore, setCanSeeMore] = useState(true);
    const [loadingScroll, setLoadingScroll] = useState(false);



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
            .catch((err) => setLoadingScroll(false));
    }


    return (
        <div className={styles.container}>
            <Header/>
            <CategoryHeader/>
            {
                !err && bookListData &&
                <div className={styles.containerM}>
                    <div className={styles.hotContainer}>
                        <HotPost className={styles.hotItem}
                                 likes={bookList[0].likes}
                                 title={"Livre 2"} nbChapter={205} author={"ThomasK"}
                                 img={"/assets/livre1.jpg"} category={"Horreur"}
                                 description={"She was pushed to a mysterious man and choose to run away. 6 years later, she brought back a little boy! The little boy is looking for a perfect man for his little fairy mommy : tall, 6 packs muscles and richest man!\n" +
                                     "“Mommy, how is this man?” The little boy pointed his finger to his magnified version of himself.\n" +
                                     "Bo Qingyue : “You ran away with my genes for so long. it’s time to admit you were wrong!"}
                        />
                    </div>
                    <div className={styles.containerCategory}>
                        <div className={styles.rankingContainer}>
                            <div className={styles.headerRanking}>
                                {
                                    cat === undefined &&
                                    <h3>Populaire(s) {cat} - <span className={styles.f}>Tout voir</span></h3>
                                }
                                {
                                    cat !== undefined &&
                                    <h3><span className={styles.f}> Populaires</span></h3>
                                }

                                <p>{DateNow()}</p>
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
                                            <LoaderCommentary/>
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