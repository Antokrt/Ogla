import styles from '../../styles/Component/Card/CardBook.module.scss';
import {CountLike} from "../layouts/Btn/Like";
import {useRouter} from "next/router";
import {BookTitle} from "../layouts/Text";

export const CardBookPublic = ({id,slug}) => {
    const router = useRouter();
    return (
        <div className={styles.container} onClick={() => {
            router.push({
                pathname:'/livre/'+id,
                query:slug
            })
        }}>
            <div
                style={{
                    background: "linear-gradient( rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.8) ), url(https://cdn.bewaremag.com/wp-content/uploads/2022/04/Astronaute-napoleon.jpg)"
                }}
                className={styles.containerImg}>
                <h4>La quete du maitre</h4>
            </div>

            <div className={styles.label}>
                <BookTitle title={'La quete du maitre'}/>
                <div>
                    <p className={styles.pseudo}>@JoséBeauvais</p>
                    <CountLike/>
                </div>
            </div>
        </div>
    )
}

export default CardBookPublic;