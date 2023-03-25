import styles from '../../styles/Component/Modal/ErrModal.module.scss';
import anim from '../../styles/utils/anim.module.scss';
import {CheckBadgeIcon, XCircleIcon, XMarkIcon} from "@heroicons/react/24/outline";
import {signOut, useSession} from "next-auth/react";
import {useEffect, useState} from "react";
import {DeleteAccountService} from "../../service/User/Account.service";

export const ErrModal = ({close}) => {
    const {data: session} = useSession();

    return (
        <div className={styles.container}>
            <div className={styles.containerContent + ' ' + anim.scaleInModal}>
                <XMarkIcon onClick={close} className={styles.close}/>
                <div className={styles.headerModal}>
                    <h5>Êtes-vous sûr de vouloir nous quitter ? </h5>

                </div>

            </div>
        </div>
    )
}