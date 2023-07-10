import { SunIcon, AcademicCapIcon, ArrowLeftOnRectangleIcon, ArrowPathIcon, Bars3CenterLeftIcon, Bars3Icon, BellIcon, BookOpenIcon, ChevronDownIcon, HomeIcon, KeyIcon, MagnifyingGlassIcon, PencilIcon, Squares2X2Icon, StarIcon, UserIcon, XMarkIcon, MoonIcon } from "@heroicons/react/24/outline";
import { useSession, signOut } from "next-auth/react";
import { useEffect } from "react";
import { useState } from "react";
import styles from "../styles/Component/HeaderResponsive.module.scss";
import anim from "../styles/utils/anim.module.scss"
import { LogoutService } from "../service/User/Account.service";
import { useRouter } from "next/router";
import { HeadPhoneBtn } from "./layouts/Btn/ActionBtn";
import { useRef } from "react";
import { GetRandomBookService } from "../service/Book/BookService";
import MainSearchBar from "./MainSearchBar";
import ResultSearchBar from "./SearchBar/ResultSearchBar";
import { SearchBarService } from "../service/Search/SearchService";
import { useDispatch, useSelector } from "react-redux";
import { selectNotifs, setActiveModalNotif, setOpen } from "../store/slices/notifSlice";
import { OpenAllService, openAll } from "../service/Notifications/NotificationsService";
import { changeTheme, selectTheme } from "../store/slices/themeSlice";

const HeaderResponsive = () => {
    const [openMenu, setOpenMenu] = useState(false);
    const [query, setQuery] = useState('');
    const { data: session } = useSession();
    const router = useRouter()
    const menuRef = useRef();
    const [searchValue, setSearchValue] = useState('');
    const [data, setData] = useState();
    const dispatch = useDispatch()
    const Notifs = useSelector(selectNotifs)
    const [isOpen, setIsOpen] = useState(false);
    const [nbNotifs, setNbNotifs] = useState(0);
    const theme = useSelector(selectTheme);

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
        setNbNotifs(nb);
    }, [Notifs])

    useEffect(() => {
        search();
    }, [query]);

    useEffect(() => {
        setQuery('');
        setSearchValue('');
    }, [router])

    function OpenMenu() {
        menuRef.current.className = styles.OpenContent
        setOpenMenu(true);
    }

    async function CloseMenu() {
        menuRef.current.className = styles.close
        setOpenMenu(false);
    }

    function NavProfil() {
        if (session)
            router.push('/profil')
        else
            router.push({ pathname: "/auth", query: "login" })
    }

    function getRandom() {
        GetRandomBookService()
            .then((res) => {
                console.log(res);
                router.push({
                    pathname: '/livre/' + res._id,
                    query: res.slug
                })
            })
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
        <div className={theme ? styles.HeaderResponsive : styles.darkHeaderResponsive}>
            {
                !openMenu &&
                <div className={styles.HeaderResponsiveClosed}>
                    <h1 onClick={() => router.push("/")}> OGLA </h1>
                    {
                        router.pathname !== "/rechercher" &&
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
                                height={35}
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
                                    <div className={styles.containerBtnSearch}>
                                        <p
                                            onClick={() => router.push({
                                                pathname: "/rechercher",
                                                query: { search: query }
                                            })}
                                            className={styles.searchP}>Chercher <MagnifyingGlassIcon /></p>
                                        <p onClick={() => {
                                            setSearchValue('')
                                            setQuery('')
                                        }}>Fermer <XMarkIcon /> </p>
                                    </div>
                                </div>
                            }
                        </div>
                    }

                    <Bars3Icon onClick={OpenMenu} />
                </div>
            }
            {
                <div className={styles.HeaderResponsiveOpen} >
                    <div className={styles.close} ref={menuRef}>
                        <div className={styles.otherDiv}>
                            <div className={styles.HeaderTop}>
                                <img src={"/assets/diapo/book.png"} alt="Logo" />
                                <h1 onClick={() => router.push("/")}> OGLA </h1>
                                <XMarkIcon onClick={CloseMenu} />
                            </div>
                            <div className={styles.utilsBtn}>
                                <HeadPhoneBtn />
                                {
                                    theme ?
                                        <div className={styles.theme}>
                                            <SunIcon onClick={() => dispatch(changeTheme())} />
                                        </div>
                                        :
                                        <div className={styles.theme}>
                                            <MoonIcon onClick={() => dispatch(changeTheme())} />
                                        </div>

                                }
                                {
                                    router.pathname !== "/rechercher" &&
                                    <div className={styles.search} onClick={() => router.push('/rechercher')}>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                            <path d="M18.031 16.6168L22.3137 20.8995L20.8995 22.3137L16.6168 18.031C15.0769 19.263 13.124 20 11 20C6.032 20 2 15.968 2 11C2 6.032 6.032 2 11 2C15.968 2 20 6.032 20 11C20 13.124 19.263 15.0769 18.031 16.6168ZM16.0247 15.8748C17.2475 14.6146 18 12.8956 18 11C18 7.1325 14.8675 4 11 4C7.1325 4 4 7.1325 4 11C4 14.8675 7.1325 18 11 18C12.8956 18 14.6146 17.2475 15.8748 16.0247L16.0247 15.8748ZM12.1779 7.17624C11.4834 7.48982 11 8.18846 11 9C11 10.1046 11.8954 11 13 11C13.8115 11 14.5102 10.5166 14.8238 9.82212C14.9383 10.1945 15 10.59 15 11C15 13.2091 13.2091 15 11 15C8.79086 15 7 13.2091 7 11C7 8.79086 8.79086 7 11 7C11.41 7 11.8055 7.06167 12.1779 7.17624Z"></path>
                                        </svg>
                                    </div>
                                }
                            </div>
                            <div className={styles.menu}>
                                <div className={styles.HeaderResponsiveTitle}>
                                    <p> Ogla </p>
                                </div>
                                <div className={styles.HeaderResponsiveOpenMenu}>
                                    <ul>
                                        <li onClick={() => router.push("/")} className={router.pathname === '/' && styles.active}> <HomeIcon /> Accueil </li>
                                        <li onClick={() => router.push("/cat")} className={router.pathname === '/cat' && styles.active}> <Bars3CenterLeftIcon /> Catégories </li>
                                        <li onClick={NavProfil} className={router.pathname === '/profil' && styles.active}> <UserIcon /> Profil </li>
                                        <li onClick={() => router.push("/profil")}> <StarIcon /> Favoris </li>
                                        <li onClick={(getRandom)}> <ArrowPathIcon /> Aléatoire </li>
                                    </ul>
                                    {
                                        session &&
                                        <ul>
                                            <li onClick={() => {
                                                if (Notifs.length > 0) {
                                                    OpenAllService(Notifs[0].date_creation, session.user.id)
                                                }
                                                dispatch(setActiveModalNotif(true));
                                                dispatch(setOpen());
                                            }}> <BellIcon /> Notifications {isOpen && <span> {nbNotifs} </span>} </li>
                                        </ul>
                                    }
                                </div>

                                <div className={styles.trait}> </div>

                                <div className={styles.HeaderResponsiveTitle}>
                                    <p> Author </p>
                                </div>
                                {
                                    <div className={styles.HeaderResponsiveOpenMenu} style={{ marginBottom: "0px" }}>
                                        {
                                            !session?.user?.is_author &&
                                            <ul>
                                                <li onClick={() => router.push("/devenir-ecrivain")}> <PencilIcon /> Devenir autheur </li>
                                            </ul>
                                        }
                                        {
                                            session && session?.user?.is_author &&
                                            <ul>
                                                <li onClick={() => router.push('/dashboard')} className={router.pathname === '/dashboard' && styles.active}> <Squares2X2Icon /> Dashboard </li>
                                                <li onClick={() => router.push('/dashboard/books')}> <BookOpenIcon /> Mes livres </li>
                                                <li onClick={() => router.push('/dashboard/nouveau-livre')}> <PencilIcon /> Écrire </li>
                                            </ul>
                                        }

                                    </div>
                                }
                            </div>
                        </div>
                        {
                            session &&
                            <div className={styles.HeaderResponsiveOpenAccount}>
                                <div className={styles.trait}> </div>

                                <div className={styles.footer}>
                                    <div className={styles.footerLeft} onClick={() => router.push("/profil")}>
                                        <img src={session.user.image} alt="Photo de profil" />
                                        <div className={styles.footerInfos}>
                                            <h3> {session.user.pseudo} </h3>
                                            {
                                                !session.user.is_author &&
                                                <p> Lecteur </p>
                                            }
                                            {
                                                session.user.is_author &&
                                                <p> Écrivain </p>
                                            }
                                        </div>
                                    </div>
                                    <ArrowLeftOnRectangleIcon
                                        onClick={() => {
                                            LogoutService()
                                                .then(() => signOut()
                                                    .then(() => router.push('/')))
                                                .catch(() => signOut()
                                                    .then(() => router.push('/')))
                                        }}
                                        title={'Se déconnecter'} />
                                </div>
                            </div>
                        }
                        {
                            !session &&
                            <div className={styles.HeaderResponsiveOpenAccountNoConnect}>
                                <div className={styles.trait}> </div>
                                <div className={styles.HeaderSeConnecter} onClick={() => router.push({ pathname: "/auth", query: "login" })}>
                                    <h3> Se connecter  </h3>
                                    <KeyIcon />
                                </div>
                                <div className={styles.HeaderSinscrire} onClick={() => router.push({ pathname: "/auth", query: "register" })}  >
                                    <h3> S&apos;inscrire   </h3>
                                    <AcademicCapIcon />
                                </div>
                            </div>
                        }
                    </div>
                    <div className={styles.HeaderVide} onClick={CloseMenu}>
                    </div>
                </div>
            }
        </div>
    )
}

export default HeaderResponsive;