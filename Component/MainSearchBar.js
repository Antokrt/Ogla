import styles from "../styles/Component/Searchbar.module.scss";
import {useEffect, useState} from "react";
import {router, useRouter} from "next/router";
import { SearchBarService} from "../service/Search/SearchService";

export default function MainSearchBar({data,submit,width,height,query,search}) {

    const router = useRouter();

    return (
        <div style={{
            width: width + "%",
            height: height + "px"
        }}>
            <form className={styles.container} onSubmit={(e) => {
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
                <input
                    className={router.pathname === '/' && styles.homeSearch}
                    autoComplete={'off'}
                    onChange={(e) => {
                    query(e.target.value);
                }} type="text" name={"searchbar"} placeholder="Chercher un livre"/>
            </form>
        </div>


    )
}

