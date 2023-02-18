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


export async function getServerSideProps({params}){
    const pseudo = params.id;
    const profil = await GetAuthorProfilAPI(pseudo);

    console.log(profil)

    return {
        props:{
            profilData: profil.profil,
            err:profil.err
        }
    }
}

const AuthorProfil = ({profilData}) => {

    const [dataAuthor, setDataAuthor] = useState();
    const router = useRouter();
    const [slug,setSlug] = useState(router.query.id);
    const [author,setAuthor] = useState(slug);
    const [post, setPost] = useState([]);
    const [filter, setFilter] = useState(["Populaire", "Récent", "Par catégorie"]);

    const [sortDown, setSortDown] = useState(false);

    useEffect(() => {
        if(router.isReady){
            getPostByUser(router.query.id)
                .then((res) => setDataAuthor(res))
                .then(() => getData())
                .then((res) => setPost(res.slice(0, 4)))
                .then(() => console.log(dataAuthor))
                .catch((err) => console.log(err))
        }
    }, [router.isReady]);

    return (
        <div className={styles.container}>
            <Header/>

            <div className={styles.containerF}>

                <div className={styles.imgContainer}>
                    <div className={styles.img}>
                        <img referrerPolicy={'no-referrer'} src={profilData?.img}/>
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
                            <h3>{profilData?.pseudo}</h3>
                            <p>Inscrit le : {FormatDateNb(profilData.author.became_author)} </p>
                        </div>

                        <h6> Tendance : <span> {profilData.trend}</span></h6>

                        <p className={styles.snippet}> {dataAuthor?.description}assssssssssssss</p>
                    </div>

                    <h6 className={styles.topBook}>Tops livres <FireIcon/></h6>

                        <div className={styles.rankingGridContainer}>
                            {
                                profilData.topBooks
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
                        {
                            filter.map((item) => {
                                return (
                                    <button key={item}>{item}</button>
                                )
                            })
                        }
                    </div>
                </div>

                <div className={styles.card}>
                    {
                        profilData.bookList.map((item,index) => {
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



        </div>
    )
}

export default AuthorProfil;

