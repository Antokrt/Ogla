import styles from '../../../styles/Component/Dashboard/Card/CardBookDashboardTab.module.scss';
import { HeartIcon } from "@heroicons/react/24/solid";

import { useRouter } from "next/router";
import { Capitalize } from "../../../utils/String";
import { FormatDateNb, FormatDateStr } from "../../../utils/Date";
import { GetDefaultBookImgWhenError, GetImgPathOfAssets } from "../../../utils/ImageUtils";
import { useSelector } from 'react-redux';
import { selectTheme } from '../../../store/slices/themeSlice';

export const CardBookDashboardTab = ({ id, img, title, nbChapter, likes, category, date, nbView, top }) => {

    const router = useRouter();
    const theme = useSelector(selectTheme)

    const catClassName = 'style.' + category;
    return (
        <div className={theme ? styles.container : styles.container + ' ' + styles.dark} onClick={() => {
            router.push({
                pathname: '/dashboard/books/' + id,
            })
        }}>
            <div
                className={styles.containerImg}>
                <img src={img} onError={(e) => e.target.src = GetDefaultBookImgWhenError()} alt={'Book Image Ogla'} />
            </div>

            {
                top && likes > 0 &&
                <div className={styles.thumbnail}>
                    <p>Top livre</p>
                    <HeartIcon />
                </div>

            }


            <div className={styles.containerLabel}>


                <div className={styles.label}>
                    <div className={styles.title}>
                        <h6>{title}</h6>
                    </div>
                    <p><span className={styles.date}>{FormatDateStr(date)} |</span> {Capitalize(category)} </p>
                </div>
                <div className={styles.stats}>
                    <div className={styles.containerImgBook}>
                        <img
                            src={GetImgPathOfAssets() + 'diapo/book.png'}
                            onError={(e) => e.target.src = '/assets/diapo/book.png'}
                            alt={'Book Ogla Default'}
                        />
                    </div>
                    <h7 is={'h7'}>{nbChapter} <span>chapitre(s)</span></h7>
                    <div>
                        <p><span>{nbView}221</span> vue(s) totale(s)</p>
                        <p><span>221{likes}</span> like(s)</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
