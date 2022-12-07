import React from "react";
import styles from "../../styles/Component/Category/CategoryHeader.module.scss";
import Category from "../../json/category.json";
import Link from "next/link";
import {Capitalize} from "../../utils/String";
import {useRouter} from "next/router";
const CategoryHeader = () => {

    const router = useRouter();
    const {
        query: {cat},
    } = router


    return (
        <div className={styles.container}>
            {
                Category.category.map((item)=>{
                    return  (
                        <div
                            onClick={()=>{
                                router.push({
                                    pathName:"Category",
                                    query:{cat:item.name.toLowerCase()},
                                },
                                    undefined,
                                    {scroll:false}
                                )
                            }}
                            key={item.name}
                            className={Capitalize(cat) === item.name ? styles.active +" " + styles.book : styles.book}>
                            <img src="assets/book_pixel.png"

                         />
                        <p>{item.name}</p>
                        </div>
                    )
                })
            }

        </div>
    )
}


export default CategoryHeader;