import styles from '../../styles/Component/Card/CardChapterPublic.module.scss';
import {FormatDateNb} from "../../utils/Date";
import {useRouter} from "next/router";
import {HeartIcon} from "@heroicons/react/24/solid";

export const CardChapterPublic = ({id,index,title,date_creation,likes,bookTitle}) => {
    const router = useRouter();
return (
    <div
        onClick={() => {
            router.push({
                pathname: "/chapitre/" + id, query: {
                    name: bookTitle, slug: title, i: index
                },
            })
        }}
        className={styles.container}>

        <div className={styles.headerChapter}>
            <h6>Chapitre {index} <span>{title} </span></h6>
        </div>

        <div className={styles.likeChapter}>
            <p>{likes} like(s)</p>
        </div>
    </div>
)
}

export const CardChapterPublicPhone = ({id,index,title,date_creation,likes,bookTitle}) => {
    const router = useRouter();
    return (
        <div
            onClick={() => {
                router.push({
                    pathname: "/chapitre/" + id, query: {
                        name: bookTitle, slug: title, i: index
                    },
                })
            }}
            className={styles.containerPhone}>

            <div className={styles.headerChapter}>
                <h6>Chapitre {index}  <span>{title}</span></h6>
            </div>

            <div className={styles.likeChapter}>
                <p>{likes} like(s)</p>
            </div>
        </div>
    )
}