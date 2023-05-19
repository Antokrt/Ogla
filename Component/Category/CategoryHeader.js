import React from "react";
import styles from "../../styles/Component/Category/CategoryHeader.module.scss";
import Link from "next/link";
import {Capitalize} from "../../utils/String";
import {useRouter} from "next/router";
import {GetCategory} from "../../utils/CategoryUtils";
import { useSelector } from "react-redux";
import { selectTheme } from "../../store/slices/themeSlice";
import {selectCategories} from "../../store/slices/categorySlice";
const CategoryHeader = () => {

    const router = useRouter();
    const {
        query: {cat},
    } = router
    const theme = useSelector(selectTheme);
    const categories = useSelector(selectCategories);

    return (
        <div className={theme? styles.container : styles.darkContainer}>
            {
                categories.map((item)=>{
                    return  (
                        <div
                     onClick={() => {
                         router.push('/cat/' + item.name.toLowerCase())
                     }}
                            key={item}
                            className={Capitalize(cat) === item ? styles.active +" " + styles.book : styles.book}>
                            <img src="/assets/category/icons/drama.svg"/>
                        <p>{item.name}</p>
                        </div>
                    )
                })
            }

        </div>
    )
}


export default CategoryHeader;