import React from "react";
import styles from "../../styles/Component/Post/FeaturedCategoryPostList.module.scss";
import {useRouter} from "next/router";
import { ArrowUpTrayIcon} from "@heroicons/react/24/outline";
import {ChevronDoubleUpIcon, ChevronUpIcon} from "@heroicons/react/20/solid";
import {BookOpenIcon} from "@heroicons/react/24/outline";
import urlSlug from 'url-slug'
import Chapter from "../layouts/Icons/Chapter";


const FeaturedCategoryPostList = (props) => {
    const { title, snippet, like, category, author, chapterNb ,img,rank} = props;

    const router = useRouter();

    const goToCategory = (link,query) => {
        router.push(
            {
                pathname:link,
                query:{cat:props.category}
            }

        )
    }

    return (
        <div className={styles.container}
        onClick={() =>{
router.push("/Post/"+ urlSlug(props.title,{
    separator:"_",

}))
        }}
        >
            <div className={styles.image}>
                <div className={styles.thumbnail}>
                    <p> <ChevronDoubleUpIcon className={styles.icon}/> {like}</p>
                   </div>
                <img src={props.img}/>
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
                <h5> {props.title}</h5>
                <p className={styles.snippet}>{props.snippet}</p>
                <div className={styles.stats}>
                    <div className={styles.authorBlock}>
                        {
                            router.pathname !== "/auteur/[id]" &&
                            <p className={styles.author}> {props.author} </p>

                        }
                        <p className={styles.category}>{props.category}</p>
                        <p className={styles.date}>Dernier chapitre : 18 Septembre 2022</p>
                    </div>
                </div>
            </div>


        </div>
    )
}

export default FeaturedCategoryPostList;