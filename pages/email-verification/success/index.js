import styles from '../../../styles/Pages/email-verification/EmailSuccess.module.scss';
import {useRouter} from "next/router";
import {useEffect} from "react";
import {GetPrivateProfilApi, GetPublicProfilApi} from "../../api/user";

export async function getServerSideProps({req, query}) {
    const userId = query.id;
    const profil = await GetPublicProfilApi(userId);
    return {
        props:{
            profilData: profil.profilJson,
            errData: profil.err
        }
    }
}
const SuccessVerificationEmailPage = ({profilData}) => {

    const router = useRouter();

    useEffect(() =>  {
        const timer = setTimeout(() => {
            // router.replace('/')
        },5000);
        return () => clearTimeout(timer);
    },[])

    return (
        <div className={styles.container}>
            <h1>Email vérifiée !</h1>
            <p>Félicitations <span>{profilData?.pseudo} !</span> <br/> Votre e-mail a été vérifié avec succès </p>
            <p>Vous allez être redirigé vers l'accueil dans quelques secondes , bonne lecture sur <strong>Ogla</strong> !</p>
            <button onClick={() => router.replace('/')}>Accueil</button>
        </div>
    )

}

export default SuccessVerificationEmailPage;