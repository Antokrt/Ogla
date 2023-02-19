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
import {GetBooksByAuthor} from "../../service/Author";


export async function getServerSideProps({params}){
    const pseudo = params.id;
    const profil = await GetAuthorProfilAPI(pseudo);

    return {
        props:{
            profilData: profil.profil,
            err:profil.err
        }
    }
}

const AuthorProfil = ({profilData}) => {

    const [profilAuthor, setProfilAuthor] = useState(profilData);
    const router = useRouter();
    const [page,setPage] = useState(2);
    const [activeFilter, setActiveFilter] = useState('popular');
    const [canSeeMore,setCanSeeMore] = useState(true);
    const [canSeeMoreRecent,setCanSeeMoreRecent] = useState(true);
    const [canSeeMorePopular,setCanSeeMorePopular] = useState(true);
    const [pagePopular,setPagePopular] = useState(2);
    const [pageRecent, setPageRecent] = useState(1);
    const [popular,setPopular] = useState(profilAuthor.bookList);
    const [recent,setRecent] = useState([]);

    const fetchBooks = (filter) => {
        GetBooksByAuthor(profilAuthor.pseudo,filter,1)
            .then((res) => {
                if(filter === 'popular'){
                    setPopular(res);
                }
                if(filter === 'recent'){
                    setRecent(res);
                    setPageRecent(pageRecent + 1);
                }
                setCanSeeMore(true);
            })
    }

    const fetchRecentBooks = () => {
GetBooksByAuthor(profilAuthor.pseudo,'recent', 1)
    .then((res) => {
        if(res.length !== 0){
            setRecent(res)
            setPageRecent(2);
        }
        else {
            setCanSeeMoreRecent(false);
        }
    })
    .catch((err) => setCanSeeMoreRecent(false));
    }

    const fetchMorePopularBooks = () => {
        GetBooksByAuthor(profilAuthor.pseudo,'popular',pagePopular)
            .then((res) => {
                if(res.length !== 0){
                    setPopular(prevState => [...prevState, ...res]);
                    setPagePopular(pagePopular + 1);
                }
                else {
                    setCanSeeMorePopular(false);
                }
            })
            .catch((err) => setCanSeeMorePopular(false));
    }

    const fetchMoreRecentBooks = () => {
        GetBooksByAuthor(profilAuthor.pseudo,'recent',pageRecent)
            .then((res) => {
                if(res.length !== 0){
                    setRecent(prevState => [...prevState, ...res]);
                    setPageRecent(pageRecent + 1);
                }
                else {
                    setCanSeeMoreRecent(false);
                }
            })
            .catch((err) => setCanSeeMoreRecent(false));
    }


    return (
        <div className={styles.container}>
            <Header/>

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
                        <div>
                            <h3>{profilAuthor?.pseudo}</h3>
                            <p>Devenu auteur le : {FormatDateNb(profilAuthor.author.became_author)} </p>
                        </div>

                        <h6> Tendance : <span> {profilAuthor.trend}</span></h6>

                        <p className={styles.snippet}> {profilAuthor.author.description}</p>
                    </div>

                    <h6 className={styles.topBook}>Tops livres <FireIcon/></h6>

                        <div className={styles.rankingGridContainer}>
                            {
                                profilAuthor.topBooks
                                    .sort((a,b)=> b.likes - a.likes)
                                    .map((item,index)=>{
                                        return  (
                                            <FeaturedCategoryPostList
                                                key={item}
                                                id={item._id}
                                                rank={index+1}
                                                title={item.title}
                                                summary={item.summary}
                                                likes={item.likes}
                                                slug={item.slug}
                                                category={item.category}
                                                author={item.author}
                                                chapterNb={item.nbChapter}
                                                img={item.img}
                                            />
                                        )
                                    })
                            }
                    </div>



                </div>

            </div>

            <div className={styles.containerS}>
                <div className={styles.sortContainer}>
                    <h3>Trier par </h3>
                    <MainSearchBar width={50} height={50}/>
                    <div>
                        <button
                            className={activeFilter === 'popular'  && styles.activeBtn}
                            onClick={() => {
                           if(activeFilter !== 'popular'){
                               setActiveFilter('popular');
                           }
                        }}>Populaire(s)</button>
                        <button
                            className={activeFilter === 'recent' && styles.activeBtn}
                            onClick={() => {
                            if(activeFilter !== 'recent'){
                                if(recent.length === 0){
                                    fetchRecentBooks();
                                }
                                setActiveFilter('recent');
                                setPage(2);
                            }
                        }}>Récent(s)</button>
                    </div>
                </div>

                <div className={styles.card}>
                    {
                        activeFilter === 'recent' && recent.length !== 0 &&
                        recent.map((item) => {
                            return(
                                <PreviewPost
                                title={item.title}
                                category={item.category}
                                author={profilData.pseudo}
                                snippet={item.summary}
                                id={item._id}
                                nbChapter={item.chapter_list.length}
                                like={item.likes}
                                img={item.img}
                                slug={item.slug}
                                />
                            )
                        })
                    }
                    {
                        activeFilter === 'popular' && popular.length !== 0 &&
                        popular.map((item) => {
                                return(
                                    <PreviewPost
                                        title={item.title}
                                        category={item.category}
                                        author={profilData.pseudo}
                                        snippet={item.summary}
                                        id={item._id}
                                        nbChapter={item.chapter_list.length}
                                        like={item.likes}
                                        img={item.img}
                                        slug={item.slug}
                                    />
                                )
                            })
                    }


                </div>
            </div>
            {
                activeFilter === 'popular' && canSeeMorePopular &&
                <p className={styles.seeMore} onClick={() => fetchMorePopularBooks()}>Voir plus Populaire</p>
            }

            {
                activeFilter === 'recent' && canSeeMoreRecent &&
                <p className={styles.seeMore} onClick={() => fetchMoreRecentBooks()}>Voir plus Recent</p>
            }



        </div>
    )
}

export default AuthorProfil;

