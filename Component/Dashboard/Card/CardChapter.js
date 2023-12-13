import styles from "../../../styles/Component/Dashboard/Card/CardChapter.module.scss";
import anim from '../../../styles/utils/anim.module.scss';
import {useRouter} from "next/router";
import {Capitalize} from "../../../utils/String";
import { useSelector } from "react-redux";
import { selectTheme } from "../../../store/slices/themeSlice";

export const CardChapter = ({id,title,index,like,date, publish}) => {
    
    const router = useRouter();
    const theme = useSelector(selectTheme);

    return (
        <div
            onClick={() => router.push({
                pathname:'/dashboard/chapitre/'+ id,
                query: {i:index}
            })}
            className={theme ? styles.chapter + ' ' + anim.fadeIn : styles.chapter + ' ' + anim.fadeIn + ' ' + styles.dark}>
            <div className={styles.headerChapter}>
                <h6>Chapitre {index} </h6>
                <h7 is={'h7'}>{Capitalize(title)} {!publish && <span className={styles.schema}>(Brouillon) </span>}</h7>

            </div>

            <div className={styles.likeChapter}>
                <p>{like}</p>
                <p>j&apos;aimes</p>

            </div>
        </div>
    )
}