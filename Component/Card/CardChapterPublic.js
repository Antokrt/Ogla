import styles from '../../styles/Component/Card/CardChapterPublic.module.scss';
import { useRouter } from "next/router";
import { Capitalize } from "../../utils/String";
import { useSelector } from 'react-redux';
import { selectTheme } from '../../store/slices/themeSlice';

export const CardChapterPublic = ({ id, index, title, date_creation, likes, bookTitle }) => {
    
    const router = useRouter();
    const theme = useSelector(selectTheme);

    
    function likeOrLikes() {
        return likes > 1 ? (
            <p> {likes} likes</p>
        )
        :
        (
            <p> {likes} like</p>
        )
    }

    return (
        <div
            tabIndex={0}
            onClick={() => {
                router.push({
                    pathname: "/chapitre/" + id, query: {
                        name: bookTitle, slug: title, i: index
                    },
                })
            }}
            className={theme ? styles.container : styles.container + ' ' + styles.dark}>

            <div className={styles.headerChapter}>
                <h6>Chapitre {index} <span>{title} </span></h6>
            </div>

            <div className={styles.likeChapter}>
            {
                likeOrLikes()
            }
            </div>
        </div>
    )
}


export const CardChapterDashboard = ({ id, index, title, likes, publish }) => {
    const router = useRouter();

    
    function likeOrLikes() {
        return likes > 1 ? (
            <p> {likes} likes</p>
        )
        :
        (
            <p> {likes} like</p>
        )
    }

    return (
        <div
            onClick={() => {
                router.push({
                    pathname: "/dashboard/chapitre/" + id,
                    query: { i: index }
                })
            }}
            className={styles.containerDashboard + ' '}>

            <div className={styles.headerChapter}>
                <h6>Chapitre {index} <span>{Capitalize(title)} {!publish && <>(brouillon)</>}  </span></h6>
            </div>

            <div className={styles.likeChapter}>
                <p>{likes} j&apos;aimes</p>
            </div>
        </div>
    )
}

export const CardChapterPublicPhone = ({ id, index, title, date_creation, likes, bookTitle }) => {
    
    const router = useRouter();
    const theme = useSelector(selectTheme);
    
    function likeOrLikes() {
        return likes > 1 ? (
            <p> {likes} likes</p>
        )
        :
        (
            <p> {likes} like</p>
        )
    }

    return (
        <div
            onClick={() => {
                router.push({
                    pathname: "/chapitre/" + id, query: {
                        name: bookTitle, slug: title, i: index
                    },
                })
            }}
            className={theme ? styles.containerPhone : styles.containerPhone + ' ' + styles.dark}>

            <div className={styles.headerChapter}>
                <h6>Chapitre {index}  <span>{title}</span></h6>
            </div>

            <div className={styles.likeChapter}>
                {
                    likeOrLikes()
                }
            </div>
        </div>
    )
}