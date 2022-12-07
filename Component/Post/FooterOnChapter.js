import styles from "../../styles/Component/Post/FooterOnPost.module.scss"
import {
    ArrowLeftCircleIcon,
    ArrowLeftIcon,
    ArrowRightCircleIcon,
    ArrowRightIcon,
    ChatBubbleBottomCenterTextIcon,
    ChevronDoubleLeftIcon,
    ChevronDoubleRightIcon,
    ChevronDoubleUpIcon, ChevronLeftIcon,
    ChevronRightIcon,
    HeartIcon,
    QueueListIcon
} from "@heroicons/react/24/outline";
import {useState} from "react";
import SidebarPost from "./SidebarCommentary";



const FooterOnChapter = ({openCommentary,openList,img}) => {

    const [openSidebar,setOpenSidebar ] = useState(true);



    return (<div className={styles.container}>
        <div className={styles.titleContainer}>
            <img src={img}/>
            <div>
                <h7>Chapitre 1 : Le commencement</h7>
                <p>123 likes - 212 commentaires - Judy McLaren</p>
            </div>


        </div>

        <div className={styles.likeContainer}>
            <div>
                <ChevronLeftIcon/>
                <p>Précédent (Ch.5)</p>
            </div>

            <div>
                <HeartIcon/>
                <p>J'aime (123)</p>
            </div>

            <div>
                <ChevronRightIcon/>
                <p>Suivant (Ch.7)</p>
            </div>
        </div>

        <div className={styles.commentAndListContainer}>

            <div onClick={openCommentary}>
                <ChatBubbleBottomCenterTextIcon/>
                <p>Commentaires (219)</p>
            </div>

            <div onClick={openList}>
                <QueueListIcon/>
                <p>Chapitres (56)</p>
            </div>
        </div>



    </div>)
}

export default FooterOnChapter;