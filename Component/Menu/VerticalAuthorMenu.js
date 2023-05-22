import styles from "../styles/Component/Menu/VerticalAuthorMenu.module.scss";
import {
    ArrowLeftOnRectangleIcon,
    BellAlertIcon,
    BookmarkSquareIcon,
    HomeIcon,
    LifebuoyIcon,
    PlusCircleIcon,
} from "@heroicons/react/24/solid";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { selectNotifs, setActiveModalNotif, setOpen } from "../../store/slices/notifSlice";
import { useEffect, useState } from "react";
import { openAll } from "../../service/Notifications/NotificationsService";

export default function VerticalAuthorMenu() {

    const { data: session } = useSession();
    const router = useRouter();
    const isActiveMenuBooks = router.pathname.startsWith('/dashboard/books') || router.pathname.startsWith('/dashboard/chapitre/');
    const goToProfil = () => {
        return router.push('/profil');
    }
    const dispatch = useDispatch()
    const Notifs = useSelector(selectNotifs)
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        var nb = 0;
        Notifs.forEach((elem) => {
            if (elem.open === false) {
                setIsOpen(true);
                nb++;
            }
        })
        if (nb === 0)
            setIsOpen(false);
    }, [Notifs])

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
                        <li onClick={() => router.push('/')}> <HomeIcon /> Accueil  </li>
                        <li className={isActiveMenuBooks && styles.activeMenu} onClick={() => router.push('/dashboard/books')}><BookmarkSquareIcon />Livres</li>
                        <li className={router.pathname.startsWith('/dashboard/nouveau-livre') && styles.activeMenu} onClick={() => router.push('/dashboard/nouveau-livre')}><PlusCircleIcon />Nouveau</li>
                        <li onClick={() => {
                            if (Notifs.lenght > 0) {
                                openAll(Notifs[0].date_creation, session.user.id)
                            }
                            dispatch(setActiveModalNotif(true));
                            dispatch(setOpen());
                        }} className={styles.notification}><BellAlertIcon className={styles.bell} /> Notifications {isOpen && <span></span>}</li>
                    </ul>
                </div>
            </div>

            <div className={styles.imgContainer}>
                <img src={'/assets/diapo/mountain.png'} />
            </div>

            <div className={styles.sContainer}>
                <div className={styles.navContainer}>
                    <ul>
                        <li onClick={() => router.push('/dashboard/support')}> <LifebuoyIcon /> Support  </li>
                        <li> <ArrowLeftOnRectangleIcon /> Déconnexion  </li>
                    </ul>
                </div>

                <div className={styles.profilContainer}>
                    <div className={styles.profil}>
                        <img onClick={() => goToProfil()} referrerPolicy={'no-referrer'} src={session?.user.image} />
                        <span></span>
                        <div className={styles.infos} onClick={() => goToProfil()}>
                            <p className={styles.name}>{session?.user.author.firstName} {session?.user.author.lastName}</p>
                            <p className={styles.pseudo}>@{session?.user.pseudo}</p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}
