import styles from "../../../styles/Component/Dashboard/Card/CardChapter.module.scss";
import anim from '../../../styles/utils/anim.module.scss';
import Like from "../../layouts/Icons/Like";
import {useRouter} from "next/router";
import {Capitalize} from "../../../utils/String";
import {FormatDateFrom} from "../../../utils/Date";
import {CheckIcon, DocumentCheckIcon, PencilIcon, PencilSquareIcon} from "@heroicons/react/24/outline";

export const CardChapter = ({id,title,index,like,date, publish}) => {
    const router = useRouter();
    return (
        <div
            onClick={() => router.push({
                pathname:'/dashboard/chapitre/'+ id,
                query: {i:index}
            })}
            className={styles.chapter + ' ' + anim.fadeIn}>
            <div className={styles.headerChapter}>
                <h6>Chapitre {index} </h6>
                <h7 is={'h7'}>{Capitalize(title)} {!publish && <span className={styles.schema}>(Brouillon) </span>}</h7>

            </div>

            <div className={styles.likeChapter}>
                <p>{like}</p>
                <p>like(s)</p>

            </div>
        </div>
    )
}