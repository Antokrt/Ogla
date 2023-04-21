import styles from "../../styles/Pages/Form/Login.module.scss";

import {Formik, Field, Form, ErrorMessage} from 'formik';
import {useEffect, useState} from "react";
import {RegisterSchema} from "./Schema/RegisterSchema";
import { useRouter} from "next/router";
import {signIn} from "next-auth/react";


const Register = ({login}) => {

    const [errItem, setErrItem] = useState({
        email: {
            msg: "Veuillez rentrer une adresse mail valide",
            show: false
        },
        password: {
            msg: "5 caractères minimum 1 chiffre et un symbole",
            show: false
        },
        confirmPassWord: {
            msg: "Les mots de passe ne correspondent pas",
            show: false
        },
        pseudo: {
            msg: 'Votre pseudo doit contenir plus de 3 caractères',
            show: false
        },
    });
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

    const loginLink = () => {
        return (
            <div className={styles.conditions}>
                <p onClick={login}>Déjà <span>inscrit</span>?</p>
            </div>
        )
    }

    const errMsgItem = (err) => {
        return (
            <p className={styles.errMsgItem}>{err}</p>
        )
    }

    const submit =  async (values) => {
        const formData = {
            email : values.email,
            pseudo: values.pseudo,
            password: values.password,
            is_author: false,
            redirect: false
        }
        console.log(formData)
        const register = await signIn('signup',formData)
            .then((res) => {
                if(res.status === 401){
                    let errMsg = res.error;
                    switch (errMsg) {
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
                }
                else {
                    setSubmitErr({
                        msg:'Oups une erreur à eu lieu',
                        show: true
                    })
                }
            })
            .catch((err) => setSubmitErr({
                msg:'Oups une erreur à eu lieu',
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

            <div className={styles.header}>
                <h1>Rejoins nous !</h1>
                <p> Ogla est une plateforme d’écriture et de lecture de livres, d’histoires ou de romans ouverte à tous.
                    Nous voulons que vous vous assuriez que personne ne puisse jamais vous empêcher d’écrire votre
                    histoire parce que nous croyons au pouvoir des mots.
                </p>
            </div>
            <div className={styles.form}>
                <Formik
                    initialValues={initialValues}
                    validationSchema={RegisterSchema}
                    onSubmit={(values) => {
                        submit(values)
                    }}>
                    {({resetForm}) => (
                        <Form>
                            <div className={styles.selectItem + " " + "fadeIn"}>

                                {/* EMAIL */}
                                <label htmlFor={"email"}>Email <span>*</span></label>
                                {email !== "" && errItem.email.show && !validateEmail(email) && errMsgItem(errItem.email.msg)}
                                <p className={styles.errMsgItem}>
                                    <ErrorMessage name={"email"}/>
                                </p>
                                <Field
                                    id={'email'}
                                    type={"email"}
                                    name={"email"}
                                    placeholder={"Email"}/>
                                {/* EMAIL */}

                                {/* PSEUDO */}
                                <label htmlFor={"pseudo"}>Pseudo <span>*</span></label>
                                <p className={styles.errMsgItem}>
                                    <ErrorMessage name={"pseudo"}/>
                                </p>
                                <Field
                                    type={"text"}
                                    id={"pseudo"}
                                    name={"pseudo"}
                                    placeholder={"Pseudo"}/>
                                {/* PSEUDO */}

                                {/* PASSWORD */}
                                <label htmlFor={"password"}>Mot de passe <span>*</span></label>
                                <p className={styles.errMsgItem}>
                                    <ErrorMessage name={"password"}/>
                                </p>
                                <Field
                                    id={'password'}
                                    type={"password"}
                                    name={"password"}
                                    placeholder={"Mot de passe"}/>
                                {/* PASSWORD */}

                                {/* CONFIRM PASSWORD */}
                                <label htmlFor={"confirmPassword"}>Confirmez votre mot de passe <span>*</span></label>
                                <p className={styles.errMsgItem}>
                                    <ErrorMessage name={"confirmPassword"}/>
                                </p>
                                <Field
                                       id={"confirmPassword"}
                                       type={"password"}
                                       placeholder={"Confirmez votre mot de passe"}
                                       name={"confirmPassword"}/>
                                {/* CONFIRM PASSWORD */}
                                {loginLink()}
                            </div>
                            {
                                submitErr.show &&
                                <p className={styles.submitErr + " " + styles.fadeIn}>{submitErr.msg}</p>
                            }
                            <div className={styles.stepBtnContainer}>
                                <button type={'submit'}  className={styles.stepBtn}>S'inscrire
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    )
}

export default Register;