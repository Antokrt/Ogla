import styles from "../../styles/SearchBar/SearchBarResult.module.scss";
import scrollbar from "../../styles/utils/scrollbar.module.scss";
import {MagnifyingGlassIcon, TrashIcon} from "@heroicons/react/24/outline";
import React from "react";
import {router} from "next/router";

const ResultSearchBar = ({destroy, search}) => {
    return (
        <div className={styles.resultContainer}>
            {
                search !== "undefined" ?
                <div>
                    <div className={styles.fixedContainer + " " + scrollbar.scrollbar}>
                        <h8 className={styles.typeResult}>Livres (3)</h8>

                        <div className={styles.itemResult}>
                            <img src={"/assets/livre5.jpg"}/>
                            <div className={styles.contentResult}>
                                <h8>La belle et le bouffon</h8>
                                <p className={styles.categoryResult}>Julio Caracas &nbsp; | &nbsp; 165 chapitres &nbsp; | &nbsp; <span>Comédie</span></p>
                            </div>
                        </div>


                        <div className={styles.itemResult}>
                            <img src={"/assets/livre5.jpg"}/>
                            <div className={styles.contentResult}>
                                <h8>La belle et le bouffon</h8>
                                <p className={styles.categoryResult}>Julio Caracas | 165 chapitres | <span>Comédie</span></p>
                            </div>
                        </div>


                        <div className={styles.itemResult}>
                            <img src={"/assets/livre5.jpg"}/>
                            <div className={styles.contentResult}>
                                <h8>La belle et le bouffon</h8>
                                <p className={styles.categoryResult}>Julio Caracas | 165 chapitres | <span>Comédie</span></p>
                            </div>
                        </div>


                        <div className={styles.itemResult}>
                            <img src={"/assets/livre5.jpg"}/>
                            <div className={styles.contentResult}>
                                <h8>La belle et le bouffon</h8>
                                <p className={styles.categoryResult}>Julio Caracas | 165 chapitres | <span>Comédie</span></p>
                            </div>
                        </div>


                    </div>
                    <div className={styles.containerBtnSearch}>
                        <p
                            onClick={() => router.push({
                                pathname: "/rechercher",
                                query: {search: search}
                            })}
                            className={styles.searchP}>Chercher <MagnifyingGlassIcon/></p>
                        <p onClick={() => {
                            destroy()
                        }}>Fermer</p>
                    </div>
                </div>
                    :
                    <div className={styles.errContainer}>
                        <h5><span>Oh non ! </span> <br/> La recherche ne donne rien...</h5>
                    </div>
            }

        </div>
    )
}

export default ResultSearchBar;