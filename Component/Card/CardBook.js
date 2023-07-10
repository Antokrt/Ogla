import styles from '../../styles/Component/Card/CardBook.module.scss';
import {CountLike} from "../layouts/Btn/Like";
import {useRouter} from "next/router";
import {Capitalize} from "../../utils/String";
import {BookTitle} from "../layouts/Text";
import {HeartIcon} from "@heroicons/react/20/solid";
import {BookmarkIcon, BookOpenIcon} from "@heroicons/react/24/solid";
import {GetDefaultBookImgWhenError} from "../../utils/ImageUtils";

export const CardBookPublic = ({id, slug,title,img,like,author,category}) => {
    const router = useRouter();
    return (
        <div className={styles.container} onClick={() => {
            router.push({
                pathname: '/livre/' + id,
                query: slug
            })
        }}>
            <div
/*                style={{
                    background: "linear-gradient( rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.9) ), url(" + img + ")"
                }}*/
                className={styles.containerImg}>
                <img src={img} onError={(e) => e.target.src = GetDefaultBookImgWhenError()}/>
                <h4>{title}</h4>

            </div>

            <div className={styles.thumbnaiLike}>
                <CountLike like={like}/>
            </div>



            <div className={styles.label}>
                <div className={styles.content}>
                    <p className={styles.pseudo}>@{author}</p>
                    <p className={styles.pseudo}>{Capitalize(category)}</p>

                </div>
            </div>
        </div>
    )
}


