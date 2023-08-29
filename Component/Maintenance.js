import styles from '../styles/Component/Maintenance.module.scss';

export const Maintenance = () => {
    return (
        <div className={styles.container}>
            <img src={'/assets/diapo/old.png'}/>
            <p>Ogla est en cours de maintenance. <br/> Revenez bientôt !</p>
        </div>
    )
}