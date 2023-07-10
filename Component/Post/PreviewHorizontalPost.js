import styles from "../../styles/Component/Post/PreviewHorizontalPost.module.scss";
import {AuthorComponent, BookTitle} from "../layouts/Text";
import {HeartIcon} from "@heroicons/react/20/solid";
import {Capitalize} from "../../utils/String";
import {useRouter} from "next/router";
import {GetDefaultBookImgWhenError} from "../../utils/ImageUtils";
import {FormatCount} from "../../utils/NbUtils";

const PreviewHorizontalPost = ({title, src, rank, author, nbChapter,id, slug, nbLikes, category}) => {

    const router = useRouter();
    return (
        <div className={styles.container} onClick={() => router.push({
            pathname: '/livre/' + id,
            query: slug
        })}>
            <img onError={(e) => e.target.src = GetDefaultBookImgWhenError()} alt={'Image Livre Ogla'} src={src}/>
            <div className={styles.rankContainer}>
                <p>{rank}</p>
            </div>
            <div className={styles.thumbnail}>
                <p>{FormatCount(nbLikes)}</p>
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