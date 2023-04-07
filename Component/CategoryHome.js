import styles from '../styles/Component/Category/CategoryHome.module.scss';
import {ArrowSmallLeftIcon, ArrowSmallRightIcon} from "@heroicons/react/24/outline";
import CategoryCard from "./Category/CategoryCard";

const CategoryHome = () => {
return (
    <div className={styles.container}>
        <div className={styles.parent}>
            <div className={styles.header}>
                <h4>Catégories populaires :</h4>
                <div>
                    <ArrowSmallLeftIcon/>
                    <ArrowSmallRightIcon/>
                </div>
            </div>
            <div className={styles.listContainer}>
                <CategoryCard title={'Action'} category={'action'}/>
                <CategoryCard title={'Horreur'} category={'horror'}/>
                <CategoryCard title={'Drama'} category={'drama'}/>
                <CategoryCard title={'Fantaisie'} category={'fantaisie'}/>

                <CategoryCard title={'Science Fiction'} category={'sf1'}/>
            </div>
        </div>



    </div>
)
}

export default CategoryHome;