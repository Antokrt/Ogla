import styles from '../styles/Component/HeaderMainResponsive.module.scss';
import anim from '../styles/utils/anim.module.scss';
import { GetDefaultUserImgWhenError, GetLogoUtils } from "../utils/ImageUtils";
import { useRouter } from "next/router";
import {
    Bars3Icon, BellIcon,
    ChevronDownIcon,
    Cog8ToothIcon,
    MagnifyingGlassIcon, MoonIcon,
    MusicalNoteIcon, SunIcon
} from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { setActiveModalState } from "../store/slices/modalSlice";
import { useDispatch, useSelector } from "react-redux";
import ScreenSize from "../utils/Size";
import { selectDarkenState, setDarkenState } from "../store/slices/darkenSlice";
import { selectActiveMusicStatus, setActiveMusic } from "../store/slices/musicSlice";
import { selectNotifs, setActiveModalNotif, setOpen } from "../store/slices/notifSlice";
import { changeTheme, selectTheme } from "../store/slices/themeSlice";
import { BodyOverflowUtils } from "../utils/BodyUtils";
import { OpenAllService } from "../service/Notifications/NotificationsService";
import { LogoutService } from "../service/User/Account.service";
import { ArrowLeftOnRectangleIcon } from "@heroicons/react/24/solid";

export const HeaderMainResponsive = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const { data: session } = useSession();
    const [width] = ScreenSize();
    const [openMenu, setOpenMenu] = useState(null);
    const isDarken = useSelector(selectDarkenState);
    const Notifs = useSelector(selectNotifs);
    const theme = useSelector(selectTheme);
    const selectMusicState = useSelector(selectActiveMusicStatus);

    const openNotif = () => {
        if (session) {
            if (Notifs.length > 0) {
                OpenAllService(Notifs[0].date_creation, session.user.id)
            }
            dispatch(setActiveModalNotif(true));
            dispatch(setOpen());
        } else {
            dispatch(setActiveModalState(true));
        }
    }

    const headersHasToBeFixed = [
        '/livre/',
        '/chapitre/',
        '/rechercher',
        '/profil',
        '/auteur',
        "/conditions-generales-d'utilisation",
        "/news"
    ]


    const checkPathname = (arr) => {
        for (const page of arr) {
            if (router.pathname.startsWith(page)) {
                return false;
            }
        }
        return true;
    }

    return (
        <div className={theme ?
            (openMenu !== null ?
                styles.container + ' ' + styles.disableOverflow
                :
                styles.container)
            :
            (openMenu !== null ?
                styles.container + ' ' + styles.disableOverflow + ' ' + styles.dark
                :
                styles.container + ' ' + styles.dark)}>
            <div
                className={checkPathname(headersHasToBeFixed) ? styles.containerMain + ' ' + styles.fixed : styles.containerMain}>
                <div className={styles.leftContainer}>

                    <Bars3Icon tabIndex={0} onClick={() => {
                        if (!openMenu) {
                            dispatch(setDarkenState(true));
                            setOpenMenu('links');
                        }
                        if (openMenu === 'links') {
                            dispatch(setDarkenState(false));
                            setOpenMenu(null);
                        }

                        if (openMenu === 'profil') {
                            dispatch(setDarkenState(true));
                            setOpenMenu('links')
                        }
                    }} />
                    {
                        width < 650 &&
                        <img
                            onError={(e) => e.target.src = '/assets/logo/mountain.png'}
                            tabIndex={0} style={{ marginLeft: '10px' }}
                            onClick={() => router.push('/').then(() => dispatch(setDarkenState(false))).catch(() => dispatch(setDarkenState(false)))}
                            className={styles.logo}
                            alt={'Logo Ogla'} src={GetLogoUtils()} />
                    }
                </div>


                {
                    width >= 650 &&
                    <img tabIndex={0}
                        onClick={() => router.push('/').then(() => dispatch(setDarkenState(false))).catch(() => dispatch(setDarkenState(false)))}
                        className={styles.logo} alt={'Logo Ogla'}
                        src={GetLogoUtils()}
                        onError={(e) => e.target.src = '/assets/logo/mountain.png'}
                    />

                }


                <div className={styles.rightContainer}>
                    {
                        !session ?
                            <button className={styles.log} onClick={() => {
                                if (router.pathname === '/') {
                                    router.push({
                                        pathname: "/auth",
                                        query: "login"
                                    }).then(() => dispatch(setDarkenState(false))).catch(() => dispatch(setDarkenState(false)))
                                } else
                                    dispatch(setActiveModalState(true));
                            }}>Se connecter</button>
                            :
                            <div className={styles.imgContainer}>
                                <div tabIndex={0}
                                    onClick={() => router.push('/profil').then(() => dispatch(setDarkenState(false))).catch(() => dispatch(setDarkenState(false)))}
                                    className={styles.containerImgProfil}>
                                    <img src={session?.user?.image} alt={'Ogla Image Profil'}
                                        onError={(e) => e.target.src = GetDefaultUserImgWhenError()}
                                        referrerPolicy={'no-referrer'} />
                                </div>
                                <ChevronDownIcon tabIndex={0} onClick={() => {
                                    if (!openMenu) {
                                        BodyOverflowUtils('hidden');
                                        dispatch(setDarkenState(true));
                                        setOpenMenu('profil');
                                    }
                                    if (openMenu === 'profil') {
                                        BodyOverflowUtils('initial');
                                        dispatch(setDarkenState(false));
                                        setOpenMenu(null);
                                    }

                                    if (openMenu === 'links') {
                                        BodyOverflowUtils('hidden');
                                        dispatch(setDarkenState(true));
                                        setOpenMenu('profil')
                                    }

                                }} className={openMenu === 'profil' ? styles.rotate : undefined} />
                            </div>
                    }
                </div>
            </div>

            {
                openMenu === 'links' &&
                <div className={styles.modalLinks + ' ' + anim.fadeIn}>
                    {
                        !session &&
                        <div className={styles.iconList}>
                            <div className={styles.music} onClick={() => dispatch(setActiveModalState(true))}>
                                <MusicalNoteIcon tabIndex={0} />
                                {
                                    selectMusicState &&
                                    <div className={styles.animation}></div>
                                }
                            </div>


                            {
                                theme ?
                                    <SunIcon onClick={() => dispatch(changeTheme())} className={styles.svgTheme} />
                                    :
                                    <MoonIcon onClick={() => dispatch(changeTheme())} className={styles.svgTheme} />
                            }
                        </div>
                    }


                    <ul>
                        <li tabIndex={0} className={anim.slideInLeft1}><a href={'/rechercher'}
                            className={styles.search}>Rechercher <MagnifyingGlassIcon /></a>
                        </li>
                        <li tabIndex={0} className={anim.slideInLeft2}><a href={'/bibliotheque'}>Bibliothèque</a></li>
                        {
                            session ?
                                <>
                                    {
                                        session?.user?.is_author ?
                                            <>
                                                <li className={anim.slideInLeft3}><a href={'/dashboard/nouveau-livre'}>Nouveau
                                                    livre </a></li>
                                                <li className={anim.slideInLeft4}><a href={'/dashboard/books'}
                                                    className={styles.purple}>Mes
                                                    livres </a></li>
                                            </>
                                            :
                                            <li className={anim.slideInLeft3}><a className={styles.purple}>Deviens
                                                écrivain</a></li>
                                    }
                                </>
                                :
                                <>
                                    <li className={anim.slideInLeft3}><a href={'/auth?register'}>S&apos;inscrire</a>
                                    </li>
                                    <li className={anim.slideInLeft4}><a href={'/devenir-ecrivain'}
                                        className={styles.purple}>Deviens écrivain</a>
                                    </li>
                                </>
                        }
                    </ul>
                </div>
            }


            {
                openMenu === 'profil' && session &&
                <div className={styles.modalProfil + ' ' + anim.fadeIn}>
                    <div className={styles.containerImgOnModalProfil}>
                        <img
                            onError={(e) => e.target.src = GetDefaultUserImgWhenError()}
                            onClick={() => router.push('/profil').then(() => dispatch(setDarkenState(false))).catch(() => dispatch(setDarkenState(false)))}
                            src={session?.user?.image} referrerPolicy={'no-referrer'} />
                        <p>{session?.user?.pseudo}</p>
                    </div>

                    <div className={styles.containerBtnProfil}>

                        {
                            !session ?
                                <div className={styles.music} onClick={() => dispatch(setActiveModalState(true))}>
                                    <MusicalNoteIcon tabIndex={0} />
                                    {
                                        selectMusicState &&
                                        <div className={styles.animation}></div>
                                    }
                                </div> :
                                <>
                                    {
                                        session && session?.user?.settings?.music &&
                                        <div className={styles.music} onClick={() => dispatch(setActiveMusic())}>
                                            <MusicalNoteIcon tabIndex={0} />
                                            {
                                                selectMusicState &&
                                                <div className={styles.animation}></div>
                                            }
                                        </div>
                                    }
                                </>

                        }


                        {
                            theme ?
                                <SunIcon onClick={() => dispatch(changeTheme())} className={styles.svgTheme} />
                                :
                                <MoonIcon onClick={() => dispatch(changeTheme())} className={styles.svgTheme} />
                        }


                    </div>


                    <div className={styles.containerLinksProfil}>
                        <ul>
                            <li onClick={() => openNotif()}
                                className={anim.slideInLeft1 + ' ' + styles.purple + ' ' + styles.notif}>
                                Notifications
                                <span></span>
                            </li>
                            <li className={anim.slideInLeft2}><a onClick={() => {
                                localStorage.setItem('side', 'settings');
                                router.push('/profil').then(() => dispatch(setDarkenState(false))).catch(() => dispatch(setDarkenState(false)))
                            }}>Réglages</a></li>

                            <li className={anim.slideInLeft3}><a href={'/profil'}>Profil</a></li>

                        </ul>
                    </div>

                    <div className={styles.logOut + ' ' + anim.slideInLeft4}>
                        <button
                            onClick={() => {
                                LogoutService()
                                    .then(() => signOut()
                                        .then(() => router.push('/').then(() => dispatch(setDarkenState(false))).catch(() => dispatch(setDarkenState(false)))))
                                    .catch(() => signOut()
                                        .then(() => router.push('/').then(() => dispatch(setDarkenState(false))).catch(() => dispatch(setDarkenState(false)))))
                            }}
                            title={'Déconnexion'}>Se déconnecter <ArrowLeftOnRectangleIcon /></button>
                    </div>
                </div>
            }


        </div>
    )
}