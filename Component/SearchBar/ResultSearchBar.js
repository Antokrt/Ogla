import styles from "../../styles/SearchBar/SearchBarResult.module.scss";
import anim from '../../styles/utils/anim.module.scss';
import React, { useEffect, useRef } from "react";
import { HeartIcon, TagIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { selectTheme } from "../../store/slices/themeSlice";
import { Capitalize, MinimizeStr, ReduceString } from "../../utils/String";
import { FormatCount } from "../../utils/NbUtils";
import { GetDefaultUserImgWhenError } from "../../utils/ImageUtils";

const ResultSearchBar = ({ destroy, query, data }) => {
    const router = useRouter();
    const light = useSelector(selectTheme);
    const divRefs = useRef([]);
    const focusedIndexRef = useRef(0);

    useEffect(() => {
        divRefs.current = divRefs.current.slice(0, data.books.length + data.authors.length);
    }, [data.books.length, data.authors.length]);

    const handleDivClick = (index, item) => {
        router.push({
            pathname: '/livre/' + item._id,
            query: item.slug
        });
    };

    const handleKeyDown = (event) => {
        if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
            event.preventDefault();
            const divCount = divRefs.current.length;
            if (divCount > 0) {
                let newIndex;
                if (event.key === 'ArrowUp') {
                    newIndex = (focusedIndexRef.current - 1 + divCount) % divCount;
                } else if (event.key === 'ArrowDown') {
                    newIndex = (focusedIndexRef.current + 1) % divCount;
                }
                divRefs.current[newIndex].focus();
                focusedIndexRef.current = newIndex;
            }
        }
    };

    return (
        <div className={light ? styles.resultContainer : styles.blackResultContainer}>
            {data && (
                <>
                    {data.books.length > 0 && (
                        <>
                            <div className={styles.titleHeader}>
                                <h5>Livres ({data.books.length})</h5>
                            </div>
                            {data.books.map((item, index) => (
                                <div
                                    ref={ref => (divRefs.current[index] = ref)}
                                    key={item._id}
                                    onClick={() => handleDivClick(index, item)}
                                    className={styles.itemResult + ' ' + anim.fadeIn}
                                    tabIndex={0} // Assurez-vous que la div est focusable en définissant le tabIndex
                                    onKeyDown={handleKeyDown} // Gestionnaire d'événement pour les touches du clavier
                                >
                                    <p className={styles.title}>{ReduceString(item.title, 52)} </p>
                                    <div className={styles.subContainer}>
                                        <p className={styles.category}>{item.category}</p>
                                        <p className={styles.likes}>{FormatCount(item.likes)} <HeartIcon/></p>
                                    </div>
                                </div>
                            ))}
                        </>
                    )}

                    {data.authors.length > 0 && (
                        <>
                            <div className={styles.titleHeader}>
                                <h5>Auteurs ({data.authors.length})</h5>
                            </div>
                            {data.authors.map((item, index) => (
                                <div
                                    ref={ref => (divRefs.current[data.books.length + index] = ref)}
                                    key={item._id}
                                    onClick={() => {
                                        router.push({
                                            pathname: '/auteur/' + item.pseudo,
                                        });
                                    }}
                                    className={styles.itemResult + ' ' + styles.itemAuthor + ' ' + anim.fadeIn}
                                    tabIndex={0} // Assurez-vous que la div est focusable en définissant le tabIndex
                                    onKeyDown={handleKeyDown} // Gestionnaire d'événement pour les touches du clavier
                                >
                                    <p className={styles.title + ' ' + styles.author}><img referrerPolicy={'no-referrer'} onError={(e) => {
                                        e.target.src = GetDefaultUserImgWhenError();
                                    }} src={item.img}/>
                                        <span>{ReduceString(Capitalize(item.pseudo),40)} </span>
                                    </p>
                                    <div className={styles.subContainer}>
                                        <p></p>
                                        <p className={styles.likes}>{FormatCount(item.author.likes)} <HeartIcon/></p>
                                    </div>
                                </div>
                            ))}
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default ResultSearchBar;