import styles from '../../styles/Component/Sub/SubBtn.module.scss';
import {ChevronDownIcon, StarIcon, XMarkIcon} from "@heroicons/react/24/outline";
import {useState} from "react";

export const SubBtn = ({open,isOpen}) => {


    return (
        <div className={styles.container}>


            <button onClick={() => open()}>
                {
                    !isOpen ?
                    <>
                        <StarIcon/>S'abonner <ChevronDownIcon className={styles.secIcon}/>
                    </>    :
                        <>
                            <XMarkIcon className={styles.secIcon}/> Fermer
                        </>
                }
                </button>
        </div>
    )
}