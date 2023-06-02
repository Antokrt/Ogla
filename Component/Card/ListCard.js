import styles from '../../styles/Component/Card/List.module.scss';
import {CardBookPublic} from "./CardBook";
import React, {useRef} from "react";
import {HorizontalCard} from "./HorizontalCard";
import { useEffect } from 'react';

export const ListCard = ({books,seeMore}) => {
    return (
        <div className={styles.container}>
            <div className={styles.list}>
                {
                    books &&
                    books.map((item) => {
                        return(
                            <div key={item._id}>
                                <HorizontalCard
                                    title={item.title}
                                    category={item.category}
                                    author={item.author_pseudo}
                                    snippet={item.summary}
                                    id={item._id}
                                    nbChapters={item.nbChapters}
                                    like={item.likes}
                                    img={item.img}
                                    slug={item.slug}
                                />
                            </div>

                        )
                    })
                }
            </div>
        </div>
    )
}