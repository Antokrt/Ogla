import styles from "../../styles/Pages/Form/DevenirAuteur.module.scss";
import anim from '../../styles/utils/anim.module.scss';
import React, {useEffect, useRef, useState} from "react";
import {Formik, Field, Form, ErrorMessage, useFormikContext,} from "formik";

import {router, useRouter} from "next/router";
import {signIn, useSession} from "next-auth/react";
import {AuthorSchema, AuthorSchemaLog} from "../../Component/Form/Schema/AuthorSchema";
import axios from "axios";
import {instance} from "../../service/config/Interceptor";
import {toastDisplayError, toastDisplaySuccess, toastDisplayPromiseSendMail} from "../../utils/Toastify";
import {ChevronDoubleLeftIcon, ChevronDoubleRightIcon} from "@heroicons/react/24/solid";
import ScreenSize from "../../utils/Size";
import {LoaderCommentary} from "../../Component/layouts/Loader";
import Head from "next/head";
import {ConfirmModal} from "../../Component/Modal/ConfirmModal";
import {AuthorConditionsModal} from "../../Component/Modal/AuthorConditionsModal";

const DevenirAuteur = () => {

    const [stepActiveForm, setStepActiveForm] = useState(1);
    const [seeConditionsModal,setSeeConditionsModal] = useState(false);
    const [activeText, setActiveText] = useState("Il nous faut peu de mots pour exprimer l’essentiel, il nous faut tous les mots pour le rendre réel...");
    const {data: session} = useSession();
    const [seeErr, setSeeErr] = useState(false);
    const [errMsg, setErrMsg] = useState('Champs incorrects ou manquants');
    const [formReady, setFormReady] = useState(false);
    const [activeSchema, setActiveSchema] = useState(AuthorSchema);
    const ref = useRef(null);
    const router = useRouter();
    const [width, height] = ScreenSize();
    /// SI L'UTILISATEUR EST CONNECTÉ \\\
    const [userObject, setUserObject] = useState({});
    const [initialValues, setInitialValues] = useState({
        firstName: "",
        lastName: "",
        age: "",
        email: "",
        pseudo: "",
        password: "",
        confirmPassword: "",
        description: ""
    })


    useEffect(() => {
        if (session && !session.user.is_author) {
            setUserObject(session.user);
            initialValues.email = userObject.email;
            initialValues.pseudo = userObject.pseudo;
            setActiveSchema(AuthorSchemaLog);
            setFormReady(true);
        }
        if (session && session.user.is_author) {
            router.replace('/');
        } else {
            setFormReady(true);
        }
    }, [session])

    const getField = () => {
        return ref.current.values
    }

    const loginLink = () => {
        return (
            <div className={styles.conditions}>
                <p onClick={() => router.push({
                    pathname: "/auth",
                    query: "login"
                })}>Déjà <span>écrivain</span>?</p>
            </div>
        )
    }

    const firstStepForm = () => {
        return (
            <div className={styles.selectItem + " " + "fadeIn"}>
                {
                    session &&
                    <>
                        <label htmlFor={"email"}>Email

                        </label>
                        <p className={styles.errMsgItem}>
                        </p>
                        <input
                            className={styles.disabledForm}
                            disabled={true}
                            id={'email'}
                            type={"email"}
                            name={"email"}
                            value={session.user.email}
                            placeholder={"Votre adresse mail"}/>
                    </>
                }

                {/* LAST-NAME */}
                <label htmlFor={"lastName"}>
                    <span>
                        Nom
                        <svg viewBox="-16 0 512 512"><path
                            d="M471.99 334.43L336.06 256l135.93-78.43c7.66-4.42 10.28-14.2 5.86-21.86l-32.02-55.43c-4.42-7.65-14.21-10.28-21.87-5.86l-135.93 78.43V16c0-8.84-7.17-16-16.01-16h-64.04c-8.84 0-16.01 7.16-16.01 16v156.86L56.04 94.43c-7.66-4.42-17.45-1.79-21.87 5.86L2.15 155.71c-4.42 7.65-1.8 17.44 5.86 21.86L143.94 256 8.01 334.43c-7.66 4.42-10.28 14.21-5.86 21.86l32.02 55.43c4.42 7.65 14.21 10.27 21.87 5.86l135.93-78.43V496c0 8.84 7.17 16 16.01 16h64.04c8.84 0 16.01-7.16 16.01-16V339.14l135.93 78.43c7.66 4.42 17.45 1.8 21.87-5.86l32.02-55.43c4.42-7.65 1.8-17.43-5.86-21.85z"/></svg>
                    </span>

                    <p className={styles.errMsgItem}>
                        <ErrorMessage name={"lastName"}/>
                    </p>
                </label>

                <Field
                    id={'lastName'}
                    type={"text"}
                    name={"lastName"}
                    placeholder={"Nom"}/>
                {/* LAST-NAME */}


                {/* FIRST-NAME */}
                <label htmlFor={"firstName"}>
                    <span>
                        Prénom
                        <svg viewBox="-16 0 512 512"><path
                            d="M471.99 334.43L336.06 256l135.93-78.43c7.66-4.42 10.28-14.2 5.86-21.86l-32.02-55.43c-4.42-7.65-14.21-10.28-21.87-5.86l-135.93 78.43V16c0-8.84-7.17-16-16.01-16h-64.04c-8.84 0-16.01 7.16-16.01 16v156.86L56.04 94.43c-7.66-4.42-17.45-1.79-21.87 5.86L2.15 155.71c-4.42 7.65-1.8 17.44 5.86 21.86L143.94 256 8.01 334.43c-7.66 4.42-10.28 14.21-5.86 21.86l32.02 55.43c4.42 7.65 14.21 10.27 21.87 5.86l135.93-78.43V496c0 8.84 7.17 16 16.01 16h64.04c8.84 0 16.01-7.16 16.01-16V339.14l135.93 78.43c7.66 4.42 17.45 1.8 21.87-5.86l32.02-55.43c4.42-7.65 1.8-17.43-5.86-21.85z"/></svg>
                    </span>

                    <p className={styles.errMsgItem}>
                        <ErrorMessage name={"firstName"}/>
                    </p>
                </label>

                <Field
                    id={'firstName'}
                    type={"text"}
                    name={"firstName"}
                    placeholder={"Prénom"}/>
                {/* FIRST-NAME */}

                {/* AGE */}
                <label htmlFor={"age"}>
                    <span>
                        Date de naissance
                        <svg viewBox="-16 0 512 512"><path
                            d="M471.99 334.43L336.06 256l135.93-78.43c7.66-4.42 10.28-14.2 5.86-21.86l-32.02-55.43c-4.42-7.65-14.21-10.28-21.87-5.86l-135.93 78.43V16c0-8.84-7.17-16-16.01-16h-64.04c-8.84 0-16.01 7.16-16.01 16v156.86L56.04 94.43c-7.66-4.42-17.45-1.79-21.87 5.86L2.15 155.71c-4.42 7.65-1.8 17.44 5.86 21.86L143.94 256 8.01 334.43c-7.66 4.42-10.28 14.21-5.86 21.86l32.02 55.43c4.42 7.65 14.21 10.27 21.87 5.86l135.93-78.43V496c0 8.84 7.17 16 16.01 16h64.04c8.84 0 16.01-7.16 16.01-16V339.14l135.93 78.43c7.66 4.42 17.45 1.8 21.87-5.86l32.02-55.43c4.42-7.65 1.8-17.43-5.86-21.85z"/></svg>
                    </span>

                    <p className={styles.errMsgItem}>
                        <ErrorMessage name={"age"}/>
                    </p>
                </label>

                <Field
                    id={'age'}
                    type={"date"}
                    name={"age"}
                    placeholder={"Date de naissance"}
                    min={"1920-01-01"}
                    max={new Date().toISOString().split('T')[0]}
                />
                {/* AGE */}

                {
                    !session &&
                    loginLink()
                }

            </div>
        )
    }

    const secondStepForm = () => {
        return (
            <div className={styles.selectItem + " " + "fadeIn"}>
                {
                    !session &&
                    <>
                        {/* EMAIL */}
                        <label htmlFor={"email"}>
                            <span>
                                Email
                                <svg viewBox="-16 0 512 512"><path
                                    d="M471.99 334.43L336.06 256l135.93-78.43c7.66-4.42 10.28-14.2 5.86-21.86l-32.02-55.43c-4.42-7.65-14.21-10.28-21.87-5.86l-135.93 78.43V16c0-8.84-7.17-16-16.01-16h-64.04c-8.84 0-16.01 7.16-16.01 16v156.86L56.04 94.43c-7.66-4.42-17.45-1.79-21.87 5.86L2.15 155.71c-4.42 7.65-1.8 17.44 5.86 21.86L143.94 256 8.01 334.43c-7.66 4.42-10.28 14.21-5.86 21.86l32.02 55.43c4.42 7.65 14.21 10.27 21.87 5.86l135.93-78.43V496c0 8.84 7.17 16 16.01 16h64.04c8.84 0 16.01-7.16 16.01-16V339.14l135.93 78.43c7.66 4.42 17.45 1.8 21.87-5.86l32.02-55.43c4.42-7.65 1.8-17.43-5.86-21.85z"/></svg>
                            </span>

                            <p className={styles.errMsgItem}>
                                <ErrorMessage name={"email"}/>
                            </p>
                        </label>

                        <Field
                            id={'email'}
                            type={"email"}
                            name={"email"}
                            placeholder={"Votre adresse mail"}/>
                        {/* EMAIL */}


                        {/* PASSWORD */}
                        <label htmlFor={"password"}>
                            <span>
                                Mot de passe
                                <svg viewBox="-16 0 512 512"><path
                                    d="M471.99 334.43L336.06 256l135.93-78.43c7.66-4.42 10.28-14.2 5.86-21.86l-32.02-55.43c-4.42-7.65-14.21-10.28-21.87-5.86l-135.93 78.43V16c0-8.84-7.17-16-16.01-16h-64.04c-8.84 0-16.01 7.16-16.01 16v156.86L56.04 94.43c-7.66-4.42-17.45-1.79-21.87 5.86L2.15 155.71c-4.42 7.65-1.8 17.44 5.86 21.86L143.94 256 8.01 334.43c-7.66 4.42-10.28 14.21-5.86 21.86l32.02 55.43c4.42 7.65 14.21 10.27 21.87 5.86l135.93-78.43V496c0 8.84 7.17 16 16.01 16h64.04c8.84 0 16.01-7.16 16.01-16V339.14l135.93 78.43c7.66 4.42 17.45 1.8 21.87-5.86l32.02-55.43c4.42-7.65 1.8-17.43-5.86-21.85z"/></svg>
                            </span>

                            <p className={styles.errMsgItem}>
                                <ErrorMessage name={"password"}/>
                            </p>
                        </label>

                        <Field
                            id={'password'}
                            type={"password"}
                            name={"password"}
                            placeholder={"Mot de passe"}/>
                        {/* PASSWORD */}


                        {/* CONFIRMATION PASSWORD */}
                        <label htmlFor={"confirmPassword"}>
                            <span>
                                Confirmez votre mot de passe
                                <svg viewBox="-16 0 512 512"><path
                                    d="M471.99 334.43L336.06 256l135.93-78.43c7.66-4.42 10.28-14.2 5.86-21.86l-32.02-55.43c-4.42-7.65-14.21-10.28-21.87-5.86l-135.93 78.43V16c0-8.84-7.17-16-16.01-16h-64.04c-8.84 0-16.01 7.16-16.01 16v156.86L56.04 94.43c-7.66-4.42-17.45-1.79-21.87 5.86L2.15 155.71c-4.42 7.65-1.8 17.44 5.86 21.86L143.94 256 8.01 334.43c-7.66 4.42-10.28 14.21-5.86 21.86l32.02 55.43c4.42 7.65 14.21 10.27 21.87 5.86l135.93-78.43V496c0 8.84 7.17 16 16.01 16h64.04c8.84 0 16.01-7.16 16.01-16V339.14l135.93 78.43c7.66 4.42 17.45 1.8 21.87-5.86l32.02-55.43c4.42-7.65 1.8-17.43-5.86-21.85z"/></svg>
                            </span>
                            <p className={styles.errMsgItem}>
                                <ErrorMessage name={"confirmPassword"}/>
                            </p>
                        </label>

                        <Field
                            id={'confirmPassword'}
                            type={"password"}
                            name={"confirmPassword"}
                            placeholder={"Mot de passe"}/>
                        {/* CONFIRMATION PASSWORD */}

                    </>

                }

                {
                    !session &&
                    loginLink()
                }

            </div>
        )
    }

    const thirdStepForm = () => {
        return (
            <div className={styles.selectItem + " " + "fadeIn"}>
                {
                    session ?
                        <>
                            <label htmlFor={"pseudo"}>Nom d'auteur
                                <span>
                                    <svg viewBox="-16 0 512 512"><path
                                        d="M471.99 334.43L336.06 256l135.93-78.43c7.66-4.42 10.28-14.2 5.86-21.86l-32.02-55.43c-4.42-7.65-14.21-10.28-21.87-5.86l-135.93 78.43V16c0-8.84-7.17-16-16.01-16h-64.04c-8.84 0-16.01 7.16-16.01 16v156.86L56.04 94.43c-7.66-4.42-17.45-1.79-21.87 5.86L2.15 155.71c-4.42 7.65-1.8 17.44 5.86 21.86L143.94 256 8.01 334.43c-7.66 4.42-10.28 14.21-5.86 21.86l32.02 55.43c4.42 7.65 14.21 10.27 21.87 5.86l135.93-78.43V496c0 8.84 7.17 16 16.01 16h64.04c8.84 0 16.01-7.16 16.01-16V339.14l135.93 78.43c7.66 4.42 17.45 1.8 21.87-5.86l32.02-55.43c4.42-7.65 1.8-17.43-5.86-21.85z"/></svg>
                                </span>
                            </label>
                            <p className={styles.errMsgItem}>
                                Votre nom d'auteur remplacera votre pseudo
                            </p>
                            <Field
                                autoComplete={'off'}
                                className={styles.pseudoChange}
                                id={'pseudo'}
                                type={"text"}
                                name={"pseudo"}
                                placeholder={userObject.pseudo}
                            />
                        </>
                        :
                        <>
                            <label htmlFor={"pseudo"}>
                                <span>
                                    Nom d'auteur
                                    <svg viewBox="-16 0 512 512"><path
                                        d="M471.99 334.43L336.06 256l135.93-78.43c7.66-4.42 10.28-14.2 5.86-21.86l-32.02-55.43c-4.42-7.65-14.21-10.28-21.87-5.86l-135.93 78.43V16c0-8.84-7.17-16-16.01-16h-64.04c-8.84 0-16.01 7.16-16.01 16v156.86L56.04 94.43c-7.66-4.42-17.45-1.79-21.87 5.86L2.15 155.71c-4.42 7.65-1.8 17.44 5.86 21.86L143.94 256 8.01 334.43c-7.66 4.42-10.28 14.21-5.86 21.86l32.02 55.43c4.42 7.65 14.21 10.27 21.87 5.86l135.93-78.43V496c0 8.84 7.17 16 16.01 16h64.04c8.84 0 16.01-7.16 16.01-16V339.14l135.93 78.43c7.66 4.42 17.45 1.8 21.87-5.86l32.02-55.43c4.42-7.65 1.8-17.43-5.86-21.85z"/></svg>
                                </span>
                                <p className={styles.errMsgItem}>
                                    <ErrorMessage name={"pseudo"}/>
                                </p>
                            </label>

                            <Field
                                id={'pseudo'}
                                type={"text"}
                                name={"pseudo"}
                                placeholder={"Pseudo"}
                            />
                        </>
                }


                {/*<label htmlFor={"genres"}>Genre favoris</label>
                <div className={styles.selectCategory}>
                    <ArrowDownIcon/>
                    <select name="genres" id="pet-select">
                        {
                            Category.category.map((item) => {
                                return (
                                    <option key={item.name}
                                            value={Capitalize(item.name)}>{Capitalize(item.name)}</option>
                                )
                            })
                        }
                        <option value={"none"}>Pas de préférence</option>
                    </select>
                </div>*/}
                <label htmlFor={"description"}>
                    <span>
                        Une petite présentation
                        <svg viewBox="-16 0 512 512"><path
                            d="M471.99 334.43L336.06 256l135.93-78.43c7.66-4.42 10.28-14.2 5.86-21.86l-32.02-55.43c-4.42-7.65-14.21-10.28-21.87-5.86l-135.93 78.43V16c0-8.84-7.17-16-16.01-16h-64.04c-8.84 0-16.01 7.16-16.01 16v156.86L56.04 94.43c-7.66-4.42-17.45-1.79-21.87 5.86L2.15 155.71c-4.42 7.65-1.8 17.44 5.86 21.86L143.94 256 8.01 334.43c-7.66 4.42-10.28 14.21-5.86 21.86l32.02 55.43c4.42 7.65 14.21 10.27 21.87 5.86l135.93-78.43V496c0 8.84 7.17 16 16.01 16h64.04c8.84 0 16.01-7.16 16.01-16V339.14l135.93 78.43c7.66 4.42 17.45 1.8 21.87-5.86l32.02-55.43c4.42-7.65 1.8-17.43-5.86-21.85z"/></svg>
                    </span>
                    <p className={styles.errMsgItem}>
                        <ErrorMessage name={"description"}/>
                    </p>
                </label>

                <Field
                    autoComplete={'off'}
                    id={'description'}
                    type={"text"}
                    name={"description"}
                    placeholder={"Donnez envie aux lecteurs de vous découvrir avec une présentation de vous, brève mais sympathique... "}
                    className={styles.textareaForm}
                />

                {
                    seeErr &&
                    <p className={styles.errMsgItem + ' ' + anim.fadeIn} ref={testRef} style={{}}>{errMsg} </p>
                }
                <div className={styles.conditions}>
                    <span className={styles.acceptCondition}
                          htmlFor={"confirmConditions"}>En devenant écrivain sur <strong>OGLA</strong>, j'accepte l'ensemble des <a
                     target={'_blank'}   href={('/conditions-generales-d\'utilisation')}>conditions d'utilisation</a>.</span>
                </div>


                {
                    !session &&
                    loginLink()
                }


            </div>
        )
    }

    const testRef = useRef(null);

    const displayForm = (param) => {
        if (!session) {
            switch (param) {
                case 0:
                    return firstStepForm();
                case 1:
                    return firstStepForm();
                case 2:
                    return secondStepForm();
                case 3:
                    return thirdStepForm();

                case 4:
                    return (
                        <div className={styles.load}>
                            <LoaderCommentary/>
                        </div>
                    )

                default:
                    return (
                        <div className={styles.load}>
                            <LoaderCommentary/>
                        </div>
                    )

            }
        } else {
            switch (param) {
                case 1:
                    return firstStepForm();
                case 2:
                    return thirdStepForm();

                case 4:
                    return (
                        <div className={styles.load}>
                            <LoaderCommentary/>
                        </div>
                    );

                default:
                    return (
                        <div className={styles.load}>
                            <LoaderCommentary/>
                        </div>
                    );
            }
        }

    }

    const submit = async (values) => {
        if (session) {
            setStepActiveForm(4);
            const formData = {
                pseudo: values.pseudo,
                firstName: values.firstName,
                lastName: values.lastName,
                description: values.description,
                age: values.age
            }
            /*toastDisplayPromiseSendMail(*/
            instance.put('http://localhost:3008/author/turn-author', formData)
                .then(() => {
                    axios.get('/api/auth/session?update-author')
                        .then(() => router.push('/'))
                        .then(() => router.reload());
                })
                .catch((err) => setStepActiveForm(1));
            /*)*/
        } else {
            setStepActiveForm(4);
            const formData = {
                ...values,
                is_author: true,
                redirect: false
            }
            const register = await signIn('signupAuthor', formData)
                .then((res) => {
                    setStepActiveForm(1);
                    if (res.status === 401) {
                        setErrMsg('Email ou pseudo déjà existant')
                        setSeeErr(true);
                    }

                })
                .catch((err) => {
                    setStepActiveForm(1);
                    if (err.response.status === 401) {
                        setErrMsg('Email ou pseudo déjà existant')
                        setSeeErr(true);
                    }
                });
        }
    }

    const btn = () => {
        return (
            <div className={styles.stepBtnContainer}>
                {
                    stepActiveForm !== 1 && width > 360 &&
                    <span className={styles.stepBtn + " " + styles.pre} onClick={() => {
                        setStepActiveForm(stepActiveForm - 1)
                    }}> <ChevronDoubleLeftIcon/> Précédent</span>
                }
                {
                    stepActiveForm !== 1 && width <= 360 &&
                    <span className={styles.stepBtn + " " + styles.pre} onClick={() => {
                        setStepActiveForm(stepActiveForm - 1)
                    }}> Précédent</span>
                }
                <button
                    onClick={() => {
                        const data = getField();
                        if (
                            data.lastName === "" ||
                            data.firstName === "" ||
                            data.age === "" ||
                            data.email === "" ||
                            data.password === "" ||
                            data.pseudo === "" ||
                            data.description === ""
                        ) {
                            setSeeErr(true);
                            testRef.current.style.opacity = 1;
                            setTimeout(() => {
                                if (testRef.current) {
                                    testRef.current.style.opacity = 0;
                                }
                            }, 1000)
                        } else {
                            setSeeErr(false);
                        }
                    }}
                    type={'submit'}
                    className={styles.stepBtn}>Envoyer
                    {
                        width > 360 &&
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                             stroke="currentColor" class="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                  d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"/>
                        </svg>
                    }

                </button>
            </div>
        )
    }

    const nextPreviousBtn = () => {
        return (
            <div className={styles.stepBtnContainer}>
                {
                    stepActiveForm !== 1 && width > 360 &&
                    <span className={styles.stepBtn + " " + styles.pre} onClick={() => {
                        setStepActiveForm(stepActiveForm - 1)
                    }}> <ChevronDoubleLeftIcon/> Précédent</span>
                }
                {
                    stepActiveForm !== 1 && width <= 360 &&
                    <span className={styles.stepBtn + " " + styles.pre} onClick={() => {
                        setStepActiveForm(stepActiveForm - 1)
                    }}> Précédent</span>
                }

                {
                    width > 360 &&
                    <span className={styles.stepBtn} onClick={() => {
                        if (stepActiveForm !== 3) {
                            setStepActiveForm(stepActiveForm + 1)
                        }
                    }}>
                        Suivant <ChevronDoubleRightIcon/>
                    </span>
                }
                {
                    width <= 360 &&
                    <span className={styles.stepBtn} onClick={() => {
                        if (stepActiveForm !== 3) {
                            setStepActiveForm(stepActiveForm + 1)
                        }
                    }}> Suivant </span>
                }
            </div>
        )
    }

    return (
        <div className={styles.container}>
            <Head>
                <title>Ogla - Devenir auteur</title>
                <meta name="description" content="Generated by create next app"/>
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <div className={styles.LogoHead}>
                <h1 onClick={() => router.push("/")}> OGLA </h1>
            </div>
            <div className={styles.content}>
                <div className={styles.leftBlock}>
                    <div className={styles.formContainer}>
                        <div className={styles.header}>
                            <h1>Deviens écrivain </h1>
                            {
                                stepActiveForm !== 3 ?
                                    <p> {activeText} </p>
                                    :
                                    <p> Avant de continuer, il est vivement recommandé de prendre le temps de lire
                                        attentivement les <span onClick={() => setSeeConditionsModal(!seeConditionsModal)}> conditions spécifiques aux écrivains </span>.
                                    </p>
                            }
                        </div>
                        <div className={styles.form}>
                            {
                                formReady &&
                                <Formik
                                    innerRef={ref}
                                    initialValues={initialValues}
                                    validationSchema={activeSchema}
                                    onSubmit={(values, actions) => {
                                        submit(values)
                                    }}
                                >
                                    {({setFieldValue}) =>
                                        (
                                            <Form>
                                                {
                                                    displayForm(stepActiveForm)
                                                }
                                                {
                                                    stepActiveForm !== 3 && !session &&
                                                    nextPreviousBtn()
                                                }
                                                {
                                                    stepActiveForm !== 2 && session &&
                                                    nextPreviousBtn()
                                                }
                                                {
                                                    stepActiveForm === 3 && !session &&
                                                    btn()
                                                }
                                                {
                                                    stepActiveForm === 2 && session &&
                                                    btn()
                                                }
                                            </Form>
                                        )}
                                </Formik>
                            }
                        </div>
                    </div>
                </div>
                {
                    width > 1150 &&
                    <div className={styles.rightBlock}>
                        <img src={"/assets/diapo/3.png"}/>
                    </div>
                }
            </div>
            {
                seeConditionsModal &&
                <AuthorConditionsModal close={() => setSeeConditionsModal(false)}/>
            }
        </div>
    )
}
export default DevenirAuteur;