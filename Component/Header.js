import React, { useEffect, useRef, useState } from "react";
import styles from "../styles/Component/Header.module.scss";
import Link from "next/link";
import { router, useRouter } from "next/router";
import {
    ArrowLeftOnRectangleIcon, BellIcon, MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { signIn, signOut, useSession } from "next-auth/react";
import MainSearchBar from "./MainSearchBar";
import ResultSearchBar from "./SearchBar/ResultSearchBar";
import { SearchBarService } from "../service/Search/SearchService"
import { toastDisplayError } from "../utils/Toastify";
import { ToastContainer } from 'react-toastify';
import { useDispatch, useSelector } from "react-redux";
import { addComment, editComment, selectComments } from "../store/slices/commentSlice";
import { LogoutService } from "../service/User/Account.service";
import { HeadPhoneBtn, HeadPhoneBtnHeader } from "./layouts/Btn/ActionBtn";
import { selectNotifStatus, selectNotifs, setActiveModalNotif, setOpen } from "../store/slices/notifSlice";
import { openAll, OpenAllService } from "../service/Notifications/NotificationsService";
import { DarkLight } from "./layouts/Btn/DarkLight";
import { changeTheme, selectTheme } from "../store/slices/themeSlice";
import { setActiveModalState } from "../store/slices/modalSlice";
import { BellAlertIcon } from "@heroicons/react/24/solid";
import { setActiveMusic } from "../store/slices/musicSlice";
import 'tippy.js/dist/tippy.css'
import Tippy from "@tippyjs/react";
import 'tippy.js/animations/scale.css';
import { roundArrow } from 'tippy.js';
import 'tippy.js/dist/svg-arrow.css';
import ScreenSize from "../utils/Size";
import { selectCategories } from "../store/slices/categorySlice";
import CategorieHead from "./Header/CategorieHead";

export default function Header() {
    const router = useRouter();
    const { data: session } = useSession();
    const [searchValue, setSearchValue] = useState('');
    const [data, setData] = useState();
    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const Notifs = useSelector(selectNotifs)
    const statusNotif = useSelector(selectNotifStatus);
    const dispatch = useDispatch();
    const light = useSelector(selectTheme);
    // const light = localStorage.getItem('theme');

    const menuRef = useRef();
    const categorieRef = useRef();
    const svgRef = useRef();
    const svgCatRef = useRef();
    const [width] = ScreenSize()
    const categories = useSelector(selectCategories);

    const search = () => {
        if (query.length > 0) {
            SearchBarService(query)
                .then((res) => {
                    setData(res);
                })
                .catch((err) => console.log('err'));
        }
    }

    useEffect(() => {
        search();
    }, [query]);

    useEffect(() => {
        setQuery('');
        setSearchValue('');
    }, [router])

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

    function openNotif() {
        if (Notifs.length > 0) {
            OpenAllService(Notifs[0].date_creation, session.user.id)
        }
        dispatch(setActiveModalNotif(true));
        dispatch(setOpen());
    }

    function menuOC() {
        if (menuRef.current.className === styles.closeMenu) {
            categorieRef.current.className = styles.categorieClose;
            menuRef.current.className = styles.openMenu;
            svgRef.current.style.transform = 'rotate(0.5turn)';
            svgCatRef.current.style.transform = 'rotate(0turn)';
        }
        else {
            menuRef.current.className = styles.closeMenu;
            svgRef.current.style.transform = 'rotate(0turn)';
        }
    }

    function categorieOC() {
        if (categorieRef.current.className === styles.categorieClose) {
            menuRef.current.className = styles.closeMenu;
            categorieRef.current.className = styles.categorieOpen;
            svgCatRef.current.style.transform = 'rotate(0.5turn)';
            svgRef.current.style.transform = 'rotate(0turn)';
        }
        else {
            categorieRef.current.className = styles.categorieClose;
            svgCatRef.current.style.transform = 'rotate(0turn)';
        }
    }

    function navProfil(side) {
        localStorage.setItem('side', side)
        if (router.pathname === '/profil') {
            router.reload()
        }
        router.push('/profil')
    }

    function setTheme() {
        // if (JSON.parse(localStorage.getItem("theme")) === false)
        //     localStorage.setItem('theme', "true");
        // else
        //     localStorage.setItem('theme', "false");
        // dispatch(changeTheme(JSON.parse(localStorage.getItem("theme"))))
        dispatch(changeTheme())
    }

    return (
        <div className={router.pathname === '/' && width > 1200 ? styles.containerHome : /*light ? */styles.container /*: styles.darkContainer*/}>
            <div className={styles.mainA}>
                <h3 onClick={() => router.push('/')}> OGLA </h3>
                <nav>
                    <ul className={styles.colorDark}>
                        <li>
                            <div></div>
                            <h4 onClick={() => router.push("/")}> Accueil </h4>
                            {
                                router.pathname !== "/" &&
                                <div></div>
                            }
                            {
                                router.pathname === "/" &&
                                <div className={styles.activeNav}> </div>
                            }
                        </li>
                        <li>
                            <div></div>
                            <div className={styles.contentNav}>
                                <h4 onClick={() => router.push('/cat')}> Catégorie </h4>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" ref={svgCatRef} onClick={categorieOC}>
                                    <path d="M12 15.0006L7.75732 10.758L9.17154 9.34375L12 12.1722L14.8284 9.34375L16.2426 10.758L12 15.0006Z"></path>
                                </svg>
                            </div>
                            {
                                router.pathname !== "/cat" &&
                                <div></div>
                            }
                            {
                                router.pathname === "/cat" &&
                                <div className={styles.activeNav}> </div>
                            }
                        </li>
                        {
                            session && session.user.is_author ?
                                <>
                                    <li>
                                        <div></div>
                                        <h4 onClick={() => { localStorage.setItem('dashboard', 'new'); router.push('/dashboard/nouveau-livre') }}>
                                            Nouveau livre
                                        </h4>
                                        <div></div>
                                    </li>
                                    <li>
                                        <div></div>
                                        <h4 onClick={() => { localStorage.setItem('dashboard', 'books'); router.push('/dashboard/books') }}>
                                            Mes livres
                                        </h4>
                                        <div></div>
                                    </li>
                                </>

                                :
                                <li>
                                    <div></div>
                                    <h4 onClick={() => router.push('/devenir-auteur')}>
                                        Deviens écrivain
                                    </h4>
                                    <div></div>
                                </li>
                        }
                    </ul>
                    <div className={styles.categorieClose} ref={categorieRef}>
                        {
                            categories.map((elem) => {
                                return (
                                    <CategorieHead cat={elem.name} />
                                )
                            })
                        }
                    </div>
                </nav>
            </div>
            {
                width > 1000 && router.pathname !== '/rechercher' && /*!router.pathname.startsWith('/chapitre') &&*/
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
                        height={40}
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
                                }}>Fermer</p>
                            </div>
                        </div>
                    }
                </div>
            }
            <div className={styles.rightBlock}>
                <div className={styles.rightContent}>
                    {
                        !session &&
                        <h4 className={styles.connexion} onClick={() => {
                            if (router.pathname === '/')
                                router.push({ pathname: "/auth", query: "login" });
                            else
                                dispatch(setActiveModalState(true));
                        }}> Connexion </h4>
                    }
                    {
                        session &&
                        <div className={styles.utils}>
                            {
                                router.pathname !== '/' && width <= 1000 &&
                                <Tippy
                                    trigger="mouseenter"
                                    content={"Recherche"}
                                    animation={'scale'}
                                    delay={[300, 0]}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" onClick={() => router.push('/rechercher')}>
                                        <path d="M18.031 16.6168L22.3137 20.8995L20.8995 22.3137L16.6168 18.031C15.0769 19.263 13.124 20 11 20C6.032 20 2 15.968 2 11C2 6.032 6.032 2 11 2C15.968 2 20 6.032 20 11C20 13.124 19.263 15.0769 18.031 16.6168ZM16.0247 15.8748C17.2475 14.6146 18 12.8956 18 11C18 7.1325 14.8675 4 11 4C7.1325 4 4 7.1325 4 11C4 14.8675 7.1325 18 11 18C12.8956 18 14.6146 17.2475 15.8748 16.0247L16.0247 15.8748Z"></path>
                                    </svg>
                                </Tippy>
                            }
                            {
                                router.pathname === '/' && width <= 1200 &&
                                <Tippy
                                    trigger="mouseenter"
                                    content={"Recherche"}
                                    animation={'scale'}
                                    delay={[300, 0]}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" onClick={() => router.push('/rechercher')}>
                                        <path d="M18.031 16.6168L22.3137 20.8995L20.8995 22.3137L16.6168 18.031C15.0769 19.263 13.124 20 11 20C6.032 20 2 15.968 2 11C2 6.032 6.032 2 11 2C15.968 2 20 6.032 20 11C20 13.124 19.263 15.0769 18.031 16.6168ZM16.0247 15.8748C17.2475 14.6146 18 12.8956 18 11C18 7.1325 14.8675 4 11 4C7.1325 4 4 7.1325 4 11C4 14.8675 7.1325 18 11 18C12.8956 18 14.6146 17.2475 15.8748 16.0247L16.0247 15.8748Z"></path>
                                    </svg>
                                </Tippy>
                            }
                            <Tippy
                                trigger="mouseenter"
                                content={"Réglages"}
                                animation={'scale'}
                                delay={[300, 0]}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" onClick={() => navProfil("settings")}>
                                    <path d="M3.33946 17.0002C2.90721 16.2515 2.58277 15.4702 2.36133 14.6741C3.3338 14.1779 3.99972 13.1668 3.99972 12.0002C3.99972 10.8345 3.3348 9.824 2.36353 9.32741C2.81025 7.71651 3.65857 6.21627 4.86474 4.99001C5.7807 5.58416 6.98935 5.65534 7.99972 5.072C9.01009 4.48866 9.55277 3.40635 9.4962 2.31604C11.1613 1.8846 12.8847 1.90004 14.5031 2.31862C14.4475 3.40806 14.9901 4.48912 15.9997 5.072C17.0101 5.65532 18.2187 5.58416 19.1346 4.99007C19.7133 5.57986 20.2277 6.25151 20.66 7.00021C21.0922 7.7489 21.4167 8.53025 21.6381 9.32628C20.6656 9.82247 19.9997 10.8336 19.9997 12.0002C19.9997 13.166 20.6646 14.1764 21.6359 14.673C21.1892 16.2839 20.3409 17.7841 19.1347 19.0104C18.2187 18.4163 17.0101 18.3451 15.9997 18.9284C14.9893 19.5117 14.4467 20.5941 14.5032 21.6844C12.8382 22.1158 11.1148 22.1004 9.49633 21.6818C9.55191 20.5923 9.00929 19.5113 7.99972 18.9284C6.98938 18.3451 5.78079 18.4162 4.86484 19.0103C4.28617 18.4205 3.77172 17.7489 3.33946 17.0002ZM8.99972 17.1964C10.0911 17.8265 10.8749 18.8227 11.2503 19.9659C11.7486 20.0133 12.2502 20.014 12.7486 19.9675C13.1238 18.8237 13.9078 17.8268 14.9997 17.1964C16.0916 16.5659 17.347 16.3855 18.5252 16.6324C18.8146 16.224 19.0648 15.7892 19.2729 15.334C18.4706 14.4373 17.9997 13.2604 17.9997 12.0002C17.9997 10.74 18.4706 9.5632 19.2729 8.6665C19.1688 8.4405 19.0538 8.21822 18.9279 8.00021C18.802 7.78219 18.667 7.57148 18.5233 7.36842C17.3457 7.61476 16.0911 7.43414 14.9997 6.80405C13.9083 6.17395 13.1246 5.17768 12.7491 4.03455C12.2509 3.98714 11.7492 3.98646 11.2509 4.03292C10.8756 5.17671 10.0916 6.17364 8.99972 6.80405C7.9078 7.43447 6.65245 7.61494 5.47428 7.36803C5.18485 7.77641 4.93463 8.21117 4.72656 8.66637C5.52881 9.56311 5.99972 10.74 5.99972 12.0002C5.99972 13.2604 5.52883 14.4372 4.72656 15.3339C4.83067 15.5599 4.94564 15.7822 5.07152 16.0002C5.19739 16.2182 5.3324 16.4289 5.47612 16.632C6.65377 16.3857 7.90838 16.5663 8.99972 17.1964ZM11.9997 15.0002C10.3429 15.0002 8.99972 13.6571 8.99972 12.0002C8.99972 10.3434 10.3429 9.00021 11.9997 9.00021C13.6566 9.00021 14.9997 10.3434 14.9997 12.0002C14.9997 13.6571 13.6566 15.0002 11.9997 15.0002ZM11.9997 13.0002C12.552 13.0002 12.9997 12.5525 12.9997 12.0002C12.9997 11.4479 12.552 11.0002 11.9997 11.0002C11.4474 11.0002 10.9997 11.4479 10.9997 12.0002C10.9997 12.5525 11.4474 13.0002 11.9997 13.0002Z"></path>
                                </svg>
                            </Tippy>
                            <Tippy
                                trigger="mouseenter"
                                content={"Notifications"}
                                animation={'scale'}
                                delay={[300, 0]}>
                                <div className={styles.bellActive} onClick={openNotif}>
                                    <BellIcon onClick={() => dispatch(setActiveModalNotif(true))} />
                                    {isOpen && <span></span>}
                                </div>
                            </Tippy>
                        </div>
                    }
                    <div className={styles.svgMenu} onClick={menuOC}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" ref={svgRef}>
                            <path d="M12 15.0006L7.75732 10.758L9.17154 9.34375L12 12.1722L14.8284 9.34375L16.2426 10.758L12 15.0006Z"></path>
                        </svg>
                    </div>
                    {
                        !session &&
                        <h4 className={styles.inscription} onClick={() => router.push({ pathname: "/auth", query: "register" })}>
                            Inscription
                        </h4>
                    }
                    {
                        session &&
                        <div className={styles.accountContainer}>
                            {
                                session.user.image === '' ?
                                    <div className={styles.account}
                                        onClick={() => {
                                            router.push('/profil')
                                        }}
                                    >

                                        <div>
                                            {
                                                session && session.user.pseudo &&
                                                <p>{session.user.pseudo[0].toUpperCase()}</p>
                                            }
                                        </div>
                                    </div>
                                    :
                                    <img
                                        referrerPolicy="no-referrer"
                                        onClick={() => {
                                            router.push('/profil')
                                        }}
                                        className={styles.imgProfil}
                                        src={session.user.image}
                                    />
                            }
                        </div>
                    }
                </div>
                <div className={styles.closeMenu} ref={menuRef}>
                    {
                        session ? /*router.pathname !== '/' ?*/
                            <div className={styles.userConnected}>
                                <div className={styles.contentMenu /* Musique */} onClick={() => dispatch(setActiveMusic())}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                        <path d="M12 13.5351V3H20V6H14V17C14 19.2091 12.2091 21 10 21C7.79086 21 6 19.2091 6 17C6 14.7909 7.79086 13 10 13C10.7286 13 11.4117 13.1948 12 13.5351Z"></path>
                                    </svg>
                                    <div className={styles.menuPos}>
                                        <p> Musique </p>
                                        <HeadPhoneBtnHeader />
                                    </div>
                                </div>

                                {
                                    router.pathname !== '/' &&
                                    <div className={styles.contentMenu /* Thème */} onClick={setTheme}>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                            <path d="M11.3807 2.01904C9.91573 3.38786 9 5.33708 9 7.50018C9 11.6423 12.3579 15.0002 16.5 15.0002C18.6631 15.0002 20.6123 14.0844 21.9811 12.6195C21.6613 17.8539 17.3149 22.0002 12 22.0002C6.47715 22.0002 2 17.523 2 12.0002C2 6.68532 6.14629 2.33888 11.3807 2.01904Z"></path>
                                        </svg>
                                        <div className={styles.menuPos}>
                                            <p> Thème </p>
                                            <DarkLight />
                                        </div>
                                    </div>
                                }

                                <div className={styles.trait}> </div>

                                <div className={styles.contentMenu /* Profil */} onClick={() => navProfil("profil")}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                        <path d="M20 22H4V20C4 17.2386 6.23858 15 9 15H15C17.7614 15 20 17.2386 20 20V22ZM12 13C8.68629 13 6 10.3137 6 7C6 3.68629 8.68629 1 12 1C15.3137 1 18 3.68629 18 7C18 10.3137 15.3137 13 12 13Z"></path>
                                    </svg>
                                    <div className={styles.menuPos}>
                                        <p> Profil </p>
                                        <div style={{ width: "40px" }}> </div>
                                    </div>
                                </div>

                                <div className={styles.contentMenu /* Écrivain */} onClick={() => navProfil("writer")}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                        <path d="M6.93912 14.0327C6.7072 14.6562 6.51032 15.233 6.33421 15.8154C7.29345 15.1188 8.43544 14.6766 9.75193 14.512C12.2652 14.1979 14.4976 12.5384 15.6279 10.4535L14.1721 8.99878L15.5848 7.58407C15.9185 7.24993 16.2521 6.91603 16.5858 6.58237C17.0151 6.15301 17.5 5.35838 18.0129 4.21479C12.4197 5.08172 8.99484 8.50636 6.93912 14.0327ZM17 8.99728L18 9.99658C17 12.9966 14 15.9966 10 16.4966C7.33146 16.8301 5.66421 18.6635 4.99824 21.9966H3C4 15.9966 6 1.99658 21 1.99658C20.0009 4.99392 19.0018 6.99303 18.0027 7.99391C17.6662 8.33038 17.3331 8.66372 17 8.99728Z"></path>
                                    </svg>
                                    <div className={styles.menuPos}>
                                        <p> Écrivain </p>
                                        <div style={{ width: "40px" }}> </div>
                                    </div>
                                </div>

                                <div className={styles.contentMenu /* Search */} onClick={() => router.push('/rechercher')}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                        <path d="M18.031 16.6168L22.3137 20.8995L20.8995 22.3137L16.6168 18.031C15.0769 19.263 13.124 20 11 20C6.032 20 2 15.968 2 11C2 6.032 6.032 2 11 2C15.968 2 20 6.032 20 11C20 13.124 19.263 15.0769 18.031 16.6168ZM16.0247 15.8748C17.2475 14.6146 18 12.8956 18 11C18 7.1325 14.8675 4 11 4C7.1325 4 4 7.1325 4 11C4 14.8675 7.1325 18 11 18C12.8956 18 14.6146 17.2475 15.8748 16.0247L16.0247 15.8748Z"></path>
                                    </svg>
                                    <div className={styles.menuPos}>
                                        <p> Chercher un livre</p>
                                        <div> </div>
                                    </div>
                                </div>

                                <div className={styles.trait}> </div>

                                <div className={styles.logout}
                                    onClick={() => {
                                        LogoutService()
                                            .then(() => signOut()
                                                .then(() => router.push('/')))
                                            .catch(() => signOut()
                                                .then(() => router.push('/')))
                                    }}
                                >
                                    <ArrowLeftOnRectangleIcon />
                                    <p> Déconnexion </p>
                                </div>
                            </div>

                            :

                            <div className={styles.userDisconnected}>
                                <div className={styles.contentMenu /* Musique */} onClick={() => dispatch(setActiveMusic())}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                        <path d="M12 13.5351V3H20V6H14V17C14 19.2091 12.2091 21 10 21C7.79086 21 6 19.2091 6 17C6 14.7909 7.79086 13 10 13C10.7286 13 11.4117 13.1948 12 13.5351Z"></path>
                                    </svg>
                                    <div className={styles.menuPos}>
                                        <p> Musique </p>
                                        <HeadPhoneBtnHeader />
                                    </div>
                                </div>
                                {
                                    router.pathname !== '/' &&
                                    <div className={styles.contentMenu /* Thème */} onClick={setTheme}>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                            <path d="M11.3807 2.01904C9.91573 3.38786 9 5.33708 9 7.50018C9 11.6423 12.3579 15.0002 16.5 15.0002C18.6631 15.0002 20.6123 14.0844 21.9811 12.6195C21.6613 17.8539 17.3149 22.0002 12 22.0002C6.47715 22.0002 2 17.523 2 12.0002C2 6.68532 6.14629 2.33888 11.3807 2.01904Z"></path>
                                        </svg>
                                        <div className={styles.menuPos}>
                                            <p> Thème </p>
                                            <DarkLight />
                                        </div>
                                    </div>
                                }
                                <div className={styles.contentMenu /* Notifs */} onClick={() => dispatch(setActiveModalState(true))}>
                                    <BellAlertIcon className={styles.bellHome} />
                                    <div className={styles.menuPos}>
                                        <p> Notifications </p>
                                        <div> </div>
                                    </div>
                                </div>
                                <div className={styles.contentMenu /* Search */} onClick={() => router.push('/rechercher')}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                        <path d="M18.031 16.6168L22.3137 20.8995L20.8995 22.3137L16.6168 18.031C15.0769 19.263 13.124 20 11 20C6.032 20 2 15.968 2 11C2 6.032 6.032 2 11 2C15.968 2 20 6.032 20 11C20 13.124 19.263 15.0769 18.031 16.6168ZM16.0247 15.8748C17.2475 14.6146 18 12.8956 18 11C18 7.1325 14.8675 4 11 4C7.1325 4 4 7.1325 4 11C4 14.8675 7.1325 18 11 18C12.8956 18 14.6146 17.2475 15.8748 16.0247L16.0247 15.8748Z"></path>
                                    </svg>
                                    <div className={styles.menuPos}>
                                        <p> Chercher un livre</p>
                                        <div> </div>
                                    </div>
                                </div>
                                <div className={styles.trait}> </div>
                                {
                                    router.pathname === '/' || router.pathname === '/devenir-auteur' ?
                                        <div onClick={() => router.push({ pathname: "/auth", query: "login" })}
                                            className={styles.login}>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                                <path d="M10 11V8L15 12L10 16V13H1V11H10ZM2.4578 15H4.58152C5.76829 17.9318 8.64262 20 12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C8.64262 4 5.76829 6.06817 4.58152 9H2.4578C3.73207 4.94289 7.52236 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C7.52236 22 3.73207 19.0571 2.4578 15Z"></path>
                                            </svg>
                                            <p> Se connecter </p>
                                        </div>
                                        :
                                        <div onClick={() => dispatch(setActiveModalState(true))} className={styles.login}>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                                <path d="M10 11V8L15 12L10 16V13H1V11H10ZM2.4578 15H4.58152C5.76829 17.9318 8.64262 20 12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C8.64262 4 5.76829 6.06817 4.58152 9H2.4578C3.73207 4.94289 7.52236 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C7.52236 22 3.73207 19.0571 2.4578 15Z"></path>
                                            </svg>
                                            <p> Se connecter </p>
                                        </div>
                                }
                            </div>
                    }
                </div>
            </div>


        </div >
    )
}