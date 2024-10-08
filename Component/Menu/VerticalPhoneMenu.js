import styles from "../styles/Component/Menu/VerticalAuthorMenuPhone.module.scss";
import { BellAlertIcon, BookOpenIcon, HomeIcon, UserIcon } from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { selectNotifs, setActiveModalNotif, setOpen } from "../../store/slices/notifSlice";
import { useState } from "react";
import { useEffect } from "react";
import { OpenAllService, openAll } from "../../service/Notifications/NotificationsService";
import { GetDefaultUserImgWhenError } from "../../utils/ImageUtils";
import { selectTheme } from "../../store/slices/themeSlice";
import ScreenSize from "../../utils/Size";

export default function VerticalPhoneMenu() {

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
    const [width] = ScreenSize();

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
        <div className={theme ? styles.container : styles.container + ' ' + styles.dark}>
            <div className={styles.containerMain}>
                <div className={styles.item} onClick={() => router.push('/')}>
                    <HomeIcon />
                </div>
                <div onClick={() => {
                    if (router.pathname !== '/dashboard/books') {
                        router.push('/dashboard/books');
                    }
                }} className={router.pathname === ('/dashboard/books') ? styles.item + ' ' + styles.activeItem : styles.item}>
                    <BookOpenIcon />
                </div>


                <div onClick={() => {
                    if (router.pathname !== '/dashboard/nouveau-livre') {
                        router.push('/dashboard/nouveau-livre');
                    }
                }} className={router.pathname === ('/dashboard/nouveau-livre') ? styles.item + ' ' + styles.activeItem : styles.item}>
                    <PlusCircleIcon />
                </div>
                <div className={isOpen ? styles.item + ' ' + styles.notifItem : styles.item} onClick={() => {
                    if (Notifs.length > 0) {
                        OpenAllService(Notifs[0].date_creation, session.user.id)
                    }
                    dispatch(setActiveModalNotif(true));
                    dispatch(setOpen());
                }}>
                    <BellAlertIcon />
                </div>
                {
                    width < 310 &&
                    <div className={styles.item} onClick={() => router.push('/profil')}>
                        <UserIcon />
                    </div>

                }
                {
                    width >= 310 &&
                    <div className={styles.item}>
                        {
                            session && session.user.image &&
                            <>
                                <img alt={'Profil image Ogla'} src={session.user.image} onError={(e) => e.target.src = GetDefaultUserImgWhenError()} />
                                <span className={styles.circle}></span>
                            </>
                        }

                    </div>
                }
            </div>
        </div>
    )
}
