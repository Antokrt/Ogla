import React, {useEffect, useState} from "react";
import styles from "../styles/Component/Header.module.scss";
import Link from "next/link";
import {router, useRouter} from "next/router";
import {
    ArrowLeftOnRectangleIcon, MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import {signIn, signOut, useSession} from "next-auth/react";
import MainSearchBar from "./MainSearchBar";
import ResultSearchBar from "./SearchBar/ResultSearchBar";
import {SearchBarService} from "../service/Search/SearchService"
import { toastDisplayError } from "../utils/Toastify";
import { ToastContainer } from 'react-toastify';
import { useDispatch, useSelector } from "react-redux";
import { addComment, editComment, selectComments } from "../store/slices/commentSlice";
import { LogoutService } from "../service/User/Account.service";
import { HeadPhoneBtn } from "./layouts/Btn/ActionBtn";
import { BellAlertIcon } from "@heroicons/react/24/outline";
import { selectNotifStatus, selectNotifs, setActiveModalNotif, setOpen } from "../store/slices/notifSlice";
import { openAll } from "../service/Notifications/NotificationsService";
import DarkLight from "./layouts/Btn/DarkLight";
import { selectTheme } from "../store/slices/themeSlice";
import {setActiveModalState} from "../store/slices/modalSlice";

export default function Header() {
    const router = useRouter();
    const {data: session} = useSession();
    const [searchValue, setSearchValue] = useState('');
    const [data, setData] = useState();
    const [query, setQuery] = useState('');
    const [activMusic, setActivMusic] = useState(false)
    const Notifs = useSelector(selectNotifs)
    const [nbNotifs, setNbNotifs] = useState(0);
    const statusNotif = useSelector(selectNotifStatus);

    const goToProfil = () => {
        if (session.user.is_author) {
            router.push("/dashboard/profil")
        } else {
            router.push('/profil')
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

    useEffect(() => {
        search();
    }, [query]);



    useEffect(() => {
        setQuery('');
        setSearchValue('');
    }, [router])

    useEffect(() => {
        var nb = 0;
        if (statusNotif && Notifs.length > 0)
            openAll(Notifs[0].date_creation, session?.user.id)
        else {
            Notifs.forEach((elem) => {
                if (!elem.open)
                    nb++;
            })
        }
        setNbNotifs(nb);
    }, [Notifs])

    const dispatch = useDispatch();
    const light = useSelector(selectTheme); 
    return (
        <div className={light? styles.container : styles.darkContainer}>
            <div className={styles.mainA}>
                <h3 onClick={() => router.push('/')}> OGLA </h3>
                <nav>
                    <ul className={router.pathname === ('/') ? styles.colorW : styles.colorDark}>
                        <li className={router.pathname === "/" ? styles.activeNav : ""}><Link href="/"><a
                        >Accueil</a></Link></li>
                        <li className={router.pathname.startsWith('/cat') ? styles.activeNavDark : ""}><Link href=
                                                                                                                 {{
                                                                                                                     pathname: "/cat/",
                                                                                                                 }}
                        ><a>Catégorie</a></Link>
                        </li>
                        {
                            session && session.user.is_author ?
                                <>
                                    <li onClick={() => {
                                        localStorage.setItem('dashboard', 'new')
                                    }
                                    }><Link href="/dashboard/nouveau-livre"><a>Nouveau livre
                                    </a></Link></li>
                                    <li onClick={() => {
                                        localStorage.setItem('dashboard', 'books')
                                    }
                                    }><Link href="/dashboard/books"><a>Mes livres</a></Link></li>
                                </>

                                :
                                <li><Link href="/devenir-auteur"><a>Deviens
                                    écrivain</a></Link></li>
                        }

                    </ul>
                </nav>
            </div>
            <div className={light? styles.mainLog : styles.darkMainLog}>
                {
                    router.pathname !== '/rechercher' && !router.pathname.startsWith('/chapitre') &&
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
                            width={100}/>

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
                                            query: {search: query}
                                        })}
                                        className={styles.searchP}>Chercher <MagnifyingGlassIcon/></p>
                                    <p onClick={() => {

                                        setSearchValue('')
                                        setQuery('')
                                    }}>Fermer</p>
                                </div>
                            </div>
                        }
                    </div>
                }

                {
                    session && router.pathname !== '/' ?
                        <>
                            {
                                session?.user?.settings?.music &&
                                <div className={styles.headphone}>
                                    <HeadPhoneBtn/>
                                </div>
                            }
                        </>
                        :
                        <div className={styles.headphone}>
                            <HeadPhoneBtn/>
                        </div>
                }


                <div className={styles.bell}>
                    {
                        nbNotifs === 0 &&
                        <BellAlertIcon className={router.pathname !== '/' && styles.activeNavDark} onClick={() => {
                            dispatch(setActiveModalNotif(true));
                        }}/>
                    }
                    {
                        nbNotifs > 0 &&
                        <div className={styles.bellActive}>
                            <BellAlertIcon onClick={() => {
                                openAll(Notifs[0].date_creation, session.user.id)
                                    .then((res) => console.log('res'))
                                    .catch((err) => console.log('err'));
                                dispatch(setActiveModalNotif(true));
                                dispatch(setOpen());
                            }}/>
                            <p> {nbNotifs} </p>
                        </div>
                    }
                </div>
                {
                    session ?
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
                                        className={styles.imgProfil} src={session.user.image}/>
                            }

                            <ArrowLeftOnRectangleIcon
                                className={router.pathname === '/' ? styles.colorW : styles.colorDark}
                                onClick={() => {
                                    LogoutService()
                                        .then(() => signOut()
                                            .then(() => router.push('/')))
                                        .catch(() => signOut()
                                            .then(() => router.push('/')))
                                }}
                                title={'Se déconnecter'}/>
                        </div>
                        :

                        <>
                            {
                                router.pathname === '/' || router.pathname === '/devenir-auteur' ?
                                    <div
                                        onClick={() => router.push({
                                            pathname: "/auth",
                                            query: "login"
                                        })}
                                        className={styles.login}>
                                        <button>Se connecter
                                        </button>
                                    </div>
                                    :
                                    <div
                                        onClick={() => dispatch(setActiveModalState(true))}
                                        className={styles.login}>
                                        <button>Se connecter
                                        </button>
                                    </div>
                            }

                        </>

                }
                {
                    // router.pathname !== '/' &&
                    <DarkLight />
                }
            </div>
        </div>
    )
}