import styles from "../styles/Component/Menu/VerticalAuthorMenu.module.scss";
import {
    ArrowLeftOnRectangleIcon,
    BellAlertIcon,
    BookmarkSquareIcon,
    HomeIcon,
    LifebuoyIcon,
    PlusCircleIcon,
} from "@heroicons/react/24/outline";
import {useSession} from "next-auth/react";
import {useRouter} from "next/router";

export default function VerticalAuthorMenu() {

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
                        <li onClick={() => router.push('/dashboard')}> <HomeIcon/> Accueil  </li>
                        <li onClick={() => router.push('/dashboard/books')}><BookmarkSquareIcon/>Livres</li>
                        <li onClick={() => router.push('/dashboard/nouveau-livre')}><PlusCircleIcon/>Nouveau</li>
                        <li onClick={() => router.push('/dashboard/notifications')} className={styles.notification}><BellAlertIcon className={styles.bell}/>Notifications <span></span></li>
                    </ul>
                </div>
            </div>

            <div className={styles.sContainer}>
                <div className={styles.navContainer}>
                    <ul>
                        <li onClick={() => router.push('/dashboard/support')}> <LifebuoyIcon/> Support  </li>
                        <li> <ArrowLeftOnRectangleIcon/> Déconnexion  </li>
                    </ul>
                </div>

                <div className={styles.profilContainer}>
<div className={styles.profil}>
    <img referrerPolicy={'no-referrer'} src={session?.user.image}/>
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
