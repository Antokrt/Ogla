import { useSelector } from 'react-redux';
import styles from '../../styles/Component/Category/BannerCategory.module.scss';
import { selectTheme } from '../../store/slices/themeSlice';

export const BannerCategory = ({category,presentation}) => {
    const theme = useSelector(selectTheme);

    return (
        <div className={theme? styles.container : styles.darkContainer}>
            <div className={styles.content}>
                {
                    category === 'Sf' ?
                        <h4 data-after={'Science-F'}>SF</h4> :
                        <h4 data-after={category}>{category}</h4>
                }
                <p>{presentation}</p>
            </div>
            <img className={styles.image} src={'/assets/category/banner/'+  category+ '.png'}/>
        </div>
    )
}