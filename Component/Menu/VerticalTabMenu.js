import styles from "../styles/Component/Menu/VerticalTabMenu.module.scss";
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
import { OpenAllService } from "../../service/Notifications/NotificationsService";
import 'tippy.js/dist/tippy.css'
import Tippy from "@tippyjs/react";
import 'tippy.js/animations/scale.css';
import { LogoutService } from "../../service/User/Account.service";
import { GetDefaultUserImgWhenError } from "../../utils/ImageUtils";
import { selectTheme } from "../../store/slices/themeSlice";

export default function VerticalTabMenu() {

    const { data: session } = useSession();
    const router = useRouter();
    const isActiveMenuBooks = router.pathname.startsWith('/dashboard/books') || router.pathname.startsWith('/dashboard/chapitre/');
    const goToProfil = () => {
        return router.push('/profil');
    }
    const dispatch = useDispatch();
    const Notifs = useSelector(selectNotifs);
    const [isOpen, setIsOpen] = useState(false);
    const theme = useSelector(selectTheme);

    useEffect(() => {
        var nb = 0;
        Notifs.forEach((elem) => {
            if (elem.open == false) {
                setIsOpen(true);
                nb++;
            }
            if (nb === 0)
                setIsOpen(false);
        })
    }, [Notifs])

    return (
        <div className={theme ? styles.container : styles.container + ' ' + styles.dark}>
            <div className={styles.fContainer}>
                <div className={styles.logo}>
                </div>

                <div className={styles.navContainer}>
                    <ul>
                        <Tippy
                            trigger="mouseenter"
                            content={"Accueil"}
                            animation={'scale'}
                            placement={'right'}
                            delay={[300, 0]}>
                            <li onClick={() => router.push('/')}> <HomeIcon />   </li>
                        </Tippy>
                        <Tippy
                            trigger="mouseenter"
                            content={"Livres"}
                            animation={'scale'}
                            placement={'right'}
                            delay={[300, 0]}>
                            <li className={isActiveMenuBooks ? styles.activeMenu : ''} onClick={() => router.push('/dashboard/books')}>
                                <BookOpenIcon />
                            </li>
                        </Tippy>
                        <Tippy
                            trigger="mouseenter"
                            content={"Nouveau"}
                            animation={'scale'}
                            placement={'right'}
                            delay={[300, 0]}>
                            <li className={router.pathname.startsWith('/dashboard/nouveau-livre') ? styles.activeMenu : ''} onClick={() => router.push('/dashboard/nouveau-livre')}><PlusCircleIcon /></li>
                        </Tippy>
                        <Tippy
                            trigger="mouseenter"
                            content={"Notifications"}
                            animation={'scale'}
                            placement={'right'}
                            delay={[300, 0]}>
                            <li onClick={() => {
                                if (Notifs.length > 0) {
                                    OpenAllService(Notifs[0].date_creation, session.user.id)
                                }
                                dispatch(setActiveModalNotif(true));
                                dispatch(setOpen());
                            }} className={styles.notification}>
                                <BellAlertIcon className={styles.bell} /> {isOpen && <span></span>}
                            </li>
                        </Tippy>

                    </ul>
                </div>
            </div>

            <div className={styles.sContainer}>
                <div className={styles.navContainer}>
                    <ul>
                        <Tippy
                            trigger="mouseenter"
                            content={"Support"}
                            animation={'scale'}
                            placement={'right'}
                            delay={[300, 0]}>
                            <li className={router.pathname.startsWith('/dashboard/support') ? styles.activeMenu : ''} onClick={() => router.push('/dashboard/support')}> <LifebuoyIcon /> </li>
                        </Tippy>
                        <Tippy
                            trigger="mouseenter"
                            content={"Déconnexion"}
                            animation={'scale'}
                            placement={'right'}
                            delay={[300, 0]}>
                            <li onClick={() => {
                                LogoutService()
                                    .then(() => signOut()
                                        .then(() => router.push('/')))
                                    .catch(() => signOut()
                                        .then(() => router.push('/')))
                            }}> <ArrowLeftOnRectangleIcon />   </li>
                        </Tippy>
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
                    </div>
                </div>
            </div>
        </div>
    )
}
