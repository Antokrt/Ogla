import styles from "../../styles/Pages/Form/ResetPassword.module.scss"
import { useSession, signIn, signOut } from "next-auth/react";
import React, { useEffect, useRef, useState } from "react";
import { SendResetPasswordEmailService } from "../../service/User/Password.service";
import { toastDisplayPromiseSendMail } from "../../utils/Toastify";
import {router, useRouter} from "next/router";
import ScreenSize from "../../utils/Size";

const ForgotPassword = ({ login }) => {

    const { data: session, status } = useSession();
    const formRef = useRef(null);
    const [hasSendEmail, setHasSendEmail] = useState(false);
    const [email, setEmail] = useState('');
    const [errMsg, setErrMsg] = useState(false);
    const router = useRouter();
    const [width, height] = ScreenSize();

    const [submitErr, setSubmitErr] = useState({
        msg: "",
        show: false
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (email !== '') {
            toastDisplayPromiseSendMail(SendResetPasswordEmailService(email)
                .then((res) => setHasSendEmail(true))
                .catch((err) => setHasSendEmail(true))
            )
        }
    }


    return (
        <div className={styles.formContainer}>
            <div className={styles.imgAbs} onClick={() => router.push("/")}>
                <img src="/assets/bookOrange2.png" />
            </div>
            <div className={styles.leftBlock}>
                <div className={styles.container}>
                    <div className={styles.header}>
                        {
                            !hasSendEmail ?
                                <>
                                    <h1>Mot de passe oublié <span>?</span></h1>
                                    <p> Si tu as oublié ton mot de passe, entre ton email pour recevoir un lien de réinitialisation.
                                    </p>
                                </> :
                                <>
                                    <h1>Email envoyé ! </h1>
                                    <p> Si cette adresse email existe, nous t&apos;avons envoyé un mail contenant un lien pour réinitialiser ton mot de passe, ce lien sera valide durant 30 minutes.
                                    </p>
                                </>
                        }
                    </div>
                    {
                        !hasSendEmail ?
                            <form onSubmit={handleSubmit} ref={formRef} className={styles.form}>
                                <div className={styles.inputContainer + " " + "fadeIn"}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                        <path d="M21 3C21.5523 3 22 3.44772 22 4V20.0066C22 20.5552 21.5447 21 21.0082 21H2.9918C2.44405 21 2 20.5551 2 20.0066V19H20V7.3L12 14.5L2 5.5V4C2 3.44772 2.44772 3 3 3H21ZM8 15V17H0V15H8ZM5 10V12H0V10H5ZM19.5659 5H4.43414L12 11.8093L19.5659 5Z"></path>
                                    </svg>
                                    <input className={styles.inputEmail} onChange={(e) => setEmail(e.target.value)} required={true} type="email" name="email" placeholder=" "></input>
                                    <label htmlFor={"email"} className={styles.labelEmail}>
                                        Email
                                    </label>
                                </div>
                                {
                                    submitErr.show &&
                                    <p className={styles.submitErr + ' ' + styles.fadeIn}>{submitErr.msg}</p>
                                }
                                <div className={styles.conditions} onClick={login}>
                                    <p> Se connecter </p>
                                </div>
                                <div className={styles.stepBtnContainer}>
                                    <button type={'submit'} className={styles.stepBtn}>Envoyer</button>
                                </div>
                            </form>
                            :
                            <>
                                <div>
                                    <div className={styles.stepBtnContainer + ' ' + styles.notReceiveContainer} onClick={() => {
                                        if (email !== '') {
                                            toastDisplayPromiseSendMail(SendResetPasswordEmailService(email)
                                                .then((res) => { console.log(res) })
                                                .catch((err) => console.log(err))
                                            )
                                        }
                                    }}>
                                        <p className={styles.notReceive}> Rien reçus ? </p>
                                        <p className={styles.reSend}> Renvoyer l&apos;email </p>
                                    </div>
                                    <div className={styles.otherOption}>
                                        <div className={styles.trait}> </div>
                                        <h3> Bonne lecture sur Ogla </h3>
                                    </div>
                                    <div className={styles.homeBtn} onClick={() => login()}>
                                        <p> Se connecter </p>
                                    </div>
                                </div>
                            </>
                    }
                </div>

            </div>
            {
                width > 1000 &&
                <div className={styles.containerImg}>
                    <img src={"/assets/diapo/knight.png"} />
                </div>
            }
        </div>
    )

}

export default ForgotPassword;