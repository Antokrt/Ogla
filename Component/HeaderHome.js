import styles from '../styles/Component/HeaderHome.module.scss';
import React, { useEffect, useState } from "react";
import MainSearchBar from "./MainSearchBar";
import ResultSearchBar from "./SearchBar/ResultSearchBar";
import { SearchBarService } from "../service/Search/SearchService";
import { useRouter } from "next/router";
import ScreenSize from "../utils/Size";
import { useDispatch, useSelector } from "react-redux";
import { selectCategories } from "../store/slices/categorySlice";
import { signOut, useSession } from "next-auth/react";
import { selectNotifs, setActiveModalNotif, setOpen } from "../store/slices/notifSlice";
import { selectActiveMusicStatus, setActiveMusic } from "../store/slices/musicSlice";
import { changeTheme, selectTheme } from "../store/slices/themeSlice";
import Tippy from "@tippyjs/react";
import { LogoutService } from "../service/User/Account.service";
import { ArrowLeftOnRectangleIcon } from "@heroicons/react/24/solid";
import { setActiveModalState } from "../store/slices/modalSlice";
import Link from "next/link";
import { BellIcon, Cog8ToothIcon, MoonIcon, MusicalNoteIcon, SunIcon } from "@heroicons/react/24/outline";
import { OpenAllService } from "../service/Notifications/NotificationsService";
import { GetDefaultUserImgWhenError, GetImgPathOfAssets } from "../utils/ImageUtils";

export const HeaderHome = () => {

    const router = useRouter();
    const { data: session } = useSession();
    const [searchValue, setSearchValue] = useState('');
    const [data, setData] = useState();
    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const Notifs = useSelector(selectNotifs)
    const cat = router.query.id;
    const selectMusicState = useSelector(selectActiveMusicStatus);
    const theme = useSelector(selectTheme);
    const dispatch = useDispatch();

    useEffect(() => {
        search();
    }, [query]);

    useEffect(() => {
        setQuery('');
        setSearchValue('');
    }, [router]);

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

    const search = () => {
        if (query.length > 0) {
            SearchBarService(query)
                .then((res) => {
                    setData(res);
                })
                .catch((err) => console.log('err'));
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.fContainer}>
                <div className={styles.logoContainer}>
                    <img
                        alt={'Logo Ogla'}
                        onClick={() => router.push('/')} tabIndex={0}
                        onError={(e) => e.target.src = '/assets/logo/mountain.png'}
                        src={GetImgPathOfAssets() + 'logo/mountain.png'} />
                </div>

                <div className={styles.searchbarContainer}>
                    <div className={styles.containerSearchBarHeader}>
                        <MainSearchBar
                            data={(value) => setData(value)}
                            query={(e) => {
                                setQuery(e)
                            }}
                            search={query}
                            submit={() => {
                                setSearchValue('');
                            }}
                            height={50}
                            width={100} />
                        {
                            query !== '' && data &&
                            <div className={styles.containerResultSearchBar}>
                                <ResultSearchBar
                                    searchBtn={() => setSearchValue('')}
                                    destroy={() => {
                                        setSearchValue('')
                                    }}
                                    search={searchValue}
                                    query={query}
                                    data={data}
                                />
                            </div>
                        }
                    </div>

                </div>

                <div className={styles.logContainer}>
                    {
                        session ?
                            <>
                                <Tippy
                                    trigger={'mouseenter'}
                                    content={'Profil'}
                                    delay={[300, 0]}
                                    animation={'scale'}
                                >
                                    <div tabIndex={0} onClick={() => router.push('/profil')}
                                        className={styles.containerImgProfil}>
                                        <img
                                            alt={'Ogla Profil'}
                                            onError={(e) => e.target.src = GetDefaultUserImgWhenError()}
                                            src={session?.user?.image} referrerPolicy={'no-referrer'} />
                                    </div>
                                </Tippy>

                                <Tippy trigger={'mouseenter'}
                                    content={'Déconnexion'}
                                    delay={[300, 0]}
                                    animation={'scale'}
                                >
                                    <button className={styles.logOut}
                                        onClick={() => {
                                            LogoutService()
                                                .then(() => signOut()
                                                    .then(() => router.push('/')))
                                                .catch(() => signOut()
                                                    .then(() => router.push('/')))
                                        }}
                                        title={'Déconnexion'}><ArrowLeftOnRectangleIcon /></button>
                                </Tippy>

                            </>

                            :
                            <>
                                <button className={styles.register}
                                    onClick={() => router.push({
                                        pathname: "/auth",
                                        query: "register"
                                    })}>S&apos;inscrire
                                </button>
                                <button className={styles.login} onClick={() => {
                                    if (router.pathname === '/')
                                        router.push({ pathname: "/auth", query: "login" });
                                    else
                                        dispatch(setActiveModalState(true));
                                }}>Se connecter
                                </button>
                            </>
                    }

                </div>
            </div>

            {
                <div className={styles.sContainer}>
                    <nav className={styles.leftLinkContainer}>
                        {
                            session && session?.user?.is_author ?
                                <>
                                    <Link href={"/dashboard/books"}>Mes livres</Link>
                                    <Link href={'/bibliotheque'}>Bibliothèque</Link>
                                </>
                                :
                                <>
                                    <Link href={"/devenir-ecrivain"}>Deviens écrivain</Link>
                                    <Link href={'/bibliotheque'}>Bibliothèque</Link>
                                </>
                        }

                    </nav>


                    <div className={styles.rightLinkContainer}>
                        {
                            session &&
                            <Tippy
                                trigger="mouseenter"
                                content={"Notifications"}
                                animation={'scale'}
                                placement={'bottom'}
                                delay={[200, 0]}>
                                <div className={styles.bellActive} onClick={openNotif}>
                                    <BellIcon onClick={() => dispatch(setActiveModalNotif(true))} />
                                    {isOpen && <span></span>}
                                </div>
                            </Tippy>
                        }

                        {
                            session &&
                            <Tippy
                                trigger="mouseenter"
                                content={"Réglages"}
                                placement={'bottom'}
                                animation={'scale'}
                                delay={[200, 0]}>
                                <Cog8ToothIcon tabIndex={0} className={styles.sett} onClick={() => {
                                    localStorage.setItem('side', 'settings');
                                    router.push('/profil')
                                }} />
                            </Tippy>
                        }

                        {
                            !session ?
                                <Tippy
                                    trigger="mouseenter"
                                    content={"Musique"}
                                    animation={'scale'}
                                    placement={'bottom'}
                                    delay={[200, 0]}>
                                    <div className={styles.music} onClick={() => dispatch(setActiveModalState(true))}>
                                        <MusicalNoteIcon tabIndex={0} />
                                        {
                                            selectMusicState &&
                                            <div className={styles.animation}></div>
                                        }
                                    </div>
                                </Tippy>
                                :
                                <>
                                    {
                                        session && session?.user?.settings?.music &&
                                        <Tippy
                                            trigger="mouseenter"
                                            content={"Musique"}
                                            animation={'scale'}
                                            placement={'bottom'}
                                            delay={[200, 0]}>
                                            <div className={styles.music} onClick={() => dispatch(setActiveMusic())}>
                                                <MusicalNoteIcon tabIndex={0} />
                                                {
                                                    selectMusicState &&
                                                    <div className={styles.animation}></div>
                                                }
                                            </div>
                                        </Tippy>
                                    }
                                </>

                        }

                        {
                            theme ?
                                <Tippy
                                    trigger="mouseenter"
                                    content={"Thème"}
                                    placement={'bottom'}
                                    animation={'scale'}
                                    delay={[200, 0]}>
                                    <SunIcon tabIndex={0} onClick={() => dispatch(changeTheme())}
                                        className={styles.svgTheme} />
                                </Tippy>
                                :
                                <Tippy
                                    trigger="mouseenter"
                                    content={"Thème"}
                                    placement={'bottom'}
                                    animation={'scale'}
                                    delay={[200, 0]}>
                                    <MoonIcon tabIndex={0} onClick={() => dispatch(changeTheme())}
                                        className={styles.svgTheme} />
                                </Tippy>
                        }
                    </div>
                </div>

            }


        </div>

    )
}