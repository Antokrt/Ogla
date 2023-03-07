import styles from '../../../styles/Component/Dashboard/Card/CardBook.module.scss';
import {ChevronDoubleUpIcon, FireIcon} from "@heroicons/react/24/solid";
import {PencilIcon} from "@heroicons/react/24/outline";
import {useRouter} from "next/router";


const CardBook = ({image, title, nbChapter, id, likes}) => {
const router = useRouter();
    return (
    <div
        onClick={() => {
            router.push('/dashboard/books/'+ id)
        }}
        className={styles.container}>
        <div className={styles.thumbnail}>
            <FireIcon/>
        </div>
        <img src={'http://localhost:3008/public/book/' + image}/>
        <div className={styles.contentContainer}>
            <h6>{title}</h6>
            <div>
                <p>{nbChapter} chapitre(s)</p>
                <p className={styles.likes}> <span>{likes}</span>LIKE(S)</p>

            </div>
        </div>

    </div>
)
}

export default CardBook;