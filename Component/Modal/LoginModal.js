import styles from '../../styles/Component/Modal/LoginModal.module.scss';
import anim from '../../styles/utils/anim.module.scss';
import {CheckBadgeIcon, XCircleIcon, XMarkIcon} from "@heroicons/react/24/outline";
import {signIn, signOut, useSession} from "next-auth/react";
import {useEffect, useState} from "react";
import {DeleteAccountService} from "../../service/User/Account.service";
import {GoogleLoginBtn} from "../layouts/Btn/Link";
import {useRouter} from "next/router";
import {useDispatch} from "react-redux";
import {setActiveModalState} from "../../store/slices/modalSlice";

export const LoginModal = ({close}) => {
    const {data: session} = useSession();
    const [errMsg, setErrMsg] = useState({
        msg: '',
        show: false
    });
    const [password, setPassword] = useState('');
    const [pseudo, setPseudo] = useState('');
    const dispatch = useDispatch()
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password.length > 3) {

            const response = await signIn('login', {
                pseudo: pseudo,
                password: password,
                callbackUrl: '',
                redirect: false
            })
                .then((res) => {
                    if (res?.status === 401) {
                        setErrMsg(prevState => ({
                            msg: 'Identifiant ou mot de passe incorrect',
                            show: true
                        }))
                    } else {
                        close();
                        router.reload();
                    }
                })
        } else {
            return null;
        }
    }


    return (
        !session ?
            <div className={styles.container} onKeyPress={(event) => {
                if (event.key === 'Enter') {
                    handleSubmit(event);
                }
            }}>
                <div className={styles.containerContent + ' ' + anim.scaleInModal}>
                    <XMarkIcon onClick={close} className={styles.close}/>
                    <div className={styles.headerModal}>
                        <img src={'assets/chara/chara1.png'}/>
                        <h5>Connexion</h5>
                        <p>Connectez vous pour accéder à toutes les fonctionnalités d'Ogla !</p>
                    </div>

                    <div className={styles.google}>
                        <GoogleLoginBtn/>
                    </div>

                    <div className={styles.or}>
                        <div></div>
                        <p>ou</p>
                        <div></div>
                    </div>

                    <div className={styles.form}>
                        <label>Pseudo</label>
                        <input value={pseudo} onChange={(e) => setPseudo(e.target.value)} type={"text"}
                               placeholder={'Pseudo'}/>
                        <label>Modifier votre mot de passe</label>
                        <input value={password} onChange={(e) => setPassword(e.target.value)} type={"password"}
                               placeholder={'Mot de passe'}/>
                        <div className={styles.btn}>
                            <p className={styles.register} onClick={() => router.push({
                                pathname: "/auth",
                                query: "register"
                            }).then(() => dispatch(setActiveModalState(false))).catch(() => dispatch(setActiveModalState(false)))}>Pas encore inscrit?</p>
                            <p className={styles.register} onClick={() => router.push({
                                pathname: "/auth",
                                query: "forgotPassword"
                            }).then(() => dispatch(setActiveModalState(false))).catch(() => dispatch(setActiveModalState(false)))}>Mot de passe oublié ?</p>
                        </div>

                    </div>

                    {
                        errMsg.show &&
                        <p className={styles.errMsg}>{errMsg.msg}</p>
                    }

                    <button className={styles.loginBtn} onClick={(event) => handleSubmit(event)}>Se connecter
                    </button>

                </div>
            </div>
            :
            null
    )
}