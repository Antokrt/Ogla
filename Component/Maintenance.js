import styles from '../styles/Component/Maintenance.module.scss';
import Image from "next/image";

export const Maintenance = () => {
    return (
        <div className={styles.container}>
            <Image width={300} height={300}  src={'/assets/diapo/old.png'}/>
            <p>Ogla est en cours de maintenance. <br/> Revenez bientôt !</p>
        </div>
    )
}