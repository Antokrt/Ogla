import {useSelector} from 'react-redux';
import styles from '../../styles/Component/Category/BannerCategory.module.scss';
import {selectTheme} from '../../store/slices/themeSlice';
import anim from '../../styles/utils/anim.module.scss';
import {GetImgPathOfAssets} from "../../utils/ImageUtils";

export const BannerCategory = ({category, presentation}) => {
    const theme = useSelector(selectTheme);

    return (
        <div className={theme ? styles.container + ' ' + anim.fadeIn : styles.container + ' ' + anim.fadeIn + ' ' + styles.darkContainer}>
            <div className={styles.content}>
                {
                    category.toLowerCase() === 'science-fiction' ?
                        <h4 data-after={'Science F'}>Science Fiction</h4> :
                        <h4 data-after={category}>{category}</h4>
                }
                <p>{presentation}</p>
            </div>
            {
                category.toLowerCase() === 'humour' ?
                    <img alt={'Image Ogla Humour'} onError={(e) => e.target.src = '/assets/category/banner/comedy.png'}
                         className={styles.image}
                         src={GetImgPathOfAssets() + 'category/banner/comedy.png'}/>
                    :
                    category.toLowerCase() === 'science-fiction' ?
                        <img onError={(e) => e.target.src = '/assets/category/banner/sf.png'} className={styles.image}
                             src={GetImgPathOfAssets() + 'category/banner/sf.png'} alt={'Image Ogla Sf'}/>
                        :
                        <img className={styles.image} alt={'Image Catégorie Ogla'}
                             onError={(e) => e.target.src = '/assets/category/banner/'+ category.toLowerCase() + '.png'}
                             src={GetImgPathOfAssets() + 'category/banner/' + category.toLowerCase() + '.png'}/>
            }
        </div>
    )
}