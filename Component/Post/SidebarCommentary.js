import styles from "../../styles/Component/Post/SidebarCommentary.module.scss";
import scroll from "../../styles/utils/scrollbar.module.scss";
import {useState} from "react";
import {CheckBadgeIcon} from "@heroicons/react/20/solid";
import {BookOpenIcon, QueueListIcon} from "@heroicons/react/24/outline";
import {PaperAirplaneIcon} from "@heroicons/react/24/solid"
import Commentary from "./Commentary/Commentary";
import {useRouter} from "next/router";


const SidebarCommentary = (props) => {
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
        <p><QueueListIcon/>Chapitre 1 - Le commencement</p>
        <p onClick={() => router.push("/auteur/" + "Judy McLaren")}><span>Judy McLaren</span></p>
    </div>
    <div className={styles.titleSection}>
        <h5>Commentaires <span>(657)</span></h5>
        <div>
    {typeFilter.map((item)=> <p onClick={() => setSelectFilter(item)} className={selectFilter === item ? styles.filterActive : ""}>{item}</p>)}
        </div>
    </div>

    <div className={styles.contentCommentaryContainer + " " + scroll.scrollbar}>
        <Commentary commentary={"C'est vraiment incroyable j'adore ce chapitre chapitrechapitrechapitrechapitrechapitrechapitrechapitrechapitrechapitrechapitrechapitrechapitrechapitrechapitrechapitrechapitrechapitrechapitrechapitrechapitrechapitrechapitrechapitrechapitrechapitrechapitrechapitrechapitrechapitrechapitrechapitrechapitrechapitrechapitrechapitrechapitrechapitreje sens mes pouvoirs grandirent Aaaaaaaaaaaaaaarhsssssssssss grandirentgrandirentgrandirentgrandirentgrandirentgrandirentgrandirentgrandirentgrandirentgrandirentgrandirentgrandirentgrandirentgrandirentgrandirentgrandirent"}/>
        <Commentary commentary={"Eh oui ca yest je suis de retour"}/>
        <Commentary commentary={"C'est trop nul je signale OGLA au gouvernement"}/>
        <Commentary/>
        <Commentary/>
        <Commentary/>
        <Commentary/>
        <Commentary/>
        <Commentary/>
        <Commentary/>
        <Commentary/>
        <Commentary/>
        <Commentary/>
        <Commentary/>
        <Commentary/>
        <Commentary/>
        <Commentary/>
        <Commentary/>
        <Commentary/>
        <Commentary/>

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