import styles from '../../../styles/Component/Backup.module.scss';
import {ArrowUturnUpIcon} from "@heroicons/react/24/outline";

export const BackUp = ({click}) => {
return (
    <div onClick={click} className={styles.container}>
        <ArrowUturnUpIcon/>
    </div>
)
}