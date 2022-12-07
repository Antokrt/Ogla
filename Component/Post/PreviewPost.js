import React from "react";
import styles from "../../styles/Component/Post/PreviewPost.module.scss";
import {useRouter} from "next/router";
import {BookOpenIcon, HeartIcon} from "@heroicons/react/24/solid";
import {ChevronDoubleUpIcon} from "@heroicons/react/24/solid";
import {DocumentTextIcon, UserCircleIcon} from "@heroicons/react/24/outline";
import Like from "../layouts/Icons/Like";
import IconChapter from "../layouts/Icons/Chapter";


const PreviewPost = (props) => {


const { title, snippet, like, category, author, nbChapter ,img} = props;
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
    <div className={styles.container}>
        <div className={styles.thumbnail}>
<p>{props.category}</p>
        </div>
<div className={styles.image}>
    <img src={props.img}/>
</div>
        <div className={styles.content}>
            <h5>{props.title}</h5>
            <p className={styles.snippet}>{props.snippet}</p>
            <div className={styles.stats}>

                <div>
                    {
                        router.pathname !== "/auteur/[id]" ?
                        <p title={"Découvrez " + props.author} className={styles.author} style={{
                            cursor:"pointer"
                        }}
                        onClick={() => {
                        router.push('/User/'+ props.author)
                        }
                        }
                        >{props.author}</p>
                        :
                            <p className={styles.author}>{props.author}</p>
                    }
                </div>


                <div>
                    <p className={styles.like}>{props.like} </p>
                    <ChevronDoubleUpIcon/>
                </div>

            </div>
        </div>


    </div>
)
}

export default PreviewPost;