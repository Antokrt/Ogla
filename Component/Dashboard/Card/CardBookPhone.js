import styles from '../../../styles/Component/Dashboard/Card/CardBookDashboardPhone.module.scss';
import anim from '../../../styles/utils/anim.module.scss';
import { HeartIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/router";
import { Capitalize } from "../../../utils/String";
import { CursorArrowRaysIcon } from "@heroicons/react/24/outline";
import { GetDefaultBookImgWhenError, GetImgPathOfAssets } from "../../../utils/ImageUtils";
import { useSelector } from 'react-redux';
import { selectTheme } from '../../../store/slices/themeSlice';

export const CardBookPhone = ({ id, img, title, nbChapter, likes, category, date, nbView, top }) => {

    const router = useRouter();
    const catClassName = 'style.' + category;
    const theme = useSelector(selectTheme);

    return (
        <div className={theme ? styles.container + ' ' + anim.fadeIn : styles.container + ' ' + anim.fadeIn + ' ' + styles.dark}>

            {
                top && likes > 0 &&
                <div className={styles.thumbnail}>
                    <p>Top livre</p>
                    <HeartIcon />
                </div>
            }

            <div className={styles.containerBookImg}>
                <img src={GetImgPathOfAssets() + 'diapo/book.png'}
                    onError={(e) => e.target.src = '/assets/diapo/book.png'}
                    alt={'Book Ogla Default'}
                />

            </div>

            <div className={styles.containerImg}>
                <img src={img} onError={(e) => e.target.src = GetDefaultBookImgWhenError()} alt={'Book Image Ogla'} />
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
            }}>Gérer <CursorArrowRaysIcon /></button>




        </div>
    )
}
