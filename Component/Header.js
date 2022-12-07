import React, {useContext, useEffect, useState} from "react";
import styles from "../styles/Component/Header.module.scss";
import scrollbar from "../styles/utils/scrollbar.module.scss";
import Link from "next/link";
import {useRouter} from "next/router";
import Category from "../json/category.json";
import {LangueContext} from "../utils/context";
import MainSearchBar from "./MainSearchBar";
import {ArrowUpIcon, ChevronDoubleUpIcon, MagnifyingGlassIcon} from "@heroicons/react/24/outline";
import ResultSearchBar from "./SearchBar/ResultSearchBar";


export default function Header() {
    const router = useRouter();
    const langueActive = useContext(LangueContext);
    const [seeSearchBar, setSeeSearchBar] = useState(true);
    const [searchValue, setSearchValue] = useState("");
    const [login, setLogin] = useState(false);


    return (
        <div className={styles.container}>
            <div className={styles.mainA}>
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
                    login ?
                        <div className={styles.account}
                        onClick={() =>{
                        router.push("/profil")
                        }}
                        >
                            <div>
                                <p>A</p>
                            </div>
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

            }


        </div>
    )
}