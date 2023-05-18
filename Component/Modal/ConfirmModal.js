import styles from '../../styles/Component/Modal/ConfirmModal.module.scss';
import anim from '../../styles/utils/anim.module.scss';
import {CheckBadgeIcon, XCircleIcon, XMarkIcon} from "@heroicons/react/24/outline";


export const ConfirmModal = ({close,title, btnConfirm, subTitle, img, confirm}) => {

    return (
        <div className={styles.container}>
            <div className={styles.containerContent + ' ' + anim.scaleInModal}>
                <XMarkIcon onClick={close} className={styles.close}/>
                <div className={styles.headerModal}>
                    <h5>{title}</h5>
                            <p>{subTitle}</p>
                    {
                        img &&
                        <img src={img}/>
                    }
                    <div className={styles.containerBtn}>
                        <button onClick={close}>Annuler</button>
                        <button onClick={confirm} className={styles.red}>{btnConfirm}</button>
                    </div>
                </div>

            </div>
        </div>
    )
}

export const ConfirmModalDeleteAccountCustomProvider = ({close,title, btnConfirm, subTitle,confirm}) => {

    return (
        <div className={styles.containerDeleteAccountCustomProvider}>
            <div className={styles.containerContent + ' ' + anim.scaleInModal}>
                <XMarkIcon onClick={close} className={styles.close}/>
                <div className={styles.headerModal}>
                    <h5>{title}</h5>
                    <p>{subTitle}</p>

                    <div className={styles.containerBtn}>
                        <button onClick={close}>Annuler</button>
                        <button onClick={confirm} className={styles.red}>{btnConfirm}</button>
                    </div>
                </div>

            </div>
        </div>
    )
}


export const ConfirmModalCommentary = ({close,title, btnConfirm, subTitle, img, confirm}) => {

    return (
        <div className={styles.containerCommentary}>
            <div className={styles.containerContent + ' ' + anim.fadeIn}>
                <div className={styles.headerModal}>
                    <h5>{title}</h5>
                    <p>{subTitle}</p>
                    {
                        img &&
                        <img src={img}/>
                    }
                    <div className={styles.containerBtn}>
                        <button onClick={close}>Annuler</button>
                        <button onClick={confirm} className={styles.red}>{btnConfirm}</button>
                    </div>
                </div>

            </div>
        </div>
    )
}


