import styles from "../../styles/SearchBar/SearchBarResult.module.scss";
import React, {useEffect, useState} from "react";
import {TagIcon} from "@heroicons/react/24/solid";
import {useRouter} from "next/router";
import { useSelector } from "react-redux";
import { selectTheme } from "../../store/slices/themeSlice";


const ResultSearchBar = ({destroy, query, data}) => {

    const router = useRouter();
    const light = useSelector(selectTheme);
    console.log(data)
    const titleHeader = (type, number) => {
        return (
            <div className={styles.titleHeader}>
                <h5>{type} ({number})</h5>
            </div>
        )
    }

    return (
        <div className={light? styles.resultContainer : styles.blackResultContainer}>
            {
                data &&
                <>
                    {
                        data?.books.length > 0 &&
                        <>
                            {titleHeader('Livre(s)', data.books.length)}
                            {
                                data.books.map((item, index) => {
                                    return (
                                        <div
                                            key={item._id}
                                            onClick={() => {
                                                router.push({
                                                    pathname: '/livre/' + item._id,
                                                    query: item.slug
                                                })
                                            }}
                                            className={styles.itemResult}>
                                            <p className={styles.title}>{item.title}</p>
                                            <div className={styles.subContainer}>
                                                <p className={styles.authorPseudo}>{item.author_pseudo}</p>
                                                <p className={styles.category}>{item.category}</p>
                                                <p>{item.likes} likes</p>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </>
                    }

                    {
                        data?.authors.length > 0 &&
                        <>
                            {titleHeader('Auteur(s)', data?.authors.length)}
                            {
                                data?.authors.map((item, index) => {
                                    return (
                                        <div
                                            key={item._id}
                                            onClick={() => {
                                                router.push({
                                                    pathname: '/auteur/' + item.pseudo,
                                                })
                                            }}
                                            className={styles.itemResult}>
                                            <p className={styles.title}>{item.pseudo}</p>
                                            <div className={styles.subContainer}>
                                                <p>{item.author.likes} likes</p>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </>
                    }


                </>
                /*  :
                  <div className={styles.errContainer}>
                      <h5><span>Oh non ! </span> <br/> La recherche ne donne rien...</h5>
                  </div>*/
            }

        </div>
    )
}

export default ResultSearchBar;