import styles from "../../styles/Pages/Form/Register.module.scss";

import { Formik, Field, Form, ErrorMessage } from 'formik';
import React, { useEffect, useState } from "react";
import { RegisterSchema } from "./Schema/RegisterSchema";
import {router, useRouter} from "next/router";
import { signIn } from "next-auth/react";
import ScreenSize from "../../utils/Size";


const Register = ({ login }) => {

    // const [errItem, setErrItem] = useState({
    //     email: {
    //         msg: "Veuillez rentrer une adresse mail valide",
    //         show: false
    //     },
    //     password: {
    //         msg: "5 caractères minimum 1 chiffre et un symbole",
    //         show: false
    //     },
    //     confirmPassWord: {
    //         msg: "Les mots de passe ne correspondent pas",
    //         show: false
    //     },
    //     pseudo: {
    //         msg: 'Votre pseudo doit contenir plus de 3 caractères',
    //         show: false
    //     },
    // });
    const [submitErr, setSubmitErr] = useState({
        msg: "Erreur lors de l'envoi du formulaire",
        show: false
    })
    const [email, setEmail] = useState('');
    const initialValues = {
        email: "",
        pseudo: "",
        password: "",
        confirmPassword: "",
    };
    const router = useRouter();
    const [width, height] = ScreenSize();

    const loginLink = () => {
        return (
            <div className={styles.conditions}>
                <p onClick={login}>Déjà <span>inscrit</span>?</p>
            </div>
        )
    }

    // const errMsgItem = (err) => {
    //     return (
    //         <p className={styles.errMsgItem}>{err}</p>
    //     )
    // }

    const submit = async (values) => {
        const formData = {
            email: values.email,
            pseudo: values.pseudo,
            password: values.password,
            is_author: false,
            redirect: false
        }
        const register = await signIn('signup', formData)
            .then((res) => {
                if (res.status === 401) {
                    let errMsg = res.error;
                    switch (errMsg) {
                        case "Email & pseudo already exists":
                            setSubmitErr({
                                msg: 'Email ou pseudo déjà existant',
                                show: true
                            })
                            break;

                        case "Email  already exists":
                            setSubmitErr({
                                msg: 'Email déjà existant',
                                show: true
                            })
                            break;

                        case "Pseudo already exists":
                            setSubmitErr({
                                msg: 'Pseudo déjà existant',
                                show: true
                            })
                            break;

                        default:
                            setSubmitErr({
                                msg: "Erreur lors de l'envoi du formulaire",
                                show: true
                            })
                    }
                }
                else {
                    setSubmitErr({
                        msg: 'Oups une erreur à eu lieu',
                        show: true
                    })
                }
            })
            .catch((err) => setSubmitErr({
                msg: 'Oups une erreur à eu lieu',
                show: true
            }))
        /*RegisterService(formData)
            .catch((err) => {
                let errMsg = err.response.data.message;
                switch (errMsg){
                    case"email && pseudo already exists":
                        setSubmitErr({
                            msg: 'Email ou pseudo déjà existant',
                            show: true
                        })
                        break;

                    case "email already exists":
                        setSubmitErr({
                            msg: 'Email déjà existant',
                            show: true
                        })
                        break;

                    case "pseudo already exists":
                        setSubmitErr({
                            msg: 'Email déjà existant',
                            show: true
                        })
                        break;

                    default:
                        setSubmitErr({
                            msg: "Erreur lors de l'envoi du formulaire",
                            show: true
                        })
                }
            })*/
    }

    return (
        <div className={styles.formContainer}>
            <div className={styles.imgAbs} onClick={() => router.push("/")}>
                <img src="/assets/bookOrange2.png" />
            </div>
            <div className={styles.leftBlock}>
                <div className={styles.content}>
                    <div className={styles.header}>
                        <h1> Rejoins nous !</h1>
                        <p> Ogla est une plateforme d’écriture et de lecture de livres, d’histoires ou de romans ouverte à tout.
                           <br/> Rejoignez la communauté pour avoir accès à tout son potentiel !</p>
                    </div>
                    <div className={styles.form}>
                        <Formik
                            initialValues={initialValues}
                            validationSchema={RegisterSchema}
                            onSubmit={(values) => {
                                submit(values)
                            }}>
                            {({ resetForm }) => (
                                <Form>
                                    <div className={styles.selectItem + " " + "fadeIn"}>
                                        {/* EMAIL */}
                                        <div className={styles.inputContainer}>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                                <path d="M3 3H21C21.5523 3 22 3.44772 22 4V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3ZM20 7.23792L12.0718 14.338L4 7.21594V19H20V7.23792ZM4.51146 5L12.0619 11.662L19.501 5H4.51146Z"></path>
                                            </svg>
                                            <Field
                                                id={'email'}
                                                type={"email"}
                                                name={"email"}
                                                placeholder={" "}
                                                className={styles.inputEmail}
                                            />
                                            <label htmlFor={"email"} className={styles.labelEmail}>
                                                Email
                                            </label>
                                            <p className={styles.errMsgItem}>
                                                <ErrorMessage name={"email"} />
                                            </p>
                                        </div>
                                        {/* EMAIL */}

                                        {/* PSEUDO */}
                                        <div className={styles.inputContainer}>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                                <path d="M20 22H18V20C18 18.3431 16.6569 17 15 17H9C7.34315 17 6 18.3431 6 20V22H4V20C4 17.2386 6.23858 15 9 15H15C17.7614 15 20 17.2386 20 20V22ZM12 13C8.68629 13 6 10.3137 6 7C6 3.68629 8.68629 1 12 1C15.3137 1 18 3.68629 18 7C18 10.3137 15.3137 13 12 13ZM12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"></path>
                                            </svg>
                                            <Field
                                                type={"text"}
                                                id={"pseudo"}
                                                name={"pseudo"}
                                                placeholder={" "}
                                                className={styles.inputPseudo}
                                            />

                                            <label htmlFor={"pseudo"} className={styles.labelPseudo}>
                                                Pseudo
                                            </label>
                                            <p className={styles.errMsgItem}>
                                                <ErrorMessage name={"pseudo"} />
                                            </p>
                                        </div>
                                        {/* PSEUDO */}

                                        {/* PASSWORD */}
                                        <div className={styles.inputContainer}>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                                <path d="M19 10H20C20.5523 10 21 10.4477 21 11V21C21 21.5523 20.5523 22 20 22H4C3.44772 22 3 21.5523 3 21V11C3 10.4477 3.44772 10 4 10H5V9C5 5.13401 8.13401 2 12 2C15.866 2 19 5.13401 19 9V10ZM5 12V20H19V12H5ZM11 14H13V18H11V14ZM17 10V9C17 6.23858 14.7614 4 12 4C9.23858 4 7 6.23858 7 9V10H17Z"></path>
                                            </svg>
                                            <Field
                                                id={'password'}
                                                type={"password"}
                                                name={"password"}
                                                placeholder={" "}
                                                className={styles.inputPW}
                                            />

                                            <label htmlFor={"password"} className={styles.labelPW}>
                                                Mot de passe
                                            </label>
                                            <p className={styles.errMsgItem}>
                                                <ErrorMessage name={"password"} />
                                            </p>
                                        </div>
                                        {/* PASSWORD */}

                                        {/* CONFIRM PASSWORD */}
                                        <div className={styles.inputContainer}>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                                <path d="M19 10H20C20.5523 10 21 10.4477 21 11V21C21 21.5523 20.5523 22 20 22H4C3.44772 22 3 21.5523 3 21V11C3 10.4477 3.44772 10 4 10H5V9C5 5.13401 8.13401 2 12 2C15.866 2 19 5.13401 19 9V10ZM5 12V20H19V12H5ZM11 14H13V18H11V14ZM17 10V9C17 6.23858 14.7614 4 12 4C9.23858 4 7 6.23858 7 9V10H17Z"></path>
                                            </svg>
                                            <Field
                                                id={"confirmPassword"}
                                                type={"password"}
                                                placeholder={" "}
                                                name={"confirmPassword"}
                                                className={styles.inputConfirm}
                                            />
                                            <label htmlFor={"confirmPassword"} className={styles.labelConfirm}>
                                                Confirmation
                                            </label>
                                            <p className={styles.errMsgItem}>
                                                {
                                                    width > 196 &&
                                                    <ErrorMessage name={"confirmPassword"} />
                                                }
                                            </p>
                                        </div>
                                        {/* CONFIRM PASSWORD */}
                                    </div>
                                    {
                                        submitErr.show &&
                                        <p className={styles.submitErr + " " + styles.fadeIn}>{submitErr.msg}</p>
                                    }
                                    <div className={styles.lastOptions}>
                                        {loginLink()}
                                        <p className={styles.registerGoogle} onClick={() => signIn('google')}> S'inscrire avec Google </p>
                                    </div>
                                    <div className={styles.stepBtnContainer}>
                                        <button type={'submit'} className={styles.stepBtn}> S'inscrire
                                        </button>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            </div>
            {
                width > 1000 &&
                <div className={styles.containerImg}>
                    <img src={"/assets/diapo/knight2.png"} />
                </div>
            }
        </div>
    )
}

export default Register;