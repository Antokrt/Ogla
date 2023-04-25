import styles from "../../styles/Pages/Form/Login.module.scss";

import {useSession, signIn, signOut} from "next-auth/react";
import React, {createRef, useEffect, useRef, useState} from "react";
import {router} from "next/router";
import {GoogleLoginBtn} from "../layouts/Btn/Link";
import {ReCAPTCHA} from "react-google-recaptcha";

const Login = ({register, forgotPassword}) => {

    const {data: session, status} = useSession();
    const formRef = useRef(null);
    const captchaRef = useRef(null);

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

            <div className={styles.header}>
                <h1>Connexion </h1>
                <p> Ogla est une plateforme d’écriture et de lecture de livres, d’histoires ou de romans ouverte à
                    tous. Nous voulons que vous vous assuriez que personne ne puisse jamais vous empêcher d’écrire
                    votre histoire parce que nous croyons au pouvoir des mots.
                </p>
            </div>
            <form onSubmit={handleSubmit} ref={formRef} className={styles.form}>
                <div className={styles.selectItem + " " + "fadeIn"}>
                    <label htmlFor={"pseudo"}>Identifiant</label>
                    <input type={"text"} name={"pseudo"} placeholder={"Email ou pseudo"}></input>
                    <label htmlFor={"password"}>Mot de passe</label>
                    <input value={'azerty'} type={"password"} name={"password"} placeholder={"Mot de passe"}/>
                    <div className={styles.conditions}>
                        <p onClick={forgotPassword}>Mot de passe oublié?</p>
                        <p onClick={register}>Pas encore <span>inscrit</span>?</p>

                    </div>
                </div>
                {
                    submitErr.show &&
                    <p className={styles.submitErr + ' ' + styles.fadeIn}>{submitErr.msg}</p>
                }



                <div className={styles.stepBtnContainer + ' ' + styles.logBtnContainer}>
                    <button type={'submit'} className={styles.stepBtn + ' ' + styles.logInBtn}>Se connecter</button>
                    <GoogleLoginBtn click={() => signIn('google')}/>
                </div>

                <ReCAPTCHA ref={captchaRef} size={'normal'}
                    sitekey={'6LdEYaQlAAAAAOFg-L4Cu7BeCYBScWovNeUMyAHi'} onChange={token}>

                </ReCAPTCHA>

            </form>


        </div>
    )

}

export default Login;