import styles from "../../styles/Component/Post/SidebarCommentary.module.scss";
import scroll from "../../styles/utils/scrollbar.module.scss";
import {useEffect, useState} from "react";
import {CheckBadgeIcon} from "@heroicons/react/20/solid";
import {BookOpenIcon, QueueListIcon} from "@heroicons/react/24/outline";
import {PaperAirplaneIcon} from "@heroicons/react/24/solid"
import Commentary from "./Commentary/Commentary";
import {useRouter} from "next/router";


const SidebarCommentary = ({title,author,comments}) => {
    const router = useRouter();
    const [menuCollapse, setMenuCollapse] = useState(false);
    const [typeFilter,setTypeFilter] = useState([
        "Populaire(s)",
        "Récent(s)",
        "Ancien(s)",
    ]);
    const [selectFilter, setSelectFilter] = useState("Récent(s)");


    return(
<div className={styles.container}>
    <div className={styles.headerComment}>
        <p><QueueListIcon/>{title}</p>
        <p onClick={() => router.push("/auteur/" + "Judy McLaren")}><span>{author}</span></p>
    </div>
    <div className={styles.titleSection}>
        <h5>Commentaire(s) <span>({comments?.length})</span></h5>
        <div>
    {typeFilter.map((item)=> <p onClick={() => setSelectFilter(item)} className={selectFilter === item ? styles.filterActive : ""}>{item}</p>)}
        </div>
    </div>

    <div className={styles.contentCommentaryContainer + " " + scroll.scrollbar}>
        {
            comments.map((item,index) => {
                return (
                    <Commentary
                    content={item.content}
                    likes={item.likes}
                    img={item.img}
                    date={item.date_creation}
                    pseudo={item.pseudo}
                    answers={21}
                    />
                )
            })
        }
    </div>



    <div className={styles.commentaryContainer}>
        <div className={styles.formContainer}>
            <textarea className={scroll.scrollbar} type="textarea" placeholder="Ecrire un commentaire..."/>
        </div>

        <div className={styles.sendContainer}><PaperAirplaneIcon/>
        </div>
    </div>
</div>
    )
}

export default SidebarCommentary;