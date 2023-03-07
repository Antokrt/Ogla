import styles from '../../styles/Layouts/Text.module.scss';

export const TitleComponent = ({title}) => {
    return (
        <h5 className={styles.title}>{title}</h5>
    )
}

export const AuthorComponent = ({pseudo}) => {
    return (
        <p className={styles.pseudo}>{pseudo}</p>
    )
}

export const BookTitle = ({title}) => {
    return(
        <h5 className={styles.bookTitle}>{title}</h5>
    )
}