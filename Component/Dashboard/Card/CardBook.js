import styles from '../../../styles/Component/Dashboard/Card/CardBookDashboard.module.scss';
import {BookmarkIcon, BookOpenIcon, ChevronDoubleUpIcon, FireIcon, HeartIcon} from "@heroicons/react/24/solid";

import {useRouter} from "next/router";
import {Capitalize} from "../../../utils/String";
import {FormatDateNb, FormatDateStr} from "../../../utils/Date";


export const CardBookDashboard = ({id, img, title,nbChapter,likes,category,date, nbView}) => {
    const router = useRouter();

    const catClassName = 'style.'+category;
    return (
        <div className={styles.container} onClick={() => {
            router.push({
                pathname: '/dashboard/books/' + id,
            })
        }}>
            <div
                className={styles.containerImg}>
                <img src={img}/>
            </div>

            <div className={styles.thumbnail}>
                {likes}
               <HeartIcon/>
            </div>
            <div className={styles.containerLabel}>
                <div className={styles.label}>
                    <div className={styles.title}>
                        <h6>{title}</h6>
                        <span className={styles[category]}>{Capitalize(category)}</span>
                    </div>
                    <p> <span className={styles.date}>Depuis le {FormatDateStr(date)}</span> </p>
                </div>
                <div className={styles.stats}>
                    <h7>{nbChapter}  <span> chapitre(s)</span></h7>
                    <p>{nbView} vue(s) totale(s) - {likes} like(s)</p>
                </div>
            </div>
        </div>
    )
}
