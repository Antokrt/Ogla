import styles from '../styles/Component/HeaderMain.module.scss';
import anim from '../styles/utils/anim.module.scss';
import MainSearchBar from "./MainSearchBar";
import React, { useEffect, useState } from "react";
import { SearchBarService } from "../service/Search/SearchService";
import ScreenSize from "../utils/Size";
import { useDispatch, useSelector } from "react-redux";
import { selectCategories } from "../store/slices/categorySlice";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import ResultSearchBar from "./SearchBar/ResultSearchBar";
import {
    BellIcon,
    Cog8ToothIcon,
    MagnifyingGlassIcon,
    MoonIcon,
    MusicalNoteIcon,
    SunIcon
} from "@heroicons/react/24/outline";
import { ArrowLeftOnRectangleIcon, BookOpenIcon } from "@heroicons/react/24/solid";
import { setActiveModalState } from "../store/slices/modalSlice";
import Tippy from "@tippyjs/react";
import { LogoutService } from "../service/User/Account.service";
import Link from "next/link";
import {changeTheme, selectTheme} from "../store/slices/themeSlice";
import {HeadPhoneBtn, HeadPhoneBtnOnHeaderMain} from "./layouts/Btn/ActionBtn";
import {selectActiveMusicStatus, setActiveMusic} from "../store/slices/musicSlice";
import {OpenAllService} from "../service/Notifications/NotificationsService";
import {selectNotifs, setActiveModalNotif, setOpen} from "../store/slices/notifSlice";
import {GetDefaultUserImgWhenError} from "../utils/ImageUtils";

export const HeaderMain = () => {

    const router = useRouter();
    const [width] = ScreenSize();
    const categories = useSelector(selectCategories);
    const { data: session } = useSession();
    const [searchValue, setSearchValue] = useState('');
    const [data, setData] = useState();
    const [canSearch,setCanSearch] = useState(true);
    const [sizeOfLastSearchResponse,setSizeOfLastSearchResponse] = useState(0);
    const [query, setQuery] = useState('');
    const [lastQueryNull,setLastQueryNull] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const Notifs = useSelector(selectNotifs);
    const cat = router.query.id;
    const selectMusicState = useSelector(selectActiveMusicStatus);
    const theme = useSelector(selectTheme);
    const dispatch = useDispatch();


    const pagesToHideCat = [
        '/livre/',
        '/chapitre/',
        "/conditions-generales-d'utilisation",
        '/profil',
        '/news'
    ]

    const headerHasToBeWhite = [
        '/livre/',
        '/chapitre/',
        "/conditions-generales-d'utilisation",
        '/profil'
    ]


    const checkPathname = (arr) => {
        for (const page of arr) {
            if (router.pathname.startsWith(page)) {
                return false;
            }
        }
        return true;
    }

    const search = () => {
        if (query.length > 0 && !query.startsWith(lastQueryNull)) {
            SearchBarService(query)
                .then((res) => {
                    let sizeOfResponse = res ? res.authors.length + res.books.length : null;
                    if(!sizeOfResponse){
                        setLastQueryNull(query);
                    }
                    setData(res);
                })
                .catch((err) => console.log(err));
        }
    };


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

    return (
        <div className={checkPathname(headerHasToBeWhite) ? 
                theme ? 
                styles.container 
                : 
                styles.container + ' ' + styles.dark 
            : 
                theme ?
                styles.container + ' ' + styles.bgTransparent
                :
                styles.container + ' ' + styles.dark 
                }>
            <div className={styles.fContainer}>
                <div className={styles.logoContainer + ' ' + anim.fadeIn}>
                    <img tabIndex={0} onClick={() => router.push('/')} src={process.env.NEXT_PUBLIC_ASSETS + 'logo/mountain.png'} />
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

                <div className={theme ? styles.logContainer : styles.logContainer + ' ' + styles.darkModeContainer}>
                    {
                        session ?
                            <>
                                <div tabIndex={0} onClick={() => router.push('/profil')} className={styles.containerImgProfil}>
                                    <img onError={(e) => e.target.src = GetDefaultUserImgWhenError()} src={session?.user?.image} referrerPolicy={'no-referrer'}/>
                                </div>

                                <Tippy trigger={'mouseenter'} content={'Déconnexion'}>
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
                                    onClick={() => router.push({ pathname: "/auth", query: "register" })}>S&apos;inscrire
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
                checkPathname(pagesToHideCat) &&
                <div className={theme ? styles.sContainer : styles.sContainer + ' ' + styles.darkModeContainer}>
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
                    <div className={theme ? styles.catContainer : styles.catContainer + ' ' + styles.darkModeContainer}>
                        {
                            categories.map((item, index) => {
                                return (
                                    <div
                                        tabIndex={0}
                                        onClick={() => {
                                            router.push('/bibliotheque/' + item.name.toLowerCase());
                                        }}
                                        key={item._id}
                                        className={cat && cat.toLowerCase() === item.name.toLowerCase() ? styles.active + " " + styles.book : styles.book}>
                                        <img src={"/assets/category/icons/" + item.name.toLowerCase() + '.svg'} />
                                        <p>{item.name}</p>
                                    </div>
                                )
                            })
                        }
                    </div>

                    <div className={styles.rightLinkContainer}>
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

                        {
                            session &&
                            <Tippy
                            trigger="mouseenter"
                            content={"Réglages"}
                            animation={'scale'}
                            placement={'bottom'}
                            delay={[200, 0]}>
                            <Cog8ToothIcon tabIndex={0} className={styles.sett} onClick={() => {
                                localStorage.setItem('side', 'settings');
                                router.push('/profil')
                            }} />
                        </Tippy>

                        }

                        {
                            !session ?
                                <div className={styles.music} onClick={() => dispatch(setActiveModalState(true))}>
                                    <Tippy
                                        trigger="mouseenter"
                                        content={"Musique"}
                                        animation={'scale'}
                                        placement={'bottom'}
                                        delay={[200, 0]}>
                                        <MusicalNoteIcon tabIndex={0} />
                                    </Tippy>
                                    {
                                        selectMusicState &&
                                        <div className={styles.animation}></div>
                                    }
                                </div> :
                                <>
                                    {
                                        session && session?.user?.settings?.music &&
                                        <div className={styles.music} onClick={() => dispatch(setActiveMusic())}>
                                            <Tippy
                                                trigger="mouseenter"
                                                content={"Musique"}
                                                animation={'scale'}
                                                placement={'bottom'}
                                                delay={[200, 0]}>
                                                <MusicalNoteIcon tabIndex={0} />
                                            </Tippy>
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
                                <Tippy
                                    trigger="mouseenter"
                                    content={"Thème"}
                                    animation={'scale'}
                                    placement={'bottom'}
                                    delay={[200, 0]}>
                                    <SunIcon tabIndex={0} onClick={() => dispatch(changeTheme())} className={styles.svgTheme} />
                                </Tippy>
                                :
                                <Tippy
                                    trigger="mouseenter"
                                    content={"Thème"}
                                    animation={'scale'}
                                    placement={'bottom'}
                                    delay={[200, 0]}>
                                    <MoonIcon tabIndex={0} onClick={() => dispatch(changeTheme())} className={styles.svgTheme} />
                                </Tippy>
                        }
                    </div>
                </div>

            }
        </div>
    )
}
