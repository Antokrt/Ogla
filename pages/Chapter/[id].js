import {useEffect, useLayoutEffect, useRef, useState} from "react";
import {getPost} from "../../services/Post";
import {useRouter} from "next/router";
import Header from "../../Component/Header";
import styles from "../../styles/Pages/ChapterPage.module.scss";
import scroll from "../../styles/utils/scrollbar.module.scss";
import {HeartIcon, UserCircleIcon} from "@heroicons/react/20/solid";
import {TagIcon} from "@heroicons/react/24/solid";
import {BookOpenIcon} from "@heroicons/react/24/solid";
import FooterOnChapter from "../../Component/Post/FooterOnChapter";
import SidebarPost from "../../Component/Post/SidebarCommentary";
import SidebarCommentary from "../../Component/Post/SidebarCommentary";
import SidebarChapter from "../../Component/Post/SidebarChapter";
import FooterOnBook from "../../Component/Post/FooterOnBook";
import ToogleSidebar from "../../utils/ToogleSidebar";
import HeaderOnChapter from "../../Component/Post/HeaderOnChapter";

const Chapter = () => {

    const router = useRouter();
    const headerFixed = useRef();
    const fHeader = useRef();
    const [hasToBeFixed, setHasToBeFixed] = useState(false);
    const [openSideBar, setOpenSidebar] = useState(false);
    const [sidebarSelect, setSidebarSelect] = useState("Disable");

    useLayoutEffect(() => {
        const divAnimate = headerFixed.current.getBoundingClientRect().top;
        const onScroll = (div) => {
            if (div < window.scrollY) {
                setHasToBeFixed(true);
            } else {
                setHasToBeFixed(false);
            }
        };

        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <div className={styles.container}>
            {
                 sidebarSelect === "Commentary" &&
                <div
                    className={sidebarSelect !== "None" ? styles.slideInRight + " " + styles.sidebar : styles.slideOut + " " + styles.sidebar}>
                    <SidebarCommentary select={sidebarSelect}/>
                </div>
            }

            {
                 sidebarSelect === "None" &&
                <div className={styles.slideOut + " " + styles.sidebar}>
                </div>
            }

            {
                sidebarSelect === "List" &&
                <div
                    className={sidebarSelect !== "None" ? styles.slideInRight + " " + styles.sidebar : styles.slideOut + " " + styles.sidebar}>
                    <SidebarChapter select={sidebarSelect}/>
                </div>
            }

            <div>
                <Header/>
                <HeaderOnChapter/>
            </div>

            <div
                className={styles.containerC}>

                <div
                    className={hasToBeFixed ? styles.fixedActive + " " + styles.bannerChapter : styles.fixedInitial + " " + styles.bannerChapter}
                    ref={headerFixed}
                >
                    <h3>Chapitre 1 - The Druid of Seoul Station</h3>

                    <div className={styles.thumbnailContainer}>
                        <p>Horreur <TagIcon/></p>
                        <p className={styles.mSide}>170 <HeartIcon/></p>
                        <p>56 chapitres <BookOpenIcon/></p>
                    </div>
                </div>

                <div
                    className={styles.contentChapter}>
                    <div className={styles.headerContent}>
                        <h5>Le commencement</h5>
                        <h6><UserCircleIcon/> Judy Mclaren</h6>
                    </div>
                    <div className={styles.nextChapterContainer}>

                    </div>


                    <p>
                        Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of
                        classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a
                        Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure
                        Latin
                        words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in
                        classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32
                        and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero,
                        written in 45 BC. This book is a treatise on the theory of ethics, very popular during the
                        Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in
                        section 1.10.32.

                        Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of
                        classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a
                        Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure
                        Latin
                        words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in
                        classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32
                        and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero,
                        written in 45 BC. This book is a treatise on the theory of ethics, very popular during the
                        Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in
                        section 1.10.32. Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots
                        in a piece of
                        classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a
                        Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure
                        Latin
                        words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in
                        classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32
                        and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero,
                        written in 45 BC. This book is a treatise on the theory of ethics, very popular during the
                        Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in
                        section 1.10.32. Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots
                        in a piece of
                        classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a
                        Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure
                        Latin
                        words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in
                        classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32
                        and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero,
                        written in 45 BC. This book is a treatise on the theory of ethics, very popular during the
                        Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in
                        section 1.10.32. Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots
                        in a piece of
                        classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a
                        Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure
                        Latin
                        words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in
                        classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32
                        and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero,
                        written in 45 BC. This book is a treatise on the theory of ethics, very popular during the
                        Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in
                        section 1.10.32.

                    </p>
                </div>

            </div>


            <FooterOnChapter
                openList={() => {
                    ToogleSidebar("List",sidebarSelect,setSidebarSelect);
                }}

                openCommentary={() => {
                    ToogleSidebar("Commentary",sidebarSelect,setSidebarSelect);
                }}
                img={"/assets/livre2.jpg"}/>
        </div>
    )
}

export default Chapter;