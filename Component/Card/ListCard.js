import styles from '../../styles/Component/Card/List.module.scss';
import {CardBookPublic} from "./CardBook";
import React from "react";
import {HorizontalCard} from "./HorizontalCard";

export const ListCard = ({books}) => {
    return (
        <div className={styles.container}>
            {
                books &&
                books.map((item) => {
                    return(
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
                    )
                })
            }
        </div>
    )
}