import styles from '../../../styles/Pages/email-verification/EmailError.module.scss';
import {useRouter} from "next/router";

const ExpiredEmail = () => {
    const router = useRouter();
    return (
        <div className={styles.container}>
            <img src={'/assets/diapo/mountain.png'}/>
            <h1>Désolé</h1>
            <p>Le lien pour modifier votre mot de passe a expiré. Veuillez <span className={styles.retry} onClick={() =>{
                router.replace({
                    pathname:'/auth',
                    query:'forgotPassword'
                })
            } }>réessayer</span></p>
            <button onClick={() => router.replace('/')}>Accueil</button>
        </div>
    )
}

export default ExpiredEmail;