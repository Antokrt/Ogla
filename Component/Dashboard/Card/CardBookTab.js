import styles from '../../../styles/Component/Dashboard/Card/CardBookDashboardTab.module.scss';
import {BookmarkIcon, BookOpenIcon, ChevronDoubleUpIcon, FireIcon, HeartIcon} from "@heroicons/react/24/solid";

import {useRouter} from "next/router";
import {Capitalize} from "../../../utils/String";
import {FormatDateNb, FormatDateStr} from "../../../utils/Date";


export const CardBookDashboardTab = ({id, img, title,nbChapter,likes,category,date, nbView,top}) => {
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

            {
                top &&
                <div className={styles.thumbnail}>
                    <p>Top livre</p>
                    <HeartIcon/>
                </div>

            }



            <div className={styles.containerLabel}>


                <div className={styles.label}>
                    <div className={styles.title}>
                        <h6>{title}</h6>
                    </div>
                    <p> <span className={styles.date}>{FormatDateStr(date)} |</span>  {Capitalize(category)} </p>
                </div>
                <div className={styles.stats}>
                    <div className={styles.containerImgBook}>
                        <img src={'/assets/diapo/book.png'}/>
                    </div>
                    <h7>{nbChapter}  <span>chapitre(s)</span></h7>
                    <div>
                        <p><span>{nbView}221</span> vue(s) totale(s)</p>
                        <p><span>221{likes}</span> like(s)</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
