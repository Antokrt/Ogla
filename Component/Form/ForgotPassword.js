import styles from "../../styles/Pages/Form/ResetPassword.module.scss"
import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { SendResetPasswordEmailService } from "../../service/User/Password.service";
import { toastDisplayPromiseSendMail } from "../../utils/Toastify";
import { useRouter } from "next/router";
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

    const sendEmail = () => { }

    return (
        <div className={styles.formContainer}>
            <div className={styles.leftBlock}>
                <div className={styles.container}>

                    <div className={styles.header}>
                        {
                            !hasSendEmail ?
                                <>
                                    <img src="/assets/bookOrange2.png" />
                                    <h1>Mot de passe oublié? </h1>
                                    <p> Si tu as oublié ton mot de passe, entre ton email pour recevoir un mail de réinitialisation.
                                    </p>
                                </> :
                                <>
                                    <img src="/assets/bookOrange2.png" />
                                    <h1>Email envoyé ! </h1>
                                    <p> Nous t'avons envoyé un mail contenant un lien pour réinitialiser ton mot de passe, ce lien sera valide durant 30 minutes.
                                    </p>
                                </>
                        }
                    </div>
                    {
                        !hasSendEmail ?
                            <form onSubmit={handleSubmit} ref={formRef} className={styles.form}>
                                <div className={styles.selectItem + " " + "fadeIn"}>
                                    <label htmlFor={"email"}> Email
                                        <span>
                                            <svg viewBox="-16 0 512 512"><path d="M471.99 334.43L336.06 256l135.93-78.43c7.66-4.42 10.28-14.2 5.86-21.86l-32.02-55.43c-4.42-7.65-14.21-10.28-21.87-5.86l-135.93 78.43V16c0-8.84-7.17-16-16.01-16h-64.04c-8.84 0-16.01 7.16-16.01 16v156.86L56.04 94.43c-7.66-4.42-17.45-1.79-21.87 5.86L2.15 155.71c-4.42 7.65-1.8 17.44 5.86 21.86L143.94 256 8.01 334.43c-7.66 4.42-10.28 14.21-5.86 21.86l32.02 55.43c4.42 7.65 14.21 10.27 21.87 5.86l135.93-78.43V496c0 8.84 7.17 16 16.01 16h64.04c8.84 0 16.01-7.16 16.01-16V339.14l135.93 78.43c7.66 4.42 17.45 1.8 21.87-5.86l32.02-55.43c4.42-7.65 1.8-17.43-5.86-21.85z" /></svg>
                                        </span>
                                    </label>
                                    <input onChange={(e) => setEmail(e.target.value)} required={true} type={"email"} name={"email"} placeholder={"Email"}></input>

                                </div>
                                {
                                    submitErr.show &&
                                    <p className={styles.submitErr + ' ' + styles.fadeIn}>{submitErr.msg}</p>
                                }

                                <div className={styles.stepBtnContainer}>
                                    <button type={'submit'} className={styles.stepBtn}>Envoyer</button>
                                </div>
                                <div className={styles.otherOption}>
                                    <div className={styles.trait}> </div>
                                    <h3> Un oubli est si vite arrivé </h3>
                                </div>
                                <div className={styles.conditions} onClick={login}>
                                    <p> Retour à la connexion </p>
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
                                        <p className={styles.reSend}> Renvoyer le mail </p>
                                    </div>
                                    <div className={styles.otherOption}>
                                        <div className={styles.trait}> </div>
                                        <h3> Bonne lecture sur Ogla </h3>
                                    </div>
                                    <div className={styles.homeBtn} onClick={() => router.push("/")}>
                                        <p> Retour à l'accueil </p>
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