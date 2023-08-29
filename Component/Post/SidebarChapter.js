import styles from "../../styles/Component/Post/SidebarChapter.module.scss";
import anim from '../../styles/utils/anim.module.scss';
import {useEffect, useRef, useState} from "react";
import {ArrowDownIcon, BarsArrowDownIcon, ChevronDoubleUpIcon, QueueListIcon} from "@heroicons/react/24/outline";
import {BookOpenIcon, HeartIcon} from "@heroicons/react/24/solid";
import {useRouter} from "next/router";
import {LoaderCommentary} from "../layouts/Loader";
import {Capitalize} from "../../utils/String";
import {FormatDateFrom, FormatDateStr} from "../../utils/Date";
import {TextSeeMore, TextSeeMoreSidebarChapter} from "../layouts/Btn/ActionBtn";
import ErrMsg from "../ErrMsg";
import ScreenSize from "../../utils/Size";


const SidebarChapter = ({
                            chapters,
                            title,
                            changeFilter,
                            filter,
                            canSeeMore,
                            getMoreChapter,
                            author,
                            bookTitle,
    errChapters,
                            nbChapters,
                            bookId,
                            bookSlug,
                            loadingScroll,
                            canScroll
                        }) => {

    const [chapterList, setChapterList] = useState(chapters);
    const [seeBtnAddMore, setSeeBtnAddMore] = useState(false);
    const divRef = useRef(null);
    const [width, height] = ScreenSize();

    const router = useRouter();

    /*    useEffect(() => {
            const div = divRef.current;

            const handleScroll = () => {
                const threshold = 1;
                const isBottom =
                    div.scrollHeight - (div.scrollTop + div.clientHeight) <= threshold;
                console.log({isBottom,canScroll,loadingScroll,canSeeMore})
                if (isBottom && !loadingScroll && canSeeMore) {
                    loadingScroll = true;
                    getMoreChapter();
                }
            };
            div.addEventListener("scroll", handleScroll);
            return () => {
                div.removeEventListener("scroll", handleScroll);
            };
        }, [canScroll]);*/


    useEffect(() => {
        setChapterList(chapters);
    }, [chapters])

    const scrollToBottom = () => {
        return setTimeout(() => {
            divRef.current.scrollTop = divRef.current.scrollHeight;
        },100)
    }


    const scrollToTop = () => {
        return setTimeout(() => {
            divRef.current.scrollTop = 0;
        },10)
    }

    if(errChapters){
        return (
            <div className={styles.container}>
                <div className={styles.headerComment}>
                    <p><QueueListIcon/> <span onClick={() => router.push({
                        pathname: '/livre/' + bookId,
                        query: bookSlug
                    })}>{Capitalize(bookTitle)} </span>  &nbsp;({nbChapters} chapitres)</p>
                    <p><span>logo</span></p>
                </div>

                <div className={styles.titleSection}>
                    <h5>Tous les chapitres</h5>
                    <div>

                        <BarsArrowDownIcon />
                    </div>
                </div>

                <div className={styles.errContainer}>
                    <h4>Erreur</h4>
                    <p>Impossible de récupérer les chapitres.</p>
                </div>


            </div>
        )
    }

    else return (<div className={styles.container}>

        <div className={styles.headerComment}>
            <p><QueueListIcon/> <span onClick={() => router.push({
                pathname: '/livre/' + bookId,
                query: bookSlug
            })}>{Capitalize(bookTitle)} </span>  &nbsp;({nbChapters} chapitres)</p>
            <p><span>logo</span></p>
        </div>

        <div className={styles.titleSection}>
            <h5>Tous les chapitres</h5>
            <div>

                <BarsArrowDownIcon onClick={() => {
                    setSeeBtnAddMore(false);
                    changeFilter();
                    scrollToTop();
                }}/>
            </div>
        </div>
        {/*
            <div className={styles.banner}>
                <img src={"/assets/livre2.jpg"} alt={"Image de l'oeuvre"}/>
                <div className={styles.containerDescription}>
                    <p className={tooLong ? styles.cut : " "}>{descriptionPost}</p>
                    {
                        tooLong &&
                        <p
                            onClick={() => {
                                setTooLong(!tooLong)
                            }
                            }
                            className={styles.seeMore}>Voir plus</p>
                    }

                    {
                        sizeCommentary > 200 && tooLong === false &&
                        <p
                            onClick={() => setTooLong(true)}
                            className={styles.seeMore}>Voir moins</p>
                    }
                </div>



            </div>
*/}

        {
            !chapterList &&
            <div className={styles.err + ' ' + anim.fadeIn}>
                <img src={'/assets/jim/angry4.png'}/>
                <h4>Oups !</h4>
                <p>Impossible de récupérer les chapitres. </p>

            </div>
        }
        <div className={styles.chapterList} ref={divRef}>

            {
                width <= 900 &&
                <h3 className={styles.chapterTitleResp}>Chapitres ({nbChapters})</h3>

            }

            {chapterList && chapterList.map((item, index) => {
                let chapterNumber;
                if (filter === "recent") {
                    chapterNumber = nbChapters - index;
                } else {
                    chapterNumber = index + 1;
                }
                return (
                    <div
                        className={styles.item + ' ' + anim.fadeIn}
                        onClick={() => {
                            router.push({
                                pathname: "/chapitre/" + item._id,
                                query: {
                                    name: title,
                                    slug: title,
                                    i: chapterNumber
                                }
                            });
                        }}
                    >
                        <div className={styles.titleChapter}>

                            <p className={styles.title}>Chapitre {chapterNumber}</p>
                            <span>                                 {Capitalize(item.title)}</span>
                        </div>

                        <p className={styles.likes}>
                            {item.likes} <HeartIcon/>
                        </p>

                    </div>


                );
            })}

            <div className={styles.seeMore}>


                {
                    canSeeMore && !loadingScroll && chapterList && nbChapters > chapterList.length &&
                   <button onClick={() => {
                       getMoreChapter().then(() => {
                           scrollToBottom();
                       })
                   }}>Voir plus</button>
                }
                {
                    loadingScroll && chapterList &&
                    <LoaderCommentary/>
                }
            </div>
        </div>

    </div>)
}

export default SidebarChapter;