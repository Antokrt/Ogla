import styles from "../../styles/Component/Post/SidebarChapter.module.scss";
import {useEffect, useRef, useState} from "react";
import {BarsArrowDownIcon, ChevronDoubleUpIcon, QueueListIcon} from "@heroicons/react/24/outline";
import {BookOpenIcon, HeartIcon} from "@heroicons/react/24/solid";
import {useRouter} from "next/router";
import {LoaderCommentary} from "../layouts/Loader";


const SidebarChapter = ({
                            chapters,
                            title,
                            changeFilter,
                            filter,
                            maxChapter,
                            canSeeMore,
                            getMoreChapter,
                            loadingScroll,
                            canScroll
                        }) => {

    const [chapterList, setChapterList] = useState(chapters);
    const divRef = useRef(null);
    const router = useRouter();

    useEffect(() => {
        const div = divRef.current;

        const handleScroll = () => {
            const threshold = 1;
            const isBottom =
                div.scrollHeight - (div.scrollTop + div.clientHeight) <= threshold;
            if (isBottom && canScroll && !loadingScroll) {
                getMoreChapter();
            }
        };
        div.addEventListener("scroll", handleScroll);
        return () => {
            div.removeEventListener("scroll", handleScroll);
        };
    }, [canScroll, loadingScroll]);


    useEffect(() => {
        setChapterList(chapters);
    }, [chapters])

    useEffect(() => {
        console.log(chapters)
    }, [])


    return (<div className={styles.container}>

        <div className={styles.headerComment}>
            <p><QueueListIcon/>{title}</p>
            <p onClick={() => router.push('/auteur/' + 'Judy McLaren')}><span>Judy McLaren</span></p>
        </div>

        <div className={styles.titleSection}>
            <h5>{title}</h5>
            <h1>{filter} + {maxChapter}</h1>
            <div>
                <BarsArrowDownIcon onClick={changeFilter}/>
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
                console.log(chapterNumber)
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
                                Chapitre {chapterNumber} - {item.title}
                            </p>
                            <p className={styles.date}>{item.date_creation}</p>
                        </div>

                        <p className={styles.likes}>
                            {item.likes} <HeartIcon/>
                        </p>
                    </div>
                );
            })}


        </div>

        {
            canSeeMore &&
            <button onClick={getMoreChapter}>Voir plus</button>
        }

        {
            loadingScroll &&
            <div className={styles.loaderContainer}><LoaderCommentary/></div>
        }

    </div>)
}

export default SidebarChapter;