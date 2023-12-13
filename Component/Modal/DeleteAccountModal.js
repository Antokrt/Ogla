import styles from '../../styles/Component/Modal/DeleteAccountModal.module.scss';
import anim from '../../styles/utils/anim.module.scss';
import {CheckBadgeIcon, XCircleIcon, XMarkIcon} from "@heroicons/react/24/outline";
import {signOut, useSession} from "next-auth/react";
import {useEffect, useState} from "react";
import {DeleteAccountService} from "../../service/User/Account.service";
import {ConfirmModal, ConfirmModalDeleteAccountCustomProvider} from "./ConfirmModal";
import {LoaderCommentary} from "../layouts/Loader";
import {GetImgPathOfAssets} from "../../utils/ImageUtils";
import { useSelector } from 'react-redux';
import { selectTheme } from '../../store/slices/themeSlice';

export const DeleteAccountModal = ({close}) => {
    const {data: session} = useSession();
    const [loading,setLoading] = useState(false);
    const [password, setPassword] = useState('');
    const [errMsg, setErrMsg] = useState({
        msg: '',
        show: false
    })
    const theme = useSelector(selectTheme);

    const deleteAccount = (password) => {
        setLoading(true);
        DeleteAccountService(session.user.email, password)
            .then((res) => signOut())
            .catch((err) => {
                const statusCode = err.response.data.statusCode;
                if (statusCode === 401) {
                    setPassword('');
                    setErrMsg({msg: 'Mot de passe incorrect', show: true});
                }
                else {
                    setPassword('');
                    setErrMsg({msg: 'Impossible de supprimer le compte', show: true});
                }
                setLoading(false);
            })
    }

    if(session.user.provider !== 'google'){
        return (
            <div className={theme ? styles.container : styles.container + ' ' + styles.dark}>
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
                                    {
                                        loading ?
                                            <LoaderCommentary/> :
                                            <img src={GetImgPathOfAssets()+ 'diapo/old.png'}/>
                                    }
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
            <ConfirmModalDeleteAccountCustomProvider err={errMsg.show} img={'/assets/google.png'} confirm={() => deleteAccount(process.env.NEXT_PUBLIC_GOOGLE_SECRET_DELETE)} close={close} btnConfirm={'Supprimer mon compte'} title={'Êtes-vous sûr de vouloir nous quitter ?'} subTitle={
                session.user.is_author ?
                    <p>Attention ! Tous vos livres seront supprimés et ne pourront être récupérés.</p>
                    :
                    <p>Vous allez beaucoup nous manquer ! </p>
            }/>
        )
    }

}