import styles from '../../../styles/Pages/email-verification/EmailSuccess.module.scss';
import {useRouter} from "next/router";
import React, {useEffect} from "react";
import {GetPrivateProfilApi, GetPublicProfilApi} from "../../api/user";
import axios from "axios";
import {instance} from "../../../service/config/Interceptor";
import {ReloadSession} from "../../../utils/ReloadSession";
import Head from "next/head";
import {GetImgPathOfAssets} from "../../../utils/ImageUtils";
import {GetApiPath} from "../../api/utils/Instance";

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

    const updateSession = async () => {
        await instance.get(GetApiPath() +'/api/auth/session?email-verified');
    }

  useEffect(() =>  {
        updateSession()
            .then(() => {
                const timer = setTimeout(() => {
                    router.replace('/');
                },5000);
                return () => clearTimeout(timer);
            })
    },[])

    return (
        <div className={styles.container}>
            <Head>
                <title>Ogla - Email vérification</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"/>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <img
                alt={'Image Success Ogla'}
                onError={(e) => e.target.src = '/assets/diapo/old.png'}
                src={GetImgPathOfAssets() + 'diapo/old.png'}/>

            <h1>Email vérifiée !</h1>
            <p> <span>{profilData?.pseudo}</span>, votre email a été vérifié avec succès. </p>
            <p>Vous allez être redirigé vers l&apos;accueil dans quelques secondes , bonne lecture sur <strong>Ogla</strong> !</p>
        </div>
    )

}

export default SuccessVerificationEmailPage;