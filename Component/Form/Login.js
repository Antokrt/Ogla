import styles from "../../styles/Pages/Form/Login.module.scss";
import anim from '../../styles/utils/anim.module.scss';
import { useSession, signIn, signOut } from "next-auth/react";
import React, { createRef, useEffect, useRef, useState } from "react";
import { useRouter} from "next/router";
import { GoogleLoginBtn } from "../layouts/Btn/Link";
import { ReCAPTCHA } from "react-google-recaptcha";
import ScreenSize from "../../utils/Size";
import {GetImgPathOfAssets, GetLogoUtils} from "../../utils/ImageUtils";

const Login = ({ register, forgotPassword }) => {

    const { data: session, status } = useSession();
    const formRef = useRef(null);
    const captchaRef = useRef(null);
    const [width, height] = ScreenSize();
    const router = useRouter();

    const token = async () => {
        const captchaToken = await captchaRef.current.executeAsync();
        captchaToken.current.reset();
    }

    const [submitErr, setSubmitErr] = useState({
        msg: "",
        show: false
    })

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(formRef.current);

        if (!formData.get('pseudo') || !formData.get('password')) {
            setSubmitErr({
                show: true,
                msg: "Informations manquantes !"
            })
        }

        const response = await signIn('login', {
            pseudo: formData.get('pseudo'),
            password: formData.get('password'),
            callbackUrl: '/',
            redirect: false
        })
            .then((res) => {
                if (res?.status === 401) {
                    if(res.error === 'blacklisted'){
                        setSubmitErr(prevState => ({
                            msg: "Votre compte a été  suspendu en raison d'activités inappropriées.",
                            show: true
                        }))
                    }
                    else {
                        setSubmitErr(prevState => ({
                            msg: 'Identifiant ou mot de passe incorrect.',
                            show: true
                        }))

                    }

                } else {
                   if(res?.status === 200){
                        router.push('/')
                    }
                    else {
                        setSubmitErr(prevState => ({
                            msg: 'Erreur lors de la connexion',
                            show: true
                        }))
                    }
                }
            })
            .catch((e) => console.log(e))

    }


    return (
        <div className={styles.formContainer + ' ' + anim.fadeIn}>
            <div className={styles.ctn}>
                <div className={styles.imgAbs} onClick={() => router.push("/")}>
                    <img
                        src={GetLogoUtils()}
                    alt={'Logo Ogla'}
                        onError={(e) => e.target.src = '/assets/logo/mountain.png'}
                    />
                </div>
                <div className={styles.leftBlock}>
                    <div className={styles.header}>
                        {
                            width > 230 &&
                            <h1> Bon retour parmi nous !</h1>
                        }
                        {
                            width <= 230 &&
                            <h1 className={styles.h1Connexion}> Connexion </h1>
                        }
                        <p>
                            Ogla est une plateforme d&apos;écriture et de lecture de livres, d&apos;histoires ou de romans ouverte à tous.
                            Nous voulons nous assurer que personne ne puisse jamais vous empêcher d&apos;écrire.
                        </p>
                    </div>
                    <form onSubmit={handleSubmit} ref={formRef} className={styles.form}>
                        <div className={styles.selectItem + " " + "fadeIn"}>
                            <div className={styles.inputContainer}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                    <path d="M20 22H18V20C18 18.3431 16.6569 17 15 17H9C7.34315 17 6 18.3431 6 20V22H4V20C4 17.2386 6.23858 15 9 15H15C17.7614 15 20 17.2386 20 20V22ZM12 13C8.68629 13 6 10.3137 6 7C6 3.68629 8.68629 1 12 1C15.3137 1 18 3.68629 18 7C18 10.3137 15.3137 13 12 13ZM12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"></path>
                                </svg>
                                <input className={styles.inputId} type={"text"} name={"pseudo"} placeholder={" "}></input>
                                <label htmlFor={"pseudo"} className={styles.labelId}>
                                    Pseudo
                                </label>
                            </div>
                            <div className={styles.inputContainer}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                    <path d="M19 10H20C20.5523 10 21 10.4477 21 11V21C21 21.5523 20.5523 22 20 22H4C3.44772 22 3 21.5523 3 21V11C3 10.4477 3.44772 10 4 10H5V9C5 5.13401 8.13401 2 12 2C15.866 2 19 5.13401 19 9V10ZM5 12V20H19V12H5ZM11 14H13V18H11V14ZM17 10V9C17 6.23858 14.7614 4 12 4C9.23858 4 7 6.23858 7 9V10H17Z"></path>
                                </svg>
                                <input className={styles.inputPW}  type={"password"} name={"password"} placeholder={" "} />
                                <label htmlFor={"password"} className={styles.labelPW}>
                                    Mot de passe
                                </label>
                            </div>

                            {
                                submitErr.show &&
                                <p className={styles.submitErr + ' ' + styles.fadeIn}>{submitErr.msg}</p>
                            }
                            <div className={styles.conditions}>
                                <div className={styles.register}>
                                    <p onClick={register}> Créer un compte ici</p>
                                </div>
                                <p onClick={forgotPassword}>Mot de passe oublié?</p>
                            </div>
                        </div>
                        <div className={styles.stepBtnContainer + ' ' + styles.logBtnContainer}>
                            <button type={'submit'} className={styles.stepBtn + ' ' + styles.logInBtn}>Se connecter</button>
                            <div className={styles.otherOption}>
                                <div className={styles.trait}> </div>
                                <h3> Ou </h3>
                            </div>
                            <GoogleLoginBtn click={() => signIn('google')} />
                        </div>

                        <ReCAPTCHA ref={captchaRef} size={'normal'}
                            sitekey={process.env.NEXT_PUBLIC_CAPTCHA_SITEKEY} onChange={token}>
                        </ReCAPTCHA>



                    </form>
                </div>
            </div>
            {
                width > 970 &&
                <div className={styles.containerImg}>
                    <img
                        alt={'Bannière Connexion Ogla'}
                        onError={(e) => e.target.src = "/assets/diapo/soldier.png"}
                        src={GetImgPathOfAssets() + "diapo/soldier.png"} />
                </div>
            }
        </div>
    )

}

export default Login;