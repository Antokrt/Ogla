import styles from '../../../styles/Layouts/Btn/ActionBtn.module.scss';
import {ArrowsUpDownIcon, CheckIcon, XMarkIcon} from "@heroicons/react/24/outline";
import {useState} from "react";

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

export const FilterBtn = ({filter, onclick}) => {
    const [label, setLabel] = useState('filter');
    return (
        <>
            {
                filter === 'recent' ?
                    <button onClick={onclick} className={styles.filter}>
                        Récent
                        <ArrowsUpDownIcon/>
                    </button> :
                    <button onClick={onclick} className={styles.filter}>
                        Ordre
                        <ArrowsUpDownIcon/>
                    </button>
            }
        </>

    )
}