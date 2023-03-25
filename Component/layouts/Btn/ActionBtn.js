import styles from '../../../styles/Layouts/Btn/ActionBtn.module.scss';
import {ArrowDownIcon, ArrowsUpDownIcon, CheckIcon, XMarkIcon} from "@heroicons/react/24/outline";
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
    return (
        <>
            {
                filter === 'recent' ?
                    <button onClick={onclick} className={styles.filter}>
                        Récent(s)
                        <ArrowsUpDownIcon/>
                    </button> :
                    <button onClick={onclick} className={styles.filter}>
                        Plus ancien(s)
                        <ArrowsUpDownIcon/>
                    </button>
            }
        </>

    )
}

export const FilterBtn3 = ({filter, onclick}) => {
    return (
        <>
            {
                filter === 'recent' ?
                    <button onClick={onclick} className={styles.filter}>
                        Récent(s)
                        <ArrowsUpDownIcon/>
                    </button> :
                    <button onClick={onclick} className={styles.filter}>
                        Populaire(s)
                        <ArrowsUpDownIcon/>
                    </button>
            }
        </>

    )
}

export const SeeMoreBtn = ({onclick}) => {
    return (

        <div className={styles.seeMore}>
            <button onClick={onclick}><ArrowDownIcon/></button>
        </div>

    )
}

export const TextSeeMore = ({onclick})=> {
    return <button className={styles.seeMoreText} onClick={onclick}>Voir plus</button>
}