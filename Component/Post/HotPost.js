import styles from "../../styles/Component/Post/HotPost.module.scss";
import { BookOpenIcon } from "@heroicons/react/24/outline";
import { useSelector } from "react-redux";
import { selectTheme } from "../../store/slices/themeSlice";
import { useState } from "react";
import {ChevronDoubleRightIcon, ChevronDoubleUpIcon, CursorArrowRaysIcon} from "@heroicons/react/24/outline";
import {CountLike} from "../layouts/Btn/Like";
import {useRouter} from "next/router";
import {Capitalize} from "../../utils/String";
import {ArrowsPointingInIcon, ForwardIcon, HeartIcon,ChatBubbleLeftRightIcon} from "@heroicons/react/24/solid";
import BookSvg from "../layouts/Icons/BookSvg";
import {useEffect} from "react";
import {GetDefaultBookImgWhenError} from "../../utils/ImageUtils";
import {FormatCount, FormatLikesCount} from "../../utils/NbUtils";

export const HotPost = ({ img, title, category, author, nbChapter, description, likes, top, slug, id }) => {
    const router = useRouter();
    const theme = useSelector(selectTheme);

    return (
        <div tabIndex={0} className={theme ? styles.container : styles.darkContainer} onClick={() => router.push({
            pathname: '/livre/' + id,
            query: slug
        })}>
            <div className={styles.imgContainer}>
                <img src={img} onError={(e) => e.target.src = GetDefaultBookImgWhenError()} />
            </div>
            <div className={styles.thumbnail}>
                <CountLike like={likes} />
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
                    <div className={styles.labelList}>
                        <p>Par {Capitalize(author)}</p>
                        <img src={'/assets/category/icons/'+category.toLowerCase()+'.svg'}/>
                    </div>
                </div>
          {/*      {
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
                }*/}
                <div className={styles.description}>
                    <p>{Capitalize(description)}  </p>
                </div>
                <div></div>
            </div>

        </div>
    )
}

export const HotPostPhone = ({ img, title, category, author, nbChapter, description, likes, top, slug, id }) => {
    return (
        <div data-after={Capitalize(category)} className={styles.containerPhone}>
            <div className={styles.headerPhone}>
                <img src={img} onError={(e) => e.target.src = GetDefaultBookImgWhenError()} />
                <div className={styles.likeThumbnailPhone}>
                    <p>{FormatCount(likes)} j'aimes</p>
                </div>
                <div>
                    <p> Par <span className={styles.author}>{Capitalize(author)}</span>  </p>
                    <p>{FormatCount(nbChapter)} chapitres</p>
                </div>
            </div>
            <h6>{title}</h6>
            <p className={styles.descriptionPhone}> {Capitalize(description)}           </p>
            <button className={styles.discoverPhone}>Découvrir <CursorArrowRaysIcon/></button>
        </div>
    )
}