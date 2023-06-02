import styles from '../styles/Pages/404.module.scss'
import {HomeIcon} from "@heroicons/react/24/solid";
import {useRouter} from "next/router";

export default function Custom404(){

    const router = useRouter();
    return (
        <div className={styles.container} data-after={'404'}>
            <div className={styles.logo}>
                <img src={'/assets/diapo/book.png'}/>
            </div>
            <img className={styles.img} src={'/assets/diapo/old.png'}/>
            <p>Oups ! La page est introuvable (404)</p>
            <button onClick={() => router.push('/')}>Retour à l'accueil <HomeIcon/></button>
        </div>
    )
}