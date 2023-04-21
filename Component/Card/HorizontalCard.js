import styles from '../../styles/Component/Card/Horizontal.module.scss';
import CardCategory from "./CardCategory";
import {CountLike} from "../layouts/Btn/Like";
import {useRouter} from "next/router";
import {HeartIcon} from "@heroicons/react/20/solid";
import Header from "../Header";

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


            <div className={styles.containerContent}>


                <h5>{title} <span></span></h5>
                <div className={styles.stats}>
                    <span className={styles.nbChapters}>Par {author}  </span>

                    <div>
                        <span className={styles.nbChapters}>{nbChapters} chapitre(s) </span>
                        <span className={styles.likes}>2{like} <HeartIcon/> </span>
                    </div>

                </div>


            </div>
        </div>
        )

}