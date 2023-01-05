import styles from "../styles/Component/Menu/VerticalAuthorMenu.module.scss";
import {
    ArrowLeftOnRectangleIcon,
    BellAlertIcon,
    BookmarkSquareIcon,
    HomeIcon,
    LifebuoyIcon,
    PlusCircleIcon,
    PlusIcon
} from "@heroicons/react/24/outline";
import {BookOpenIcon} from "@heroicons/react/24/outline";
import {useSession} from "next-auth/react";
import {useEffect, useState} from "react";
import {useRouter} from "next/router";


export default function VerticalAuthorMenu({setLink}) {

    const {data: session} = useSession();
const router = useRouter();
    return (
        <div className={styles.container}>
            <div className={styles.fContainer}>
                <div className={styles.logo}>
                    <h3 onClick={() => {
                        router.push('/')
                    }}><strong>OGLA</strong></h3>
                </div>

                <div className={styles.navContainer}>
                    <ul>
                        <li onClick={() => setLink('Accueil')}> <HomeIcon/> Accueil  </li>
                        <li onClick={() => setLink('books')}><BookmarkSquareIcon/>Livres</li>
                        <li onClick={() => setLink('new')}><PlusCircleIcon/>Nouveau</li>
                        <li onClick={() => setLink('notifications')} className={styles.notification}><BellAlertIcon className={styles.bell}/>Notifications <span>225</span></li>
                    </ul>
                </div>
            </div>

            <div className={styles.sContainer}>
                <div className={styles.navContainer}>
                    <ul>
                        <li> <LifebuoyIcon/> Support  </li>
                        <li> <ArrowLeftOnRectangleIcon/> Déconnexion  </li>
                    </ul>
                </div>

                <div className={styles.profilContainer}>
<div className={styles.profil}>
    <img src={'assets/livre4.jpg'}/>
    <div className={styles.infos}>
        <p className={styles.name}>{session?.user.author.firstName} {session?.user.author.lastName}</p>
        <p className={styles.pseudo}>@{session?.user.pseudo}</p>
    </div>
</div>
                </div>
            </div>

        </div>
    )
}