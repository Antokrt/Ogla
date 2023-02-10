import styles from '../../../styles/Pages/email-verification/EmailError.module.scss';
import {useRouter} from "next/router";

const ExpiredEmail = () => {
    const router = useRouter();
    return (
        <div className={styles.container}>
            <h1>Désolé</h1>
            <p>Le lien de vérification a expiré. Veuillez demander une nouvelle vérification de votre e-mail.</p>
            <button onClick={() => router.replace('/')}>Accueil</button>
        </div>
    )
}

export default ExpiredEmail;