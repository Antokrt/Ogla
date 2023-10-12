import {useRouter} from "next/router";
import React, {useEffect, useRef, useState} from "react";
import styles from '../../styles/Pages/Search.module.scss';
import Header from "../../Component/Header";
import PreviewPost from "../../Component/Post/PreviewPost";
import Footer from "../../Component/Footer";
import PreviewHorizontalPostList from "../../Component/Post/PreviewHorizontalPostList";
import {SearchBookAPI} from "../api/search";
import {SearchBookService} from "../../service/Search/SearchService";
import {BookOpenIcon, MagnifyingGlassIcon} from "@heroicons/react/24/outline";
import {CardBookPublic} from "../../Component/Card/CardBook";
import {TextSeeMore} from "../../Component/layouts/Btn/ActionBtn";
import {LoaderCommentary} from "../../Component/layouts/Loader";
import {ErrMsg} from "../../Component/ErrMsg";
import {ListCard} from "../../Component/Card/ListCard";
import {ScrollDownUtils} from "../../utils/Scroll";
import HeaderResponsive from "../../Component/HeaderResponsive";
import Head from "next/head";
import {HeaderMain} from "../../Component/HeaderMain";
import {HeaderMainResponsive} from "../../Component/HeaderMainResponsive";
import ScreenSize from "../../utils/Size";
import {Capitalize, ReduceString} from "../../utils/String";
import { useSelector } from "react-redux";
import { selectTheme } from "../../store/slices/themeSlice";

export async function getServerSideProps({req, query}) {

    if (!query.search) {
        return {
            props: {
                err: false,
                queryData: null,
                data: null
            }
        }
    }

    const data = await SearchBookAPI(query.search);
    return {
        props: {
            err: data.err,
            queryData: query.search,
            data: data.searchData
        }
    }
}

const SearchPage = ({queryData, data, err}) => {
    const router = useRouter();
    const inputRef = useRef(null);
    const [query, setQuery] = useState(queryData);
    const [activeQuery, setActiveQuery] = useState(queryData);
    const [searchData, setSearchData] = useState(data);
    const [canLoadMore, setCanLoadMore] = useState(true);
    const [loadingScroll, setLoadingScroll] = useState(false);
    const [filter, setFilter] = useState('popular');
    const [page, setPage] = useState(2);
    const [width] = ScreenSize();
    const theme = useSelector(selectTheme);

    useEffect(() => {
        const params = router.query;
        setQuery(params.search);
    }, [router.query]);

    const focusInput = () => {
        return inputRef.current.focus();
    }

    const searchNewBooks = (filter) => {
        if (query !== '') {
            SearchBookService(query, 1, filter)
                .then((res) => {
                    setSearchData(res);
                    setActiveQuery(query);
                    if (res.length === 0) {
                        setCanLoadMore(false);
                    } else {
                        setCanLoadMore(true)
                    }
                    setPage(2);
                })
                .catch((err) => console.log(err))
        }
    }

    const loadMoreBooks = () => {
        if (canLoadMore) {
            setLoadingScroll(true);
            SearchBookService(activeQuery, page)
                .then((res) => {
                    if (res.length !== 0) {
                        setSearchData((prevState) => [
                            ...prevState,
                            ...res
                        ]);
                        setPage(page + 1);
                        setCanLoadMore(true);

                    } else {
                        setCanLoadMore(false);
                    }
                })
                .then(() => setLoadingScroll(false))
                .then(() => ScrollDownUtils(104))
                .catch(() => {
                    setLoadingScroll(false);
                    setCanLoadMore(false);
                });
        }
    }

    if (err) {
        return (
            <div className={styles.containerErr}>

                {
                    width > 950 ?
                        <HeaderMain/> :
                        <div style={{width: '100%'}}>
                            <HeaderMainResponsive/>
                        </div>
                }

                <ErrMsg click={() => router.back()}
                        text={"Impossible d'effectuer la recherche, veuillez réessayer..."}/>

                <Footer/>
            </div>
        )

    } else {
        return (
            <div className={theme ? styles.container : styles.container + ' ' + styles.dark}>
                <Head>
                    <title>Ogla - Rechercher un livre</title>
                    <meta name="description" content="Generated by create next app"/>
                    <meta name="viewport"
                          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"/>
                    <link rel="icon" href="/favicon.ico"/>
                </Head>

                {
                    width > 950 ?
                        <HeaderMain/> :
                        <div style={{width: '100%'}}>
                            <HeaderMainResponsive/>
                        </div>
                }

                <div className={styles.searchContainer}>
                    <form onSubmit={(event) => {
                        event.preventDefault()
                        searchNewBooks();
                    }}>
                        <div className={styles.inputContainer}>
                            <BookOpenIcon/>
                            <input
                                ref={inputRef}
                                onChange={(e) => {
                                    setQuery(e.target.value);
                                }}
                                type={"text"}
                                value={query}
                                placeholder={" "}
                                className={styles.inputSearch}
                            />

                            <button type={'submit'}>
                                <MagnifyingGlassIcon/>
                            </button>

                        </div>
                    </form>
                </div>
                {
                    searchData &&
                    <div className={styles.containerM}>
                        <div className={styles.containerCardPreview}>
                            <div className={styles.sortContainer}>
                                <h3 onClick={() => searchNewBooks()}>Résultat pour
                                    : {ReduceString(Capitalize(activeQuery), 50)}</h3>
                                <div>
                                    <button
                                        onClick={() => {
                                            setFilter('popular');
                                            searchNewBooks('popular');
                                        }}
                                        className={filter === "popular" && styles.activeBtn}>Populaires
                                    </button>

                                    <button
                                        onClick={() => {
                                            setFilter('recent');
                                            searchNewBooks('recent');
                                        }}
                                        className={filter === "recent" && styles.activeBtn}>Récents
                                    </button>
                                </div>
                            </div>
                            <div className={styles.containerList}>
                                {
                                    searchData && !err && searchData.length !== 0 &&
                                    <ListCard books={searchData}/>
                                }
                            </div>
                        </div>
                        <div className={styles.seeMoreContainer}>
                            {
                                canLoadMore && !loadingScroll && searchData.length > 0 &&
                                <TextSeeMore onclick={() => loadMoreBooks()}/>
                            }
                            {
                                loadingScroll &&
                                <LoaderCommentary/>
                            }
                            {
                                searchData.length <= 0 &&
                                <div className={styles.err}>
                                    <ErrMsg text={'Il semblerait que votre recherche ne donne rien !'}
                                            textBtn={'Réessayer'} click={() => focusInput()}/>
                                </div>
                            }
                        </div>
                    </div>
                }
                <Footer/>
            </div>
        )
    }


}

export default SearchPage;