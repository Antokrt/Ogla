import styles from '../../styles/Component/Modal/DeleteAccountModal.module.scss';
import anim from '../../styles/utils/anim.module.scss';
import {CheckBadgeIcon, XCircleIcon, XMarkIcon} from "@heroicons/react/24/outline";
import {signOut, useSession} from "next-auth/react";
import {useEffect, useState} from "react";
import {DeleteAccountService} from "../../service/User/Account.service";
import {ConfirmModal, ConfirmModalDeleteAccountCustomProvider} from "./ConfirmModal";

export const DeleteAccountModal = ({close}) => {
    const {data: session} = useSession();

    const [password, setPassword] = useState('');
    const [errMsg, setErrMsg] = useState({
        msg: '',
        show: false
    })
    const deleteAccount = (password) => {
        DeleteAccountService(session.user.email, password)
            .then((res) => signOut())
            .catch((err) => {
                const statusCode = err.response.data.statusCode;
                if (statusCode === 401) {
                    setErrMsg({msg: 'Mot de passe incorrect', show: true});
                } else {
                    setErrMsg({msg: 'Impossible de supprimer le compte', show: true});
                }
            })
    }

    if(session.user.provider === 'ogla'){
        return (
            <div className={styles.container}>
                <div className={styles.containerContent + ' ' + anim.scaleInModal}>
                    <XMarkIcon onClick={close} className={styles.close}/>
                    <div className={styles.headerModal}>
                        <h5>Êtes-vous sûr de vouloir nous quitter ? </h5>
                        {
                            session.user.is_author ?
                                <p>Attention ! Tous vos livres seront supprimés et ne pourront être récupérés.</p>
                                :
                                <p>Vous allez beaucoup nous manquer ! </p>
                        }
                    </div>

                    <div className={styles.form}>

                                <>
                                    <img src={'assets/jim/angry4.png'}/>
                                    <label>Mot de passe</label>
                                    <input value={password} onChange={(e) => setPassword(e.target.value)} type={"password"}
                                           placeholder={'Mot de passe'}/>
                                </>

                        {
                            errMsg.show &&
                            <p className={styles.errMsg}>{errMsg.msg}</p>
                        }

                                <button
                                    className={password.length > 3 ? styles.deleteBtn + ' ' + styles.active : styles.deleteBtn + ' ' + styles.disabled}
                                    onClick={() => {
                                        if (password.length > 3){ deleteAccount(password) }
                                    }}>Supprimer mon compte</button>


                    </div>


                </div>
            </div>
        )
    }
    else {
        return (
            <ConfirmModalDeleteAccountCustomProvider img={'/assets/google.png'} confirm={'Supprimer'} close={close} btnConfirm={'Supprimer mon compte'} title={'Êtes-vous sûr de vouloir nous quitter ?'} subTitle={
                session.user.is_author ?
                    <p>Attention ! Tous vos livres seront supprimés et ne pourront être récupérés.</p>
                    :
                    <p>Vous allez beaucoup nous manquer ! </p>
            }/>
        )
    }

}