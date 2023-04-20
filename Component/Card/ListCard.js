import styles from '../../styles/Component/Card/List.module.scss';
import {CardBookPublic} from "./CardBook";
import React, {useRef} from "react";
import {HorizontalCard} from "./HorizontalCard";

export const ListCard = ({books,seeMore}) => {
    const divRef = useRef();
    return (
        <div className={styles.container}>

            <button onClick={() => {
                divRef.current.scrollTop = divRef.current.scrollHeight;
                console.log(divRef.current.scrollTop)
            }}>Clique</button>
            <div className={styles.list} ref={divRef}>
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

        </div>
    )
}