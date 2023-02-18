import React from "react";
import styles from "../../styles/Component/Post/PreviewPost.module.scss";
import {useRouter} from "next/router";
import {BookOpenIcon, HeartIcon} from "@heroicons/react/24/solid";
import {ChevronDoubleUpIcon} from "@heroicons/react/24/solid";
import {DocumentTextIcon, UserCircleIcon} from "@heroicons/react/24/outline";
import Like from "../layouts/Icons/Like";
import IconChapter from "../layouts/Icons/Chapter";


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
    pathname:'/livre/'+ id,
    query:slug
})
    }}
    >
        <div className={styles.thumbnail}>
<p>{category}</p>
        </div>
<div className={styles.image}>
    <img src={img}/>
</div>
        <div className={styles.content}>
            <h5>{title}</h5>
            <p className={styles.snippet}>{snippet}</p>
            <div className={styles.stats}>

                <div>
                    {
                        router.pathname !== "/auteur/[id]" ?
                        <p title={"Découvrez " + author} className={styles.author} style={{
                            cursor:"pointer"
                        }}
                        onClick={() => {
                        router.push('/User/'+ author)
                        }
                        }
                        >{author}</p>
                        :
                            <p className={styles.author}>{author}</p>
                    }
                </div>


                <div>
                    <p className={styles.like}>{like} </p>
                    <ChevronDoubleUpIcon/>
                </div>

            </div>
        </div>


    </div>
)
}

export default PreviewPost;