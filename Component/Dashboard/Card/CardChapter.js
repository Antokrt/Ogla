import styles from "../../../styles/Component/Dashboard/Card/CardChapter.module.scss";
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
                query: {index}
            })}
            className={styles.chapter}>
            <div className={styles.headerChapter}>
                <h6>Chapitre {index} : <span>{Capitalize(title)}</span> {!publish && <span className={styles.schema}>(Brouillon)</span>}
                </h6>
                <h7>{FormatDateFrom(date)}</h7>

            </div>

            <div className={styles.likeChapter}>
                <p>{like}</p>
                <p>like(s)</p>

            </div>
        </div>
    )
}