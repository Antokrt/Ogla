import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import styles from '../../styles/Pages/Search.module.scss';
import Header from "../../Component/Header";
import PreviewPost from "../../Component/Post/PreviewPost";
import Footer from "../../Component/Footer";
import PreviewHorizontalPostList from "../../Component/Post/PreviewHorizontalPostList";
import { SearchBookAPI } from "../api/search";
import { SearchBookService } from "../../service/Search/SearchService";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { CardBookPublic } from "../../Component/Card/CardBook";
import { TextSeeMore } from "../../Component/layouts/Btn/ActionBtn";
import { LoaderCommentary } from "../../Component/layouts/Loader";
import { ErrMsg } from "../../Component/ErrMsg";
import { ListCard } from "../../Component/Card/ListCard";
import { ScrollDownUtils } from "../../utils/Scroll";
import HeaderResponsive from "../../Component/HeaderResponsive";

export async function getServerSideProps({ req, query }) {

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

const SearchPage = ({ queryData, data, err }) => {
    const router = useRouter();
    const inputRef = useRef(null);
    const [query, setQuery] = useState(queryData);
    const [activeQuery, setActiveQuery] = useState(queryData);
    const [searchData, setSearchData] = useState(data);
    const [canLoadMore, setCanLoadMore] = useState(true);
    const [loadingScroll, setLoadingScroll] = useState(false);
    const [filter, setFilter] = useState('popular');
    const [page, setPage] = useState(2);

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
                    }
                    else {
                        setCanLoadMore(true)
                    }
                    setPage(2);
                })
                .catch((err) => console.log(err))
        }
    }

    const loadMoreBooks = () => {
        console.log("test")
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

    return (
        <div className={styles.container}>
            <Header />
            {/* <HeaderResponsive /> */}

            <div className={styles.searchContainer}>
                <form onSubmit={(event) => {
                    event.preventDefault()
                    searchNewBooks();
                }}>
                    <div className={styles.inputContainer}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <path d="M21 4H7C5.89543 4 5 4.89543 5 6C5 7.10457 5.89543 8 7 8H21V21C21 21.5523 20.5523 22 20 22H7C4.79086 22 3 20.2091 3 18V6C3 3.79086 4.79086 2 7 2H20C20.5523 2 21 2.44772 21 3V4ZM5 18C5 19.1046 5.89543 20 7 20H19V10H7C6.27143 10 5.58835 9.80521 5 9.46487V18ZM20 7H7C6.44772 7 6 6.55228 6 6C6 5.44772 6.44772 5 7 5H20V7Z"></path>
                        </svg>
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
                        <label className={styles.labelSearch}>
                            Chercher un livre
                        </label>
                        <button type={'submit'}>
                            {/* <MagnifyingGlassIcon /> */}
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <path d="M18.031 16.6168L22.3137 20.8995L20.8995 22.3137L16.6168 18.031C15.0769 19.263 13.124 20 11 20C6.032 20 2 15.968 2 11C2 6.032 6.032 2 11 2C15.968 2 20 6.032 20 11C20 13.124 19.263 15.0769 18.031 16.6168ZM16.0247 15.8748C17.2475 14.6146 18 12.8956 18 11C18 7.1325 14.8675 4 11 4C7.1325 4 4 7.1325 4 11C4 14.8675 7.1325 18 11 18C12.8956 18 14.6146 17.2475 15.8748 16.0247L16.0247 15.8748ZM12.1779 7.17624C11.4834 7.48982 11 8.18846 11 9C11 10.1046 11.8954 11 13 11C13.8115 11 14.5102 10.5166 14.8238 9.82212C14.9383 10.1945 15 10.59 15 11C15 13.2091 13.2091 15 11 15C8.79086 15 7 13.2091 7 11C7 8.79086 8.79086 7 11 7C11.41 7 11.8055 7.06167 12.1779 7.17624Z"></path>
                            </svg>
                        </button>

                    </div>
                </form>
            </div>
            {
                searchData &&
                <div className={styles.containerM}>
                    <div className={styles.containerCardPreview}>
                        <div className={styles.sortContainer}>
                            <h3 onClick={() => searchNewBooks()}>Résultat pour : {activeQuery}</h3>
                            <div>
                                <button
                                    onClick={() => {
                                        setFilter('popular');
                                        searchNewBooks('popular');
                                    }}
                                    className={filter === "popular" && styles.activeBtn}>Populaire(s)</button>

                                <button
                                    onClick={() => {
                                        setFilter('recent');
                                        searchNewBooks('recent');
                                    }}
                                    className={filter === "recent" && styles.activeBtn}>Récent(s)</button>
                            </div>
                        </div>
                        <div className={styles.containerList}>
                            {
                                searchData && !err && searchData.length !== 0 &&
                                <ListCard books={searchData} />
                            }
                        </div>
                    </div>
                    <div className={styles.seeMoreContainer}>
                        {
                            canLoadMore && !loadingScroll && searchData.length > 0 &&
                            <TextSeeMore onclick={() => loadMoreBooks()} />
                        }
                        {
                            loadingScroll &&
                            <LoaderCommentary />
                        }
                        {
                            searchData.length <= 0 &&
                            <div className={styles.err}>
                                <ErrMsg text={'Il semblerait que votre recherche ne donne rien !'} textBtn={'Réessayer'} click={() => focusInput()} />
                            </div>
                        }
                    </div>
                </div>
            }
            <Footer />
        </div>
    )
}

export default SearchPage;