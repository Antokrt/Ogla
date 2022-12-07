import styles from "../../styles/Component/Post/PreviewHorizontalPost.module.scss";
import {ChevronDoubleUpIcon} from "@heroicons/react/24/outline";

const PreviewHorizontalPost = ({title,src,rank,author,nbChapter,nbLikes,category}) => {
    return (
<div className={styles.container}>
    <div className={styles.imgContainer}>
        <img src={src}/>
    </div>
    <div className={styles.rankContainer}>
        <p>{rank}</p>
    </div>
    <div className={styles.thumbnail}>
        <p>{category}</p>
    </div>

    <div className={styles.contentContainer}>
        <h5>{title}</h5>
        <p><span>{author}</span>    {nbLikes}  <ChevronDoubleUpIcon/></p>
    </div>
</div>
    )
}

export default PreviewHorizontalPost;