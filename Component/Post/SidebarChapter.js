import styles from "../../styles/Component/Post/SidebarChapter.module.scss";
import {useEffect, useRef, useState} from "react";
import {ArrowDownIcon, BarsArrowDownIcon, ChevronDoubleUpIcon, QueueListIcon} from "@heroicons/react/24/outline";
import {BookOpenIcon, HeartIcon} from "@heroicons/react/24/solid";
import {useRouter} from "next/router";
import {LoaderCommentary} from "../layouts/Loader";
import {Capitalize} from "../../utils/String";
import {FormatDateFrom, FormatDateStr} from "../../utils/Date";


const SidebarChapter = ({
                            chapters,
                            title,
                            changeFilter,
                            filter,
                            maxChapter,
                            canSeeMore,
                            getMoreChapter,
                            author,
                            bookTitle,
                            nbChapters,
                            bookId,
                            bookSlug,
                            loadingScroll,
                            canScroll
                        }) => {

    const [chapterList, setChapterList] = useState(chapters);
    const [seeBtnAddMore, setSeeBtnAddMore] = useState(false);
    const divRef = useRef(null);
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

    const scrollToTop = () => {
        return new Promise((resolve, reject) => {
            divRef.current.scrollTop = 0;
            resolve();
        })
    }


    return (<div className={styles.container}>

        <div className={styles.headerComment}>
            <p><QueueListIcon/> <span onClick={() => router.push({
                pathname: '/livre/' + bookId,
                query: bookSlug
            })}>{Capitalize(bookTitle)} </span>  &nbsp; ({nbChapters} chapitre(s))</p>
            <p onClick={() => router.push('/auteur/' + 'Judy McLaren')}><span>{author}</span></p>
        </div>

        <div className={styles.titleSection}>
            <h5>{title}</h5>
            <div>

                <BarsArrowDownIcon onClick={() => {
                    setSeeBtnAddMore(false);
                    changeFilter();
                    scrollToTop()
                        .then(() => setSeeBtnAddMore(true))
                        .catch(() => setSeeBtnAddMore(true));
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
        <div className={styles.chapterList} ref={divRef}>

            {chapterList && chapterList.map((item, index) => {
                let chapterNumber;
                if (filter === "recent") {
                    chapterNumber = maxChapter - index;
                } else {
                    chapterNumber = index + 1;
                }
                return (
                    <div
                        className={styles.item}
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
                            <p className={styles.title}>
                                <span>Chapitre {chapterNumber} :</span> {Capitalize(item.title)}
                            </p>
                            <p className={styles.date}>{FormatDateStr(item.date_creation)}</p>
                        </div>

                        <p className={styles.likes}>
                            {item.likes} like(s)
                        </p>

                    </div>


                );
            })}
            {
                !loadingScroll && canSeeMore &&
                <div className={styles.seeMore}>
                    <button onClick={() => getMoreChapter()}><ArrowDownIcon/></button>
                </div>
            }
        </div>

    </div>)
}

export default SidebarChapter;