import styles from "../../styles/Component/Post/HotPost.module.scss";
import {BookOpenIcon} from "@heroicons/react/24/outline";
import {useSelector} from "react-redux";
import {selectTheme} from "../../store/slices/themeSlice";
import {useState} from "react";
import {ChevronDoubleRightIcon, ChevronDoubleUpIcon, CursorArrowRaysIcon} from "@heroicons/react/24/outline";
import {CountLike} from "../layouts/Btn/Like";
import {useRouter} from "next/router";
import {Capitalize, ReduceString} from "../../utils/String";
import {ArrowsPointingInIcon, ForwardIcon, HeartIcon, ChatBubbleLeftRightIcon} from "@heroicons/react/24/solid";
import BookSvg from "../layouts/Icons/BookSvg";
import {useEffect} from "react";
import {GetDefaultBookImgWhenError, GetDefaultUserImg, GetDefaultUserImgWhenError} from "../../utils/ImageUtils";
import {FormatCount, FormatLikesCount} from "../../utils/NbUtils";
import Link from "next/link";

export const HotPost = ({img, title, category, author, authorImg, nbChapter, description, likes, top, slug, id}) => {
    const router = useRouter();
    const theme = useSelector(selectTheme);

    return (
        <div tabIndex={0} className={theme ? styles.container : styles.darkContainer} onClick={() => router.push({
            pathname: '/livre/' + id,
            query: slug
        })}>
            <div className={styles.imgContainer}>
                <img src={img} referrerPolicy={'no-referrer'}
                     onError={(e) => e.target.src = GetDefaultBookImgWhenError()} alt={'Book Picture Ogla'}/>
            </div>
            <div className={styles.thumbnail}>
                <CountLike like={likes}/>
            </div>
            {
                top === true &&
                <div className={styles.sThumbnail}>
                    <p>Top du mois</p>
                </div>
            }
            <div className={styles.contentContainer}>
                <div className={styles.header}>
                    <div className={styles.labelList}>
                        <div className={styles.authorPic}>
                            <img referrerPolicy={'no-referrer'} className={styles.pic} src={authorImg}
                                 onError={(e) => e.target.src = GetDefaultUserImgWhenError()}
                                 alt={'Ecrivain Profil Ogla'}/>
                            <p>Par <span>{Capitalize(author)} </span></p></div>
                        <p className={styles.likes}>{Capitalize(category)}</p>
                    </div>
                    <h6>{ReduceString(title, 60)}</h6>

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
                    <p>{Capitalize(description)}</p>
                </div>
                <div></div>
            </div>

        </div>
    )
}

export const HotPostPhone = ({img, title, category, author, nbChapter, description, likes, top, slug, id}) => {
    const router = useRouter();
    return (
        <div data-after={Capitalize(category)} className={styles.containerPhone}>
            <div className={styles.headerPhone}>
                <img alt={'Image Livre Ogla'} src={img} onError={(e) => e.target.src = GetDefaultBookImgWhenError()}/>
                <div className={styles.likeThumbnailPhone}>
                    <p>{FormatCount(likes)} <HeartIcon/></p>
                </div>
                <div>
                    <p> Par <span className={styles.author}>{Capitalize(author)}</span></p>
                    <p>{FormatCount(nbChapter)} chapitres</p>
                </div>
            </div>
            <h6>{title}</h6>
            <p className={styles.descriptionPhone}> {Capitalize(description)}           </p>
            <button onClick={() => router.push({
                pathname: '/livre/' + id,
                query: slug
            })} className={styles.discoverPhone}>Découvrir <CursorArrowRaysIcon/></button>
        </div>
    )
}