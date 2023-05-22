import { AcademicCapIcon, ArrowLeftOnRectangleIcon, ArrowPathIcon, Bars3CenterLeftIcon, Bars3Icon, BellIcon, BookOpenIcon, ChevronDownIcon, HomeIcon, KeyIcon, MagnifyingGlassIcon, PencilIcon, Squares2X2Icon, StarIcon, UserIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useSession, signOut } from "next-auth/react";
import { useEffect } from "react";
import { useState } from "react";
import styles from "../styles/Component/HeaderResponsive.module.scss";
import anim from "../styles/utils/anim.module.scss"
import { LogoutService } from "../service/User/Account.service";
import { useRouter } from "next/router";
import DarkLight from "./layouts/Btn/DarkLight";
import { HeadPhoneBtn } from "./layouts/Btn/ActionBtn";
import { useRef } from "react";
import { GetRandomBookService } from "../service/Book/BookService";
import MainSearchBar from "./MainSearchBar";
import ResultSearchBar from "./SearchBar/ResultSearchBar";
import { SearchBarService } from "../service/Search/SearchService";
import { useDispatch, useSelector } from "react-redux";
import { selectNotifs, setActiveModalNotif, setOpen } from "../store/slices/notifSlice";
import { OpenAllService, openAll } from "../service/Notifications/NotificationsService";
import { selectTheme } from "../store/slices/themeSlice";

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

    function SubmitForm(e) {
        e.preventDefault();
        e.target.reset();
        if (search.length !== 0 && search !== "undefined") {
            router.push({
                pathname: "/rechercher",
                query: { search: search }
            })
            submit();
            e.target.reset();
        }
        return null;
    }

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
        <div className={theme? styles.HeaderResponsive : styles.darkHeaderResponsive}>
            {
                !openMenu &&
                <div className={styles.HeaderResponsiveClosed}>
                    <h1 onClick={() => router.push("/")}> OGLA </h1>
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
                                    }}>Fermer <XMarkIcon/> </p>
                                </div>
                            </div>
                        }
                    </div>
                    {/* <form className={styles.HeaderResponsiveOpenForm} onSubmit={(e) => SubmitForm(e)}>
                        <input
                            autoComplete={'off'}
                            onChange={(e) => setQuery(e.target.value)}
                            type="text"
                            name={"searchbar"}
                            placeholder="Chercher un livre"
                        />
                    </form> */}
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
                                <DarkLight />
                            </div>
                            <form className={styles.HeaderResponsiveOpenForm} onSubmit={(e) => SubmitForm(e)}>
                                <input
                                    autoComplete={'off'}
                                    onChange={(e) => setQuery(e.target.value)}
                                    type="text"
                                    name={"searchbar"}
                                    placeholder="Chercher un livre"
                                />
                            </form>
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
                                                if (Notifs.lenght > 0) {
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
                                                <li onClick={() => router.push("/devenir-auteur")}> <PencilIcon /> Devenir autheur </li>
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
                                    <h3> S'inscrire   </h3>
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