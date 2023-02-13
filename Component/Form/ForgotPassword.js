import styles from "../../styles/Pages/Form/Login.module.scss";
import {useSession, signIn, signOut} from "next-auth/react";
import {useEffect, useRef, useState} from "react";
import {SendResetPasswordEmailService} from "../../service/User/Password.service";


const ForgotPassword = ({login}) => {

    const {data: session, status} = useSession();
    const formRef = useRef(null);
    const  [hasSendEmail, setHasSendEmail] = useState(false);
    const [email,setEmail] = useState('');
    const [errMsg,setErrMsg] = useState(false);

    const [submitErr, setSubmitErr] = useState({
        msg: "",
        show: false
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if(email !== ''){
            SendResetPasswordEmailService(email)
                .then((res) => setHasSendEmail(true))
                .catch((err) => setHasSendEmail(true));
        }
    }

    const sendEmail = () => {}

    return (
        <div className={styles.formContainer}>

            <div className={styles.header}>
                {
                    !hasSendEmail ?
                        <>
                            <h1>Mot de passe oublié? </h1>
                            <p> Ogla est une plateforme d’écriture et de lecture de livres, d’histoires ou de romans ouverte à
                                tous. Nous voulons que vous vous assuriez que personne ne puisse jamais vous empêcher d’écrire
                                votre histoire parce que nous croyons au pouvoir des mots.
                            </p>
                        </> :
                        <>
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
                        <label htmlFor={"email"}>Email</label>
                        <input onChange={(e) => setEmail(e.target.value)} required={true} type={"email"} name={"email"} placeholder={"Email"}></input>
                        <div className={styles.conditions + " " + styles.resetPassword}>
                            <p onClick={login}>Se connecter</p>
                        </div>
                    </div>
                    {
                        submitErr.show &&
                        <p className={styles.submitErr + ' ' + styles.fadeIn }>{submitErr.msg}</p>
                    }

                    <div className={styles.stepBtnContainer}>
                        <button type={'submit'} className={styles.stepBtn}>Envoyer</button>
                    </div>
                </form>
                    :
                    <>
                        <div className={styles.stepBtnContainer + ' ' + styles.notReceiveContainer}>
                            <p className={styles.notReceive}>Rien reçus ?</p>
                            <p className={styles.reSend} onClick={() => {
                                if(email !== ''){
                                    SendResetPasswordEmailService(email)
                                        .then((res) => console.log(res))
                                        .catch((err) => console.log(err))

                                }
                            }}>Renvoyer le mail</p>
                        </div>
                    </>
            }
        </div>
    )

}

export default ForgotPassword;