import styles from '../../styles/Component/Modal/ConfirmModal.module.scss';
import anim from '../../styles/utils/anim.module.scss';
import {XMarkIcon} from "@heroicons/react/24/outline";
import {LoaderCommentary} from "../layouts/Loader";
import { useSelector } from 'react-redux';
import { selectTheme } from '../../store/slices/themeSlice';


export const ConfirmModal = ({close,title, btnConfirm, subTitle, img, confirm}) => {

    const theme = useSelector(selectTheme);

    return (
        <div className={theme ? styles.container : styles.container + ' ' + styles.dark}>
            <div className={styles.containerContent + ' ' + anim.scaleInModal}>
                <XMarkIcon onClick={close} className={styles.close}/>
                <div className={styles.headerModal}>
                    <h5>{title}</h5>
                            <p>{subTitle}</p>
                    {
                        img &&
                        <img alt={'Image Ogla'} src={img}/>
                    }
                    <div className={styles.containerBtn}>
                        <button onClick={close} className={styles.black}>Annuler</button>
                        <button onClick={confirm} className={styles.red}>{btnConfirm}</button>
                    </div>
                </div>

            </div>
        </div>
    )
}


export const ConfirmModalDeleteAccountCustomProvider = ({close,title, btnConfirm, subTitle,confirm, err}) => {

    return (
        <div className={styles.containerDeleteAccountCustomProvider}>
            <div className={styles.containerContent + ' ' + anim.scaleInModal}>
                <XMarkIcon onClick={close} className={styles.close}/>
                <div className={styles.headerModal}>
                    <h5>{title}</h5>
                    <p>{subTitle}</p>
                    {
                        err &&
                        <p className={styles.errMsgDelete + ' '+ anim.fadeIn}>Impossible de supprimer le compte</p>
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


export const ConfirmModalCommentary = ({close,title, btnConfirm, subTitle, img, confirm,loading}) => {

    return (
        <div className={styles.containerCommentary}>
            <div className={styles.containerContent + ' ' + anim.fadeIn}>
                {
                    !loading ?
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
                        :
                        <LoaderCommentary/>
                }

            </div>
        </div>
    )
}


