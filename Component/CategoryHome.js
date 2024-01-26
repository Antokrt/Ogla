import styles from '../styles/Component/Category/CategoryHome.module.scss';
import {ArrowSmallLeftIcon, ArrowSmallRightIcon, ChevronDoubleRightIcon} from "@heroicons/react/24/outline";
import CategoryCard from "./Category/CategoryCard";
import {useSelector} from "react-redux";
import Link from "next/link";

const CategoryHome = () => {
return (
    <div className={styles.container}>
        <div className={styles.parent}>
            <div className={styles.header}>
                <h4>Catégories populaires</h4>
                <div>
                    <Link href={'/bibliotheque'}>Tout voir</Link>
                </div>
            </div>
            <div className={styles.listContainer}>

                <CategoryCard title={'Action'} category={'action'}/>
                <CategoryCard title={'Horreur'} category={'horror'}/>
                <CategoryCard title={'Romance'} category={'romance'}/>
                <CategoryCard title={'Fantaisie'} category={'fantaisie'}/>
                <CategoryCard title={'Science Fiction'} category={'sf1'}/>
            </div>
        </div>



    </div>
)
}

export default CategoryHome;