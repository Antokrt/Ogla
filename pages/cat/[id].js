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
import {GetBookByCategoryApi} from "../api/book";
import {Capitalize} from "../../utils/String";
import {GetBooksWithCategoryService} from "../../service/Book/BookService";
import {TextSeeMore} from "../../Component/layouts/Btn/ActionBtn";
import {LoaderCommentary} from "../../Component/layouts/Loader";
import ErrMsg from "../../Component/ErrMsg";
import {HotPost, HotPostPhone} from "../../Component/Post/HotPost";
import {ListCard} from "../../Component/Card/ListCard";
import {BannerCategory} from "../../Component/Category/BannerCategory";
import {GetPresentationOfCategory} from "../../utils/CategoryUtils";
import ScreenSize from "../../utils/Size";

export async function getServerSideProps({req,params}){

    let category = params.id;

    const data = await GetBookByCategoryApi(category, 'popular');


    return {
        props: {
            key:category,
            err: data.err,
            cat:category,
            bookListData: data.book
        }
    }
}

export default function CatPage({cat,err,bookListData}) {

    const router = useRouter();
    const [filter, setFilter] = useState('popular');
    const [page, setPage] = useState(2);
    const {data: session} = useSession();
    const [bookList,setBookList] = useState(bookListData);
    const [canSeeMore,setCanSeeMore] = useState(true);
    const [loadingScroll, setLoadingScroll] =useState(false);
    const [width, height] = ScreenSize();

    const topBook = bookListData[0];

    const getBooksWithNewFilter = (filter) => {
        setLoadingScroll(true);
        setCanSeeMore(true);
        GetBooksWithCategoryService(cat,filter,1)
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
        GetBooksWithCategoryService(cat,filter,page)
            .then((res) => {
                if(res.length !== 0){
                    setBookList((prevState)=> [
                        ...prevState,
                        ...res
                    ]);
                    setCanSeeMore(true);
                    setPage(page + 1);
                }
                else{
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
            <BannerCategory presentation={GetPresentationOfCategory(cat)} category={Capitalize(cat)}/>
            {
                !err && bookListData && bookList && bookList.length > 0 &&
                <div className={styles.containerM}>
                    {
                        topBook &&
                        <div className={styles.hotContainer}>
                            {
                                width > 450 ?
                                    <HotPost className={styles.hotItem}
                                             likes={topBook.likes}
                                             title={topBook.title} author={topBook.author_pseudo}
                                             img={topBook.img} category={topBook.category}
                                             nbChapter={topBook.nbChapters}
                                             slug={topBook.slug}
                                             id={topBook._id}
                                             top={true}
                                             description={topBook.summary}
                                    />
                                    :
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
                            }

                        </div>

                    }


                    <div className={styles.containerCategory}>
                        <div className={styles.rankingContainer}>

                            <div className={styles.headerRanking}>
                                {
                                    cat === undefined &&
                                    <h3>Populaire(s) {cat} - <span className={styles.f}>Tout voir</span></h3>
                                }
                                {
                                    cat !== undefined &&
                                    <h3><span className={styles.f}> Populaires - {Capitalize(cat)}</span></h3>
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
                                    <ListCard books={bookList}/>
                            }
                            {
                                canSeeMore && !loadingScroll && bookList.length !== 0 &&
                                <div className={styles.containerSeeMore}>
                                    <TextSeeMore onclick={() => {
                                        loadMoreBooks();
                                    }}/>
                                </div>
                            }

                            {
                                loadingScroll &&
                                <div className={styles.containerSeeMore}>
                                    <LoaderCommentary/>
                                </div>
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