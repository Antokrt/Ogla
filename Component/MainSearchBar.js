import styles from "../styles/Component/Searchbar.module.scss";
import { useEffect, useState } from "react";
import { router, useRouter } from "next/router";
import { SearchBarService } from "../service/Search/SearchService";
import { useSelector } from "react-redux";
import { selectTheme } from "../store/slices/themeSlice";
import ScreenSize from "../utils/Size";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function MainSearchBar({ data, submit, width, height, query, search }) {

    const router = useRouter();
    const theme = useSelector(selectTheme);

    const submitSearch = () => {
        if (search.length !== 0 && search !== "undefined") {
            router.push({
                pathname: "/rechercher",
                query: { search: search }
            })
            submit();
        }
        return null;
    }

    return (
        <div className={theme ? '' : styles.dark} style={{
            width: width + "%",
            height: height + "px"
        }}>


            <form

                className={router.pathname !== '/' ?
                    styles.container
                    :
                    styles.homeContainer + ' ' + styles.container
                }
                onSubmit={(e) => {
                    e.preventDefault();
                    e.target.reset();
                    submitSearch();
                    e.target.reset();
                }}>

                {
                    router.pathname === '/' &&
                    <input
                        className={styles.homeSearch}
                        autoComplete={'off'}
                        onChange={(e) => {
                            query(e.target.value);
                        }} type="text" name={"searchbar"} placeholder="Chercher un livre..." />
                }

                {
                    router.pathname !== '/' &&
                    <input
                        className={theme ? styles.lightInput : styles.darkInput}
                        autoComplete={'off'}
                        onChange={(e) => {
                            query(e.target.value);
                        }} type="text" name={"searchbar"} placeholder="Chercher un livre..." />
                }

                <div className={styles.loopContainer}>
                    <div tabIndex={0} onClick={() => submitSearch()}>
                        <MagnifyingGlassIcon />
                    </div>
                </div>
            </form>
        </div>
    )
}

