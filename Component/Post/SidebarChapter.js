import styles from "../../styles/Component/Post/SidebarChapter.module.scss";
import {useEffect, useState} from "react";
import {BarsArrowDownIcon, ChevronDoubleUpIcon, QueueListIcon} from "@heroicons/react/24/outline";
import {BookOpenIcon, HeartIcon} from "@heroicons/react/24/solid";
import {useRouter} from "next/router";


const SidebarChapter = ({chapters, title, changeFilter, filter, maxChapter, canSeeMore, getMoreChapter}) => {

    const [chapterList, setChapterList] = useState(chapters);

    const router = useRouter();

    useEffect(() => {
        setChapterList(chapters);
    }, [chapters])

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
            <div className={styles.chapterList}>

                {chapterList.map((item, index) => {
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
                                    Chapitre {chapterNumber} - {item.title}
                                </p>
                                <p className={styles.date}>{item.date_creation}</p>
                            </div>

                            <p className={styles.likes}>
                                {item.likes} <HeartIcon />
                            </p>
                        </div>
                    );
                })}


            </div>

        {
            canSeeMore &&
            <button onClick={getMoreChapter}>Voir plus</button>
        }

        </div>)
}

export default SidebarChapter;