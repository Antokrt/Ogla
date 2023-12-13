import styles from '../../../styles/Component/Dashboard/Card/CardBookDashboard.module.scss';
import anim from '../../../styles/utils/anim.module.scss';
import { HeartIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/router";
import { Capitalize } from "../../../utils/String";
import { FormatDateNb, FormatDateStr } from "../../../utils/Date";
import { GetDefaultBookImgWhenError, GetImgPathOfAssets } from "../../../utils/ImageUtils";
import { useSelector } from 'react-redux';
import { selectTheme } from '../../../store/slices/themeSlice';


export const CardBookDashboard = ({ id, img, title, nbChapter, likes, category, date, nbView, top }) => {
    
    const router = useRouter();
    const theme = useSelector(selectTheme);

    return (
        <div className={theme ? styles.container + ' ' + anim.fadeIn : styles.container + ' ' + anim.fadeIn + ' ' + styles.dark} onClick={() => {
            router.push({
                pathname: '/dashboard/books/' + id,
            })
        }}>
            <div
                className={styles.containerImg}>
                <img alt={'Book Image Ogla'} src={img} onError={(e) => e.target.src = GetDefaultBookImgWhenError()} />
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
                    <p><span className={styles.date}>{FormatDateStr(date)}</span></p>
                </div>
                <div className={styles.stats}>
                    <div className={styles.containerImgBook}>
                        <img src={GetImgPathOfAssets() + 'diapo/book.png'}
                            onError={(e) => e.target.src = '/assets/diapo/book.png'}
                            alt={'Book Picture Ogla'}
                        />

                    </div>
                    <h7 is={'h7'}>{nbChapter} chapitre(s)</h7>
                    <p><span>{nbView}</span> vue(s) totale(s) | <span>{likes}</span> like(s)
                        | <strong>{Capitalize(category)}</strong></p>
                </div>
            </div>
        </div>
    )
}
