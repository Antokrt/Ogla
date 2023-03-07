import styles from '../../../styles/Layouts/Btn/ActionBtn.module.scss';
import {CheckIcon, XMarkIcon} from "@heroicons/react/24/outline";

export const CloseBtn = () => {
    return (
        <div className={styles.close}>
            <XMarkIcon/>
        </div>
    )
}

export const CheckBtn = () => {
    return (
        <div className={styles.check}>
            <CheckIcon/>
        </div>
    )
}