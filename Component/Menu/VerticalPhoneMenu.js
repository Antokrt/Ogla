import styles from "../styles/Component/Menu/VerticalAuthorMenuPhone.module.scss";
import { BellAlertIcon, HomeIcon } from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";
import { PlusCircleIcon, BookmarkSquareIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { HeartIcon } from "@heroicons/react/20/solid";
import { selectNotifs, setActiveModalNotif, setOpen } from "../../store/slices/notifSlice";
import { useState } from "react";
import { useEffect } from "react";
import { OpenAllService, openAll } from "../../service/Notifications/NotificationsService";

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
            <div className={styles.containerMain}>
                <div className={styles.item} onClick={() => router.push('/')}>
                    <HomeIcon/>
                    <p>Accueil</p>
                </div>
                <div onClick={() => {
                    if(router.pathname !== '/dashboard/books'){
                        router.push('/dashboard/books');
                    }
                }} className={router.pathname === ('/dashboard/books') ? styles.item + ' ' + styles.activeItem : styles.item}>
                    <BookmarkSquareIcon/>
                    <p>Mes livres</p>
                </div>


                <div onClick={() => {
                    if(router.pathname !== '/dashboard/nouveau-livre'){
                        router.push('/dashboard/nouveau-livre');
                    }
                }} className={styles.item}>
                    <PlusCircleIcon/>
                    <p>Nouveau</p>
                </div>
                <div className={isOpen ? styles.item + ' ' + styles.notifItem : styles.item} onClick={() => {
                    if (Notifs.lenght > 0) {
                        OpenAllService(Notifs[0].date_creation, session.user.id)
                    }
                    dispatch(setActiveModalNotif(true));
                    dispatch(setOpen());
                }}>
                    <BellAlertIcon />
                    <p>Notifications</p>
                </div>
                <div className={styles.item}>
                    {
                        session && session.user.image &&
                        <>
                            <img src={session.user.image} />
                            <span className={styles.circle}></span>
                        </>
                    }

                </div>
            </div>
        </div>
    )
}
