import React from "react";
import styles from "../../styles/Component/Category/CategoryHeader.module.scss";
import Link from "next/link";
import {Capitalize} from "../../utils/String";
import {useRouter} from "next/router";
import {GetCategory} from "../../utils/CategoryUtils";
const CategoryHeader = () => {

    const router = useRouter();
    const {
        query: {cat},
    } = router


    return (
        <div className={styles.container}>
            {
                GetCategory().map((item)=>{
                    return  (
                        <div
                     onClick={() => {
                         router.push('/cat/' + item)
                     }}
                            key={item}
                            className={Capitalize(cat) === item ? styles.active +" " + styles.book : styles.book}>
                            <img src="/assets/book_pixel.png"

                         />
                        <p>{item}</p>
                        </div>
                    )
                })
            }

        </div>
    )
}


export default CategoryHeader;