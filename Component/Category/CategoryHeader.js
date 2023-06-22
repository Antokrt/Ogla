import React, {useEffect} from "react";
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
    const theme = useSelector(selectTheme);
    const categories = useSelector(selectCategories);

    const cat = router.query.id;

    return (
        <div className={theme? styles.container : styles.darkContainer}>
            {
                categories.map((item,index)=>{
                    return  (
                        <div
                     onClick={() => {
                         router.push('/bibliotheque/' + item.name.toLowerCase());
                     }}
                            key={item._id}
                            className={cat && cat.toLowerCase() === item.name.toLowerCase() ? styles.active +" " + styles.book : styles.book}>
                            <img src={"/assets/category/icons/"+ item.name.toLowerCase() + '.svg'}/>
                        <p>{item.name}</p>
                        </div>
                    )
                })
            }

        </div>
    )
}


export default CategoryHeader;