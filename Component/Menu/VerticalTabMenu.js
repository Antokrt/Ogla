import styles from "../styles/Component/Menu/VerticalTabMenu.module.scss";
import {
    ArrowLeftOnRectangleIcon,
    BellAlertIcon,
    BookmarkSquareIcon,
    HomeIcon,
    LifebuoyIcon,
    PlusCircleIcon,
} from "@heroicons/react/24/solid";
import {useSession} from "next-auth/react";
import {useRouter} from "next/router";
import {useDispatch} from "react-redux";
import {setActiveModalNotif} from "../../store/slices/notifSlice";

export default function VerticalTabMenu() {

    const {data: session} = useSession();

    const router = useRouter();
    const isActiveMenuBooks = router.pathname.startsWith('/dashboard/books') || router.pathname.startsWith('/dashboard/chapitre/');

    const goToProfil = () => {
        return router.push('/profil');
    }

    const dispatch = useDispatch()

    return (
        <div className={styles.container}>
            <div className={styles.fContainer}>
                <div className={styles.logo}>

                </div>

                <div className={styles.navContainer}>
                    <ul>
                        <li onClick={() => router.push('/')}> <HomeIcon/>   </li>
                        <li className={ isActiveMenuBooks  && styles.activeMenu} onClick={() => router.push('/dashboard/books')}><BookmarkSquareIcon/></li>
                        <li className={router.pathname.startsWith('/dashboard/nouveau-livre') && styles.activeMenu} onClick={() => router.push('/dashboard/nouveau-livre')}><PlusCircleIcon/></li>
                        <li onClick={() => dispatch(setActiveModalNotif(true))} className={styles.notification}><BellAlertIcon className={styles.bell}/> <span></span></li>
                    </ul>
                </div>
            </div>



            <div className={styles.sContainer}>
                <div className={styles.navContainer}>
                    <ul>
                        <li onClick={() => router.push('/dashboard/support')}> <LifebuoyIcon/>   </li>
                        <li> <ArrowLeftOnRectangleIcon/>   </li>
                    </ul>
                </div>

                <div className={styles.profilContainer}>
                    <div className={styles.profil}>
                        <img onClick={() => goToProfil()} referrerPolicy={'no-referrer'} src={session?.user.image}/>
                        <span></span>
                    </div>
                </div>
            </div>

        </div>
    )
}
