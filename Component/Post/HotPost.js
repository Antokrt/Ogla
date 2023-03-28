import styles from "../../styles/Component/Post/HotPost.module.scss";
import {ChevronDoubleUpIcon} from "@heroicons/react/24/outline";
import {CountLike} from "../layouts/Btn/Like";

const HotPost = ({img, title, category, author, nbChapter, description, likes, top}) => {
    return (

        <div className={styles.container}>
            <div className={styles.imgContainer}>
                <img src={img}/>
            </div>
            <div className={styles.thumbnail}>
            <CountLike like={likes}/>
            </div>
            {
                top === true &&
                <div className={styles.sThumbnail}>
                    <p>Top novembre !</p>
                </div>
            }

            <div className={styles.contentContainer}>
                <div className={styles.header}>
                    <h6>{title}</h6>
                    <p><span className={styles.category}>{category}</span> | <span
                        className={styles.author}>{author}</span> | <span
                        className={styles.nbChapter}>{nbChapter} chapitres</span></p>
                </div>
                <div className={styles.description}>
                    <p>{description}</p>
                </div>
                <div></div>
            </div>
        </div>
    )
}

export default HotPost;