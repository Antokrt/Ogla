import styles from "../styles/Component/Menu/VerticalAuthorMenu.module.scss";
import {
    ArrowLeftOnRectangleIcon,
    BellAlertIcon,
    BookOpenIcon,
    HomeIcon,
    LifebuoyIcon,
    PlusCircleIcon,
} from "@heroicons/react/24/solid";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { selectNotifs, setActiveModalNotif, setOpen } from "../../store/slices/notifSlice";
import { useEffect, useState } from "react";
import { OpenAllService, openAll } from "../../service/Notifications/NotificationsService";
import { Capitalize } from "../../utils/String";
import 'tippy.js/dist/tippy.css'
import Tippy from "@tippyjs/react";
import 'tippy.js/animations/scale.css';
import { LogoutService } from "../../service/User/Account.service";
import { GetDefaultUserImgWhenError } from "../../utils/ImageUtils";
import { selectTheme } from "../../store/slices/themeSlice";

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
    const theme = useSelector(selectTheme);

    useEffect(() => {
        let nb = 0;
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
        <div className={theme ? styles.container : styles.container + ' ' + styles.dark}>
            <div className={styles.fContainer}>
                <div className={styles.logo}>
                    <h3 onClick={() => {
                        router.push('/')
                    }}><strong>OGLA</strong></h3>
                </div>

                <div className={styles.navContainer}>
                    <ul>
                        <li onClick={() => router.push('/')}> <HomeIcon /> Accueil  </li>
                        <li className={isActiveMenuBooks ? styles.activeMenu : ''} onClick={() => router.push('/dashboard/books')}><BookOpenIcon />Livres</li>
                        <li className={router.pathname.startsWith('/dashboard/nouveau-livre') ? styles.activeMenu : ''} onClick={() => router.push('/dashboard/nouveau-livre')}><PlusCircleIcon />Nouveau</li>
                        <li onClick={() => {
                            if (Notifs.length > 0) {
                                OpenAllService(Notifs[0].date_creation, session.user.id)
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
                        <li onClick={() => router.push('/dashboard/support')} 
                        className={router.pathname.startsWith('/dashboard/support') ? styles.activeMenu : ''}>
                            <LifebuoyIcon /> Support
                        </li>
                        <li onClick={() => {
                            LogoutService()
                                .then(() => signOut()
                                    .then(() => router.push('/')))
                                .catch(() => signOut()
                                    .then(() => router.push('/')))
                        }}> <ArrowLeftOnRectangleIcon /> Déconnexion  </li>
                    </ul>
                </div>

                <div className={styles.profilContainer}>
                    <div className={styles.profil}>
                        <img onClick={() => goToProfil()} referrerPolicy={'no-referrer'} src={session?.user.image}
                            onError={(e) => e.target.src = GetDefaultUserImgWhenError()} />
                        <Tippy
                            trigger="mouseenter"
                            content={"En ligne"}
                            animation={'scale'}
                            placement={'right'}
                            delay={[300, 0]}>
                            <span></span>
                        </Tippy>
                        <div className={styles.infos} onClick={() => goToProfil()}>
                            <p className={styles.name}>{Capitalize(session?.user.author.firstName)} {Capitalize(session?.user.author.lastName)}</p>
                            <p className={styles.pseudo}>@{session?.user.pseudo}</p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}
