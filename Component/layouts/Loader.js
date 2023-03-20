import styles from '../../styles/Layouts/Loader.module.scss';

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