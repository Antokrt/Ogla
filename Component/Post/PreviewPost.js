import React from "react";
import styles from "../../styles/Component/Post/PreviewPost.module.scss";
import {useRouter} from "next/router";
import {BookOpenIcon, HeartIcon} from "@heroicons/react/24/solid";
import {ChevronDoubleUpIcon} from "@heroicons/react/24/solid";
import {DocumentTextIcon, UserCircleIcon} from "@heroicons/react/24/outline";
import Like from "../layouts/Icons/Like";
import IconChapter from "../layouts/Icons/Chapter";
import {CountLike} from "../layouts/Btn/Like";
import {Capitalize} from "../../utils/String";


const PreviewPost = ({title, snippet, like, category, author, nbChapter ,img, slug,id}) => {


    const router = useRouter();

    const goToCategory = (link,query) => {
        router.push(
            {
                pathname:link,
                query:{cat:props.category}
            }

        )
    }

    return (
        <div className={styles.container}
             onClick={() => {
                 router.push({
                     pathname: '/livre/' + id,
                     query: slug
                 })
             }}
        >

            <div className={styles.snippet}>
                <h7>{title}</h7>
<p>{Capitalize(snippet)}</p>
            </div>
            <div className={styles.containerImg}>
                <img src={img}/>
            </div>

            <div className={styles.containerTitle}>
                <h5>{title}</h5>
                <p> Par {author}</p>
            </div>

            <div className={styles.thumbnail}>
                <CountLike like={like}/>
            </div>


        </div>
    );
}

export default PreviewPost;