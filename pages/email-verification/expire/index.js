import styles from '../../../styles/Pages/email-verification/EmailError.module.scss';
import {useRouter} from "next/router";

const ExpiredEmail = () => {
    const router = useRouter();
    return (
        <div className={styles.container}>
            <img src={'/assets/jim/angry4.png'}/>
            <h1>Désolé...</h1>
            <p>Le lien de vérification <strong>OGLA </strong> a expiré. Veuillez demander une nouvelle vérification...</p>
            <button onClick={() => router.replace('/')}>Accueil</button>
        </div>
    )
}

export default ExpiredEmail;