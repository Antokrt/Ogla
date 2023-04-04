import styles from "../../styles/Component/Post/PreviewHorizontalPost.module.scss";
import {AuthorComponent, BookTitle} from "../layouts/Text";
import {HeartIcon} from "@heroicons/react/20/solid";
import {Capitalize} from "../../utils/String";
import {useRouter} from "next/router";

const PreviewHorizontalPost = ({title, src, rank, author, nbChapter,id, slug, nbLikes, category}) => {

    const router = useRouter();
    return (
        <div className={styles.container} onClick={() => router.push({
            pathname: '/livre/' + id,
            query: slug
        })}>
            <img src={src}/>
            <div className={styles.rankContainer}>
                <p>{rank}</p>
            </div>
            <div className={styles.thumbnail}>
                <p>{nbLikes}</p>
                <HeartIcon/>
            </div>

            <div className={styles.contentContainer}>
                <h5>{Capitalize(title)}</h5>
                <AuthorComponent pseudo={author}/>
            </div>
        </div>
    )
}

export default PreviewHorizontalPost;