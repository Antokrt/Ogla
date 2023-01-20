import styles from "../../../styles/Component/Dashboard/Card/CardChapter.module.scss";
import Like from "../../layouts/Icons/Like";
import {useRouter} from "next/router";

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
                <h6><span>Chapitre {index}</span><br/> {title}</h6>
                <p>{id}</p>

                <h7>{date}</h7>
                {
                    publish ?
                        <p>Publié!</p> :
                        <p>Brouillon</p>
                }
            </div>

            <div className={styles.likeChapter}>
                <Like/>
                <p>{like}</p>

            </div>
        </div>
    )
}