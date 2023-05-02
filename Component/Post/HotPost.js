import styles from "../../styles/Component/Post/HotPost.module.scss";
import { BookOpenIcon, ChevronDoubleUpIcon } from "@heroicons/react/24/outline";
import { CountLike } from "../layouts/Btn/Like";
import { useRouter } from "next/router";
import { Capitalize } from "../../utils/String";
import { HeartIcon } from "@heroicons/react/24/solid";
import { useSelector } from "react-redux";
import { selectTheme } from "../../store/slices/themeSlice";
import { useState } from "react";

export const HotPost = ({ img, title, category, author, nbChapter, description, likes, top, slug, id }) => {
    const router = useRouter();
    const theme = useSelector(selectTheme);
    const [option, setOption] = useState(false);

    return (
        <div className={theme ? styles.container : styles.darkContainer} onClick={() => router.push({
            pathname: '/livre/' + id,
            query: slug
        })} onMouseEnter={() => setOption(true)} onMouseLeave={() => setOption(false)}>
            <div className={styles.imgContainer}>
                <img src={img} />
            </div>
            <div className={styles.thumbnail}>
                <CountLike like={likes} />
            </div>
            {
                top === true &&
                <div className={styles.sThumbnail}>
                    <p>Top du mois !</p>
                </div>
            }
            <div className={styles.contentContainer}>
                <div className={styles.header}>
                    <h6>{title}</h6>
                    <p>
                        <span className={styles.author}>
                            {author}
                        </span>
                        <span className={styles.category}>
                            {category}
                        </span>
                        <span className={styles.nbChapter}>
                            Chapitre n°{nbChapter}
                        </span>
                    </p>
                </div>
                {
                    theme &&
                    <div className={styles.Tdescription}>
                    </div>
                }
                {
                    !theme &&
                    <div className={styles.titleDesc}>
                        <div className={styles.bef}> </div>
                        <h4>Résumé</h4>
                        <div className={styles.aft}> </div>
                    </div>
                }
                <div className={styles.description}>
                    <p>{description}</p>
                </div>
                <div></div>
            </div>
            {
                option &&
                <div className={styles.option}>
                    <BookOpenIcon /> Lire
                </div>
            }
        </div>
    )
}

export const HotPostPhone = ({ img, title, category, author, nbChapter, description, likes, top, slug, id }) => {
    return (
        <div className={styles.containerPhone}>
            <div className={styles.headerPhone}>
                <img src={img} />
                <div className={styles.likeThumbnailPhone}>
                    <p>{likes}</p>
                    <HeartIcon />
                </div>
                <div>
                    <p> Par <span className={styles.author}>{author}</span>  </p>
                    <p>{nbChapter}1222 chapitre(s)</p>
                    <p> {category}</p>
                </div>
            </div>
            <h6>{title}</h6>
            <p className={styles.descriptionPhone}> {description}           </p>
            <button>Découvrir</button>
        </div>
    )
}