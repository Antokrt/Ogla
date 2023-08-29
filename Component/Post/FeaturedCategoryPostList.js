import React, {useEffect} from "react";
import styles from "../../styles/Component/Post/FeaturedCategoryPostList.module.scss";
import {useRouter} from "next/router";
import { ArrowUpTrayIcon} from "@heroicons/react/24/outline";
import {ChevronDoubleUpIcon, ChevronUpIcon} from "@heroicons/react/20/solid";
import {BookOpenIcon} from "@heroicons/react/24/outline";
import urlSlug from 'url-slug'
import Chapter from "../layouts/Icons/Chapter";
import {Capitalize} from "../../utils/String";


const FeaturedCategoryPostList = ({slug,id,title,summary,likes,category,author_pseudo,chapterNb,img,rank}) => {

    const router = useRouter();

    const goToCategory = (link,query) => {
        router.push(
            {
                pathname:link,
                query:{cat:category}
            }

        )
    }

    return (
        <div className={styles.container}
       onClick={() => router.push({
           pathname:'/livre/'+ id,
           query:slug
       })}
        >
            <div className={styles.image}>
                <div className={styles.thumbnail}>
                    <p> <ChevronDoubleUpIcon className={styles.icon}/> {likes}</p>
                   </div>
                <img src={img}/>
            </div>

            {
                router.pathname !== "/auteur/[id]" ?
                    <div className={styles.rankContainer}>
                        <p className={styles.indexRank}>{rank}</p>
                        <p className={styles.chapter}><Chapter className={styles.icon}/> {chapterNb}
                        </p>
                    </div>
                    : null
            }



            <div className={styles.content}>
                <h5> {title}</h5>
                <p className={styles.snippet}>{Capitalize(summary)}</p>
                <div className={styles.stats}>
                    <div className={styles.authorBlock}>
                        {
                            router.pathname !== "/auteur/[id]" &&
                            <p className={styles.author}> {author_pseudo} </p>
                        }
                        <p className={styles.category}>{category}</p>
                        <p className={styles.date}>Dernier chapitre : 18 Septembre 2022</p>
                    </div>
                </div>
            </div>


        </div>
    )
}

export default FeaturedCategoryPostList;