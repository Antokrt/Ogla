import styles from '../../styles/Component/Card/Horizontal.module.scss';
import CardCategory from "./CardCategory";
import {CountLike} from "../layouts/Btn/Like";
import {useRouter} from "next/router";
import {HeartIcon} from "@heroicons/react/20/solid";
import Header from "../Header";
import {Capitalize} from "../../utils/String";
import { useSelector } from 'react-redux';
import { selectTheme } from '../../store/slices/themeSlice';
import {GetDefaultBookImgWhenError} from "../../utils/ImageUtils";

export const HorizontalCard = ({id, slug,title,img,like,author,category,snippet,nbChapters,keys}) => {
    const router = useRouter();
    const theme = useSelector(selectTheme);

    return(
        <div
            onClick={() => {
                router.push({
                    pathname: '/livre/' + id,
                    query: slug
                })
            }}
            className={theme? styles.container : styles.darkContainer}>
            <div className={styles.containerImg}>
                <img src={img} onError={(e) => e.target.src = GetDefaultBookImgWhenError()}/>
            </div>


            <div className={styles.containerContent}>


                <h5>{Capitalize(title)} <span></span></h5>
                <div className={styles.stats}>
                    <span className={styles.nbChapters}>{nbChapters} chapitre(s) </span>

                    <div>
                        <span className={styles.author}>Par {author}  </span>
                        {
                            like > 0 &&
                            <span className={styles.likes}>21{like} <HeartIcon/> </span>
                        }
                    </div>

                </div>


            </div>
        </div>
        )

}