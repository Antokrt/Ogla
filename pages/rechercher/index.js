import {useRouter} from "next/router";
import React, {useEffect, useState} from "react";
import styles from '../../styles/Pages/Search.module.scss';
import Header from "../../Component/Header";
import PreviewPost from "../../Component/Post/PreviewPost";
import Footer from "../../Component/Footer";
import PreviewHorizontalPostList from "../../Component/Post/PreviewHorizontalPostList";
import {SearchBookAPI} from "../api/search";
import {SearchBookService} from "../../service/Search/SearchService";
import {MagnifyingGlassIcon} from "@heroicons/react/24/outline";

export async function getServerSideProps({req, query}) {

    if(!query.search){
        return {
            props:{
                err:true,
                queryData:null,
                data:null
            }
        }
    }


    const data = await SearchBookAPI(query.search);
    return {
        props:{
            err:data.err,
            queryData:query.search,
            data:data.searchData
        }
    }
}

const SearchPage = ({queryData,data,err}) => {
    const router = useRouter();
    const [query,setQuery] = useState(queryData);
    const [activeQuery, setActiveQuery] = useState(queryData);
    const [searchData,setSearchData] = useState(data);
    const [canLoadMore,setCanLoadMore] = useState(true);
    const [page,setPage] = useState(2);

    useEffect(() => {
        const params = router.query;
        setQuery(params.search);
    }, [router.query]);

    const searchNewBooks = () => {
        if(query !== '' && query !== activeQuery){
            SearchBookService(query,1)
                .then((res) => {
                    setSearchData(res);
                    setActiveQuery(query);
                    setCanLoadMore(true);
                    setPage(1);
                })
                .catch((err) => console.log(err))
        }
    }

    const loadMoreBooks = () => {
        if(canLoadMore){
            SearchBookService(activeQuery,page)
                .then((res) => {
                    if(res.length !== 0){
                        setSearchData((prevState)=> [
                            ...prevState,
                            ...res
                        ]);
                        setPage(page + 1);
                        setCanLoadMore(true);

                    }
                    else {
                        setCanLoadMore(false);
                    }
                })
                .catch(() => {
                    setCanLoadMore(false);
                })
        }
    }


    const [filter, setFilter] = useState({
        list:["Populaire", "Récent", "Plus de chapitres"],
        active:"Populaire"
    });





    return (
        <div className={styles.container}>
            <Header/>

            <div className={styles.searchContainer}>
                <form onSubmit={(event) => {
                    event.preventDefault()
                    searchNewBooks();
                }}>
                    <input
                        onChange={(e) => {
                        setQuery(e.target.value);
                    }} type={"text"} value={query} placeholder={"Rechercher"} />
                    <button type={'submit'}>Rechercher <MagnifyingGlassIcon/></button>
                </form>
            </div>

            <div className={styles.containerM}>
                <div className={styles.containerCardPreview}>
                    <div className={styles.sortContainer}>
                        <h3 onClick={() => searchNewBooks()}>Résultat pour {activeQuery}</h3>
                        <div>
                            {
                                filter.list.map((item) => {
                                    return (
                                        <button
                                            onClick={()=> setFilter({...filter,active: item})}
                                            className={filter.active === item && styles.activeBtn} key={item}>{item}</button>

                                    )
                                })
                            }
                        </div>
                    </div>
                    <div className={styles.card}>
                        {
                            searchData && !err && searchData.length !== 0 &&
                            searchData.map((item,index) => {
                                return (
                                    <PreviewPost title={item.title}
                                                 snippet={item.summary}
                                                 like={item.likes}
                                                 category={item.category}
                                                 author={item.author_pseudo}
                                                 slug={item.slug}
                                                 nbChapter={item.chapter_list.length}
                                                 img={item.img}
                                                 id={item._id}
                                    />
                                )
                            })
                        }

                    </div>
                </div>
                <p className={styles.seeMore} onClick={() => loadMoreBooks()}>Voir plus</p>
                <div className={styles.previewContainer}>
                    <PreviewHorizontalPostList type={"category"} title={"Populaires cette semaine"}/>
                    <PreviewHorizontalPostList type={"category"} title={"Tendance"}/>

                </div>
            </div>

<Footer/>
        </div>
    )
}

export default SearchPage;