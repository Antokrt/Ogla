import styles from "../../styles/Layouts/LogCard.module.scss"
import {ArrowLeftIcon} from "@heroicons/react/24/outline";
import {router} from "next/router";

const LogCard = () => {

    return (
        <div className={styles.container}>
            <div className={styles.thumbnail}>Ouvert à tous</div>
            <h5>Deviens <span>écrivain</span></h5>
            <div className={styles.statsContainer}>
                <div className={styles.item}>
                    <p className={styles.stats}> 219</p>
                    <p className={styles.label}>Créateurs</p>
                </div>
                <div className={styles.item}>
                    <p className={styles.stats}> 123</p>
                    <p className={styles.label}>Livres</p>
                </div>
                <div className={styles.item}>
                    <p className={styles.stats}> 2120</p>
                    <p className={styles.label}>Utilisateurs</p>
                </div>
            </div>
            <div className={styles.why}>
                <button onClick={() => router.push("/devenir-ecrivain")}>Pourquoi pas toi ?</button>
            </div>

        </div>
)
}

export default LogCard;