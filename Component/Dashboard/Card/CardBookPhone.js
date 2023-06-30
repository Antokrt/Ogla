import styles from '../../../styles/Component/Dashboard/Card/CardBookDashboardPhone.module.scss';
import anim from '../../../styles/utils/anim.module.scss';
import {BookmarkIcon, BookOpenIcon, ChevronDoubleUpIcon, FireIcon, HeartIcon} from "@heroicons/react/24/solid";

import {useRouter} from "next/router";
import {Capitalize} from "../../../utils/String";
import {FormatDateNb, FormatDateStr} from "../../../utils/Date";
import {CursorArrowRaysIcon} from "@heroicons/react/24/outline";


export const CardBookPhone = ({id, img, title,nbChapter,likes,category,date, nbView,top}) => {
    const router = useRouter();

    const catClassName = 'style.'+category;
    return (
        <div className={styles.container + ' ' + anim.fadeIn} >

            {
                top && likes > 0 &&
                <div className={styles.thumbnail}>
                    <p>Top livre</p>
                    <HeartIcon/>
                </div>
            }

            <div className={styles.containerBookImg}>
                <img src={'/assets/diapo/book.png'}/>
            </div>

            <div className={styles.containerImg}>
                <img src={img} alt={'Book Ogla'}/>
            </div>

            <div className={styles.containerTitle}>
                <h6>{title}</h6>
            </div>

            <div className={styles.containerLabel}>
                <div className={styles.chapters}>
                    <p className={styles.ch}><span> {nbChapter} </span> chapitres</p>
                    <p className={styles.cat}>{Capitalize(category)}</p>
                </div>

                <p className={styles.likes}><span>{likes}</span> like(s)</p>
            </div>

            <button className={styles.btn} onClick={() => {
                router.push({
                    pathname: '/dashboard/books/' + id,
                })
            }}>Gérer <CursorArrowRaysIcon/></button>




        </div>
    )
}
