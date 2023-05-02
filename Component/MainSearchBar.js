import styles from "../styles/Component/Searchbar.module.scss";
import {useEffect, useState} from "react";
import {router, useRouter} from "next/router";
import { SearchBarService} from "../service/Search/SearchService";
import { useSelector } from "react-redux";
import { selectTheme } from "../store/slices/themeSlice";

export default function MainSearchBar({data,submit,width,height,query,search}) {

    const router = useRouter();
    const light = useSelector(selectTheme);

    return (
        <div style={{
            width: width + "%",
            height: height + "px"
        }}>
            <form className={light? styles.container : styles.darkContainer} onSubmit={(e) => {
                e.preventDefault();
                e.target.reset();
                if(search.length !== 0 && search !== "undefined") {
                    router.push({
                        pathname: "/rechercher",
                        query: {search: search}
                    })
                    submit();
                    e.target.reset();
                }
                return null;
            }}>
                {
                    router.pathname === '/' &&
                    <input
                    className={router.pathname === '/' && styles.homeSearch}
                    autoComplete={'off'}
                    onChange={(e) => {
                        query(e.target.value);
                    }} type="text" name={"searchbar"} placeholder="Chercher un livre"/>
                }
                {
                    router.pathname !== '/' &&
                    <input
                    className={light? styles.lightInput : styles.darkInput}
                    autoComplete={'off'}
                    onChange={(e) => {
                        query(e.target.value);
                    }} type="text" name={"searchbar"} placeholder="Chercher un livre"/>
                }
            </form>
        </div>


    )
}

