import {useRouter} from "next/router";
import React, {useEffect, useRef, useState} from "react";
import styles from '../../styles/Pages/Search.module.scss';
import Header from "../../Component/Header";
import PreviewPost from "../../Component/Post/PreviewPost";
import Footer from "../../Component/Footer";
import PreviewHorizontalPostList from "../../Component/Post/PreviewHorizontalPostList";
import {SearchBookAPI} from "../api/search";
import {SearchBookService} from "../../service/Search/SearchService";
import {MagnifyingGlassIcon} from "@heroicons/react/24/outline";
import {CardBookPublic} from "../../Component/Card/CardBook";
import {TextSeeMore} from "../../Component/layouts/Btn/ActionBtn";
import {LoaderCommentary} from "../../Component/layouts/Loader";
import ErrMsg from "../../Component/ErrMsg";
import {ListCard} from "../../Component/Card/ListCard";
import {ScrollDownUtils} from "../../utils/Scroll";

export async function getServerSideProps({req, query}) {

    if (!query.search) {
        return {
            props: {
                err: true,
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
    const [filter,setFilter] = useState('popular');
    const [page, setPage] = useState(2);

    useEffect(() => {
        const params = router.query;
        setQuery(params.search);
        console.log(searchData)
    }, [router.query]);

    const focusInput = () => {
       return inputRef.current.focus();
    }

    const searchNewBooks = (filter) => {
        if (query !== '') {
            SearchBookService(query, 1,filter)
                .then((res) => {
                    setSearchData(res);
                    setActiveQuery(query);
                    if(res.length === 0){
                        setCanLoadMore(false);
                    }
                    else{
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

    return (
        <div className={styles.container}>
            <Header/>

            <div className={styles.searchContainer}>
                <form onSubmit={(event) => {
                    event.preventDefault()
                    searchNewBooks();
                }}>
                    <input
                        ref={inputRef}
                        onChange={(e) => {
                            setQuery(e.target.value);
                        }} type={"text"} value={query} placeholder={"Rechercher"}/>
                    <button type={'submit'}>Rechercher <MagnifyingGlassIcon/></button>
                </form>
            </div>

            <div className={styles.containerM}>
                <div className={styles.containerCardPreview}>
                    <div className={styles.sortContainer}>
                        <h3 onClick={() => searchNewBooks()}>Résultat pour {activeQuery}</h3>
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
                            <ErrMsg text={'Il semblerait que votre recherche ne donne rien !'} textBtn={'Réessayer'} click={() => focusInput()}/>
                        </div>
                    }
                </div>


            </div>

            <Footer/>
        </div>
    )
}

export default SearchPage;