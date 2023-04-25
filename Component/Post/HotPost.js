import styles from "../../styles/Component/Post/HotPost.module.scss";
import {ChevronDoubleRightIcon, ChevronDoubleUpIcon, CursorArrowRaysIcon} from "@heroicons/react/24/outline";
import {CountLike} from "../layouts/Btn/Like";
import {useRouter} from "next/router";
import {Capitalize} from "../../utils/String";
import {ArrowsPointingInIcon, ForwardIcon, HeartIcon,ChatBubbleLeftRightIcon} from "@heroicons/react/24/solid";
import BookSvg from "../layouts/Icons/BookSvg";

export const HotPost = ({img, title, category, author, nbChapter, description, likes, top,slug,id}) => {
    const router = useRouter();
    return (

        <div className={styles.container} onClick={() => router.push({
            pathname: '/livre/' + id,
            query: slug
        })}>
            <div className={styles.imgContainer}>
                <img src={img}/>
            </div>
            <div className={styles.thumbnail}>
            <CountLike like={121}/>
            </div>
            {
                top === true &&
                <div className={styles.sThumbnail}>
                    <p>Top du mois</p>
                </div>
            }

            <div className={styles.contentContainer}>
                <div className={styles.header}>
                    <h6>{title}</h6>
                    <p><span className={styles.category}>{category}</span> | <span
                        className={styles.author}>{author}</span> | <span
                        className={styles.nbChapter}>{nbChapter} chapitre(s)</span></p>
                </div>
                <div className={styles.description}>
                    <p>{description} {description} descriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescription</p>
                </div>
                <div></div>
            </div>
        </div>
    )
}

export const HotPostPhone = ({img, title, category, author, nbChapter, description, likes, top,slug,id}) => {
    return (
        <div data-after={Capitalize(category)} className={styles.containerPhone}>
            <div className={styles.headerPhone}>
                <img src={img} />
                <div className={styles.likeThumbnailPhone}>
                    <p>{likes} like(s)</p>
                </div>
                <div>
                    <p> Par <span className={styles.author}>{Capitalize(author)}</span>  </p>
                    <p>{nbChapter}1222 chapitre(s)</p>
                    </div>
            </div>
            <h6>{title}</h6>
            <p className={styles.descriptionPhone}> {description}           </p>
            <button className={styles.discoverPhone}>Découvrir <CursorArrowRaysIcon/></button>
        </div>
    )
}