import styles from '../../styles/Component/Card/List.module.scss';
import {CardBookPublic} from "./CardBook";
import React, {useRef} from "react";
import {HorizontalCard} from "./HorizontalCard";
import { useEffect,Fragment } from 'react';

export const ListCard = ({books,seeMore,topId}) => {
    return (
        <div className={styles.container}>
            <div className={styles.list}>
                {
                    books &&
                    books.map((item) => {
                        return(
                            <Fragment key={item._id}>
                                    <HorizontalCard
                                        top={topId === item._id && item.likes > 0}
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
                            </Fragment>


                        )
                    })
                }
            </div>
        </div>
    )
}