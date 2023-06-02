import styles from "../styles/Component/Searchbar.module.scss";
import {useEffect, useState} from "react";
import {router, useRouter} from "next/router";
import { SearchBarService} from "../service/Search/SearchService";
import { useSelector } from "react-redux";
import { selectTheme } from "../store/slices/themeSlice";
import ScreenSize from "../utils/Size";

export default function MainSearchBar({data,submit,width,height,query,search}) {

    const router = useRouter();
    const light = useSelector(selectTheme);
    const [widthPage] = ScreenSize();

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
                    router.pathname === '/' && widthPage > 1200 &&
                    <input
                    className={styles.homeSearch}
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

