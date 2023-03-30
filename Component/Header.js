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

import {toastDisplayError} from "../utils/Toastify";
import {ToastContainer} from 'react-toastify';
import {useDispatch, useSelector} from "react-redux";
import {addComment, editComment, selectComments} from "../store/slices/commentSlice";
import {LogoutService} from "../service/User/Account.service";
import {HeadPhoneBtn} from "./layouts/Btn/ActionBtn";

export default function Header() {
    const router = useRouter();
    const {data: session} = useSession();
    const [searchValue,setSearchValue] = useState('');
    const [data,setData] = useState();
    const [query,setQuery] = useState('');
    const [activMusic,setActivMusic] = useState(false)
    


    const goToProfil = () => {
            if(session.user.is_author){
                router.push("/dashboard/profil")
            }
            else{
                router.push('/profil')
            }
    }

    const search = () => {
        if (query.length > 0) {
            SearchBarService(query)
                .then((res) => {
                    setData(res);
                })
                .catch((err) => console.log(err));
        }
    }

    useEffect(() => {
        search();
    }, [query]);

    useEffect(() => {
        setQuery('');
        setSearchValue('');
    },[router])


    const comments = useSelector(selectComments);
    const dispatch = useDispatch();
    return (
        <div className={styles.container}>
            <div className={styles.mainA}>
                <h3>OGLA</h3>
                <nav>
                    <ul>
                        <li><Link href="/"><a
                            className={router.pathname === "/" ? styles.activeNav : ""}>Accueil</a></Link></li>
                        <li><Link href=
                                      {{
                                          pathname: "/cat/",
                                      }}
                        ><a className={router.pathname === "/Category" ? styles.activeNav : ""}>Catégorie</a></Link>
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
                                <li><Link href="/devenir-auteur"><a
                                    className={router.pathname === "/devenir-auteur" ? styles.activeNav : ""}>Deviens
                                    écrivain</a></Link></li>
                        }

                    </ul>
                </nav>
            </div>

            <div className={styles.mainLog}>
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

                    <div className={styles.headphone}>
                        <HeadPhoneBtn/>

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
                                    </div> :

                                    <img
                                        referrerPolicy="no-referrer"
                                        onClick={() => {
                                            router.push('/profil')
                                        }}
                                        className={styles.imgProfil} src={session.user.image}/>
                            }


                            <ArrowLeftOnRectangleIcon
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
                        <div
                            onClick={() => router.push({
                                pathname: "/auth",
                                query: "login"
                            })}
                            className={styles.login}>
                            <button>Se connecter
                            </button>
                        </div>
                }
            </div>
            {/*           <div className={styles.mainA}>
                <div className={styles.logo}>
                    <img src={"/assets/logo.png"}/>
                </div>

                <div className={styles.searchBar}>
                    <MainSearchBar  change={(e) => setSearchValue(e.target.value)} submit={() => {setSearchValue("")}} width={100} height={50}/>
                    {
                        searchValue !== "" &&
                        <ResultSearchBar searchBtn = {() => setSearchValue("")} destroy={() => setSearchValue("")} search={searchValue}/>
                    }
                </div>

                {
                    status === 'authenticated' ?
                        <div className={styles.accountContainer}>
                            <div className={styles.account}
                                 onClick={() =>{
                                     router.push("/profil")
                                 }}
                            >
                                <div>
                                    <p>{session.user.pseudo[0].toUpperCase()}</p>
                                </div>
                            </div>

                            <ArrowLeftOnRectangleIcon
                                onClick={() => {
                                signOut()
                                    .then(() => router.push('/'))
                                }
                                }
                                title={'Se déconnecter'}/>
                        </div>

                        :
                        <div className={styles.login}>
                            <button onClick={() => router.push({
                                pathname: "auth",
                                query: "login"
                            })}>Se connecter
                            </button>
                        </div>
                }

            </div>


            {
                router.pathname !== "/Post/[id]" &&

                <div className={styles.mainH}>
                    <nav>
                        <ul>
                            <li><Link href="/"><a
                                className={router.pathname === "/" ? styles.activeNav : ""}>Accueil</a></Link></li>
                            <li><Link href=
                                          {{
                                              pathname: "/Category",
                                          }}
                            ><a className={router.pathname === "/Category" ? styles.activeNav : ""}>Catégorie</a></Link>
                            </li>
                            <li><Link href="/devenir-auteur"><a
                                className={router.pathname === "/devenir-auteur" ? styles.activeNav : ""}>Deviens
                                écrivain</a></Link></li>
                            <li><Link href="/"><a
                                className={router.pathname === "/contact" ? styles.activeNav : ""}>Contact</a></Link>
                            </li>
                        </ul>
                    </nav>
                </div>

            }*/}

        </div>
    )
}