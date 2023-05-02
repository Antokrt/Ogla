import styles from "../../styles/Pages/Form/Login.module.scss";

import { useSession, signIn, signOut } from "next-auth/react";
import React, { createRef, useEffect, useRef, useState } from "react";
import { router } from "next/router";
import { GoogleLoginBtn } from "../layouts/Btn/Link";
import { ReCAPTCHA } from "react-google-recaptcha";
import ScreenSize from "../../utils/Size";

const Login = ({ register, forgotPassword }) => {

    const { data: session, status } = useSession();
    const formRef = useRef(null);
    const captchaRef = useRef(null);
    const [width, height] = ScreenSize();

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
                    setSubmitErr(prevState => ({
                        msg: 'Identifiant ou mot de passe incorrect!',
                        show: true
                    }))
                } else {
                    setSubmitErr(prevState => ({
                        msg: 'Erreur lors de la connexion',
                        show: true
                    }))
                }
            })

    }


    return (
        <div className={styles.formContainer}>
            <div className={styles.ctn}>
                <div className={styles.leftBlock}>
                <div className={styles.header}>
                    <img src="/assets/bookOrange2.png" />
                    <h1> Bon retour parmi nous !</h1>
                    <p> 
                    Ogla est une plateforme d’écriture et de lecture de livres, d’histoires ou de romans ouverte à tous.
                    Connectez-vous pour avoir accès à toutes les fonctionnalitées. 
                    Nous voulons que vous vous assuriez que personne ne puisse jamais vous empêcher d’écrire.
                    </p>
                    {/* <h1>Connexion </h1> */}
                    {/* <p> Ogla est une plateforme d’écriture et de lecture de livres, d’histoires ou de romans ouverte à
                    tous. Nous voulons que vous vous assuriez que personne ne puisse jamais vous empêcher d’écrire
                    votre histoire parce que nous croyons au pouvoir des mots.
                </p> */}
                </div>
                <form onSubmit={handleSubmit} ref={formRef} className={styles.form}>
                    <div className={styles.selectItem + " " + "fadeIn"}>
                        <label htmlFor={"pseudo"}>Identifiant
                            <span>
                                <svg viewBox="-16 0 512 512"><path d="M471.99 334.43L336.06 256l135.93-78.43c7.66-4.42 10.28-14.2 5.86-21.86l-32.02-55.43c-4.42-7.65-14.21-10.28-21.87-5.86l-135.93 78.43V16c0-8.84-7.17-16-16.01-16h-64.04c-8.84 0-16.01 7.16-16.01 16v156.86L56.04 94.43c-7.66-4.42-17.45-1.79-21.87 5.86L2.15 155.71c-4.42 7.65-1.8 17.44 5.86 21.86L143.94 256 8.01 334.43c-7.66 4.42-10.28 14.21-5.86 21.86l32.02 55.43c4.42 7.65 14.21 10.27 21.87 5.86l135.93-78.43V496c0 8.84 7.17 16 16.01 16h64.04c8.84 0 16.01-7.16 16.01-16V339.14l135.93 78.43c7.66 4.42 17.45 1.8 21.87-5.86l32.02-55.43c4.42-7.65 1.8-17.43-5.86-21.85z" /></svg>
                            </span>
                        </label>
                        <input type={"text"} name={"pseudo"} placeholder={"Email ou pseudo"}></input>
                        <label htmlFor={"password"}>Mot de passe
                            <span>
                                <svg viewBox="-16 0 512 512"><path d="M471.99 334.43L336.06 256l135.93-78.43c7.66-4.42 10.28-14.2 5.86-21.86l-32.02-55.43c-4.42-7.65-14.21-10.28-21.87-5.86l-135.93 78.43V16c0-8.84-7.17-16-16.01-16h-64.04c-8.84 0-16.01 7.16-16.01 16v156.86L56.04 94.43c-7.66-4.42-17.45-1.79-21.87 5.86L2.15 155.71c-4.42 7.65-1.8 17.44 5.86 21.86L143.94 256 8.01 334.43c-7.66 4.42-10.28 14.21-5.86 21.86l32.02 55.43c4.42 7.65 14.21 10.27 21.87 5.86l135.93-78.43V496c0 8.84 7.17 16 16.01 16h64.04c8.84 0 16.01-7.16 16.01-16V339.14l135.93 78.43c7.66 4.42 17.45 1.8 21.87-5.86l32.02-55.43c4.42-7.65 1.8-17.43-5.86-21.85z" /></svg>
                            </span>
                        </label>
                        <input value={'azerty'} type={"password"} name={"password"} placeholder={"Mot de passe"} />
                        {
                            submitErr.show &&
                            <p className={styles.submitErr + ' ' + styles.fadeIn}>{submitErr.msg}</p>
                        }
                        <div className={styles.conditions}>
                            <div className={styles.rememberMe}>
                                <input type="checkbox" name="Remember" checked={true} />
                                <label htmlFor="Remember">Se souvenir de moi</label>
                            </div>
                            <p onClick={forgotPassword}>Mot de passe oublié?</p>
                        </div>
                    </div>
                    <div className={styles.stepBtnContainer + ' ' + styles.logBtnContainer}>
                        <button type={'submit'} className={styles.stepBtn + ' ' + styles.logInBtn}>Se connecter</button>
                        <div className={styles.otherOption}>
                            <div className={styles.trait}> </div>
                            <h3> Se connecter autrement </h3>
                        </div>
                        <GoogleLoginBtn click={() => signIn('google')} />
                    </div>

                    <ReCAPTCHA ref={captchaRef} size={'normal'}
                        sitekey={'6LdQPrQlAAAAAMw_TQ02hrA9145W96nGWFUZTQPL'} onChange={token}>
                    </ReCAPTCHA>

                    <div className={styles.register}>
                        <h3> Pas encore inscrit?</h3>
                        <p onClick={register}> Créez un compte ici</p>
                    </div>

                </form>
                </div>
            </div>
            {
                width > 970 &&
                <div className={styles.containerImg}>
                    <img src={"/assets/diapo/soldier.png"} />
                </div>
            }
        </div>
    )

}

export default Login;