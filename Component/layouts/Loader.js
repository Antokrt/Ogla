import { useSelector } from 'react-redux';
import styles from '../../styles/Layouts/Loader.module.scss';
import { selectTheme } from '../../store/slices/themeSlice';

export const Loader1 = () => {
    return (
        <div className={styles.loader1}>
            <div></div>
            <div></div>
            <div></div>
        </div>
    )
}

export const Loader2 = () => {
    return (
        <div className={styles.loader2}>
            <div></div>

        </div>
    )
}

export const LoaderCommentary = () => {
    return (
        <div className={styles.loaderCommentary}>
        </div>
    )
}

export const LoaderCard = () => {
    const theme = useSelector(selectTheme);
    return (
        <div className={theme? styles.loaderCardContainer : styles.darkLoaderCardContainer}>
            <div className={styles.loaderCard}> </div>
        </div>
    )
}

export const LoaderImg = () => {
    return (
        <div className={styles.loaderImg}>
        </div>
    )
}