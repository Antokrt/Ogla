import styles from '../../../styles/Component/Dashboard/Card/CardBook.module.scss';
import {ChevronDoubleUpIcon, FireIcon} from "@heroicons/react/24/solid";
import {PencilIcon} from "@heroicons/react/24/outline";
import {useRouter} from "next/router";


const CardBook = ({image, title, nbChapter, id}) => {
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
        <img src={image}/>
        <div className={styles.contentContainer}>
            <h6>{title}</h6>
            <div>
                <p>{nbChapter} chapitres</p>
                <p className={styles.likes}> <span>{nbChapter}</span>LIKES</p>

            </div>
        </div>

    </div>
)
}

export default CardBook;