import styles from '../../styles/Component/Card/Horizontal.module.scss';
import CardCategory from "./CardCategory";
import {CountLike} from "../layouts/Btn/Like";
import {useRouter} from "next/router";
import {HeartIcon} from "@heroicons/react/20/solid";

export const HorizontalCard = ({id, slug,title,img,like,author,category,snippet,nbChapters}) => {
    const router = useRouter();
    return(
        <div
            onClick={() => {
                router.push({
                    pathname: '/livre/' + id,
                    query: slug
                })
            }}
            className={styles.container}>
            <div className={styles.containerImg}>
                <img src={img}/>
            </div>

            <div className={styles.thumbnailLike}>
                <p>{like}</p>
                <HeartIcon/>
            </div>

            <div className={styles.containerContent}>
                <div className={styles.headerContent}>
                    <p> <span>@{author}</span></p>


                </div>

                <h5>{title} <span></span></h5>
                <p className={styles.summary}>{snippet} </p>
                <div className={styles.stats}>
                    <span className={styles.nbChapters}>{nbChapters} chapitre(s)</span>
                    <CardCategory category={category}/>

                </div>


            </div>
        </div>
        )

}