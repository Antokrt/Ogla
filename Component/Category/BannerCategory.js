import { useSelector } from 'react-redux';
import styles from '../../styles/Component/Category/BannerCategory.module.scss';
import { selectTheme } from '../../store/slices/themeSlice';
import anim from '../../styles/utils/anim.module.scss';
export const BannerCategory = ({category,presentation}) => {
    const theme = useSelector(selectTheme);

    return (
        <div className={theme? styles.container + ' ' + anim.fadeIn  : styles.darkContainer}>
            <div className={styles.content}>
                {
                    category === 'Sf' ?
                        <h4 data-after={'Science-Fiction'}>SF</h4> :
                        <h4 data-after={category}>{category}</h4>
                }
                <p>{presentation}</p>

            </div>
            {
                category === 'Comédie' ?
                    <img className={styles.image} src={'/assets/category/banner/comedy.png'}/>
:
                    <img className={styles.image} src={'/assets/category/banner/'+  category+ '.png'}/>

            }
        </div>
    )
}