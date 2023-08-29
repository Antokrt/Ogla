import styles from '../styles/Pages/404.module.scss'
import {HomeIcon} from "@heroicons/react/24/solid";
import {useRouter} from "next/router";
import Head from "next/head";

export default function Custom404(){

    const router = useRouter();
    return (
        <div className={styles.container} data-after={'404'}>
            <Head>
                <title>Ogla - 404</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"/>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className={styles.logo}>
                <img src={'/assets/diapo/book.png'}/>
            </div>
            <img className={styles.img} src={'/assets/diapo/old.png'}/>
            <p>Oups ! La page est introuvable (404)</p>
            <button onClick={() => router.push('/')}>Retour à l&apos;accueil <HomeIcon/></button>
        </div>
    )
}