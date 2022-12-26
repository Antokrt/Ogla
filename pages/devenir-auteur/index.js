import styles from "../../styles/Pages/Form/DevenirAuteur.module.scss";
import {useEffect, useRef, useState} from "react";
import {Formik, Field, Form, ErrorMessage, useField} from "formik";
import {router, useRouter} from "next/router";
import {signIn, useSession} from "next-auth/react";
import {AuthorSchema} from "../../Component/Form/Schema/AuthorSchema";
import axios from "axios";


const DevenirAuteur = () => {

    const [stepActiveForm, setStepActiveForm] = useState(1);
    const [activeText, setActiveText] = useState("Il nous faut peu de mots pour exprimer l’essentiel, il nous faut tous les mots pour le rendre réel...");
    const {data: session, status} = useSession();
    const [seeErr, setSeeErr] = useState(false);
    const [errMsg, setErrMsg] = useState('Champs incorrects ou manquants');

    const ref = useRef(null);

    const router = useRouter();


    /// SI L'UTILISATEUR EST CONNECTÉ \\\
    const [userObject, setUserObject] = useState({});

    const initialValues = {
        firstName:"",
        lastName:"",
        age:"",
        email: "",
        pseudo: "",
        password: "",
        confirmPassword: "",
        description:""
    };

    useEffect(() => {
        if (session && !session.user.is_author) {
            setUserObject(session.user);
        }
        if (session && session.user.is_author) {
            router.replace('/');
        }
    }, [])

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
                        <label htmlFor={"email"}>Email</label>
                        <input type={"email"} name={"email"} placeholder={"Email"} defaultValue={userObject.email}
                               disabled={true}></input>
                    </>
                }

                {/* LAST-NAME */}
                <label htmlFor={"lastName"}>Nom</label>
                <p className={styles.errMsgItem}>
                    <ErrorMessage name={"lastName"}/>
                </p>
                <Field
                    id={'lastName'}
                    type={"text"}
                    name={"lastName"}
                    placeholder={"Nom"}/>
                {/* LAST-NAME */}


                {/* FIRST-NAME */}
                <label htmlFor={"firstName"}>Prénom</label>
                <p className={styles.errMsgItem}>
                    <ErrorMessage name={"firstName"}/>
                </p>
                <Field
                    id={'firstName'}
                    type={"text"}
                    name={"firstName"}
                    placeholder={"Nom"}/>
                {/* FIRST-NAME */}

                {/* AGE */}
                <label htmlFor={"age"}>Date de naissance</label>
                <p className={styles.errMsgItem}>
                    <ErrorMessage name={"age"}/>
                </p>
                <Field
                    id={'age'}
                    type={"date"}
                    name={"age"}
                    placeholder={"Date de naissance"}/>
                {/* AGE */}

                {loginLink()}

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
                        <label htmlFor={"email"}>Email</label>
                        <p className={styles.errMsgItem}>
                            <ErrorMessage name={"email"}/>
                        </p>
                        <Field
                            id={'email'}
                            type={"email"}
                            name={"email"}
                            placeholder={"Votre adresse mail"}/>
                        {/* EMAIL */}


                        {/* PASSWORD */}
                        <label htmlFor={"password"}>Mot de passe</label>
                        <p className={styles.errMsgItem}>
                            <ErrorMessage name={"password"}/>
                        </p>
                        <Field
                            id={'password'}
                            type={"password"}
                            name={"password"}
                            placeholder={"Mot de passe"}/>
                        {/* PASSWORD */}


                        {/* CONFIRMATION PASSWORD */}
                        <label htmlFor={"confirmPassword"}>Confirmez votre mot de passe</label>
                        <p className={styles.errMsgItem}>
                            <ErrorMessage name={"confirmPassword"}/>
                        </p>
                        <Field
                            id={'confirmPassword'}
                            type={"password"}
                            name={"confirmPassword"}
                            placeholder={"Mot de passe"}/>
                        {/* CONFIRMATION PASSWORD */}

                    </>

                }

                {loginLink()}
            </div>
        )
    }

    const thirdStepForm = () => {
        return (
            <div className={styles.selectItem + " " + "fadeIn"}>
                <label htmlFor={"pseudo"}>Nom d'auteur</label>
                <p className={styles.errMsgItem}>
                    <ErrorMessage name={"pseudo"}/>
                </p>
                <Field
                    id={'pseudo'}
                    type={"text"}
                    name={"pseudo"}
                    placeholder={"Nom d'auteur"}/>

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
                <label htmlFor={"description"}>Une petite présentation</label>
                <p className={styles.errMsgItem}>
                    <ErrorMessage name={"description"}/>
                </p>
                <Field
                    id={'description'}
                    type={"text"}
                    name={"description"}
                    placeholder={"Donnez envie aux lecteurs de vous découvrir avec une présentation de vous brève mais sympathique... "}
                    className={styles.textareaForm}
                />


                <div className={styles.conditions}>
                    <label htmlFor={"confirmConditions"}>En devenant écrivain sur <strong>OGLA </strong>, j'accepte les <span>conditions d'utilisations</span></label>
                </div>


                {

                    loginLink()
                }

                {
                    seeErr &&
                    <p className={styles.errMsgItem}>{errMsg} </p>
                }
            </div>
        )
    }

    const displayForm = (param) => {
        if(!session){
            switch (param) {
                case 0 :
                    return firstStepForm();
                case 1 :
                    return firstStepForm();
                case 2 :
                    return secondStepForm();
                case 3:
                    return thirdStepForm();

                default:
                    return <p className={styles.err}>Erreur Formulaire</p>
            }
        }
        else {
            switch (param) {
                case 1 :
                    return firstStepForm();
                case 2 :
                    return thirdStepForm();

                default:
                    return <p className={styles.err}>Erreur Formulaire</p>
            }
        }

    }

    const submit =  async (values) => {
        const formData = {
            ...values,
            is_author:true,
            redirect:false
        }
       const register = await signIn('signup',formData)
            .then((res) => router.push('/'))
            .catch((err) => {
                if(err.response.status === 401){
                    setErrMsg('Email ou pseudo déjà existant')
                    setSeeErr(true);
                }
            });

    }

        const btn = () => {

        return (
            <div className={styles.stepBtnContainer}>
                {
                    stepActiveForm !== 1 &&
                    <span className={styles.stepBtn + " " + styles.pre} onClick={() => {
                        setStepActiveForm(stepActiveForm - 1)
                    }}>Précédent</span>
                }


                <button
                    onClick={() => {
                        const data = getField();
                        if(
                            data.lastName === "" ||
                            data.firstName === "" ||
                            data.age === "" ||
                            data.email === "" ||
                            data.password === "" ||
                            data.pseudo === "" ||
                            data.description === ""
                        ){
                            setSeeErr(true)
                        }
                        else {
                            setSeeErr(false);
                        }
                    }}
                    type={'submit'}
                    className={styles.stepBtn}>Envoyez</button>

            </div>
        )
    }

    const nextPreviousBtn = () => {
        return (
            <div className={styles.stepBtnContainer}>
                {
                    stepActiveForm !== 1 &&
                    <span className={styles.stepBtn + " " + styles.pre} onClick={() => {
                        setStepActiveForm(stepActiveForm - 1)
                    }}>Précédent</span>
                }


                <span className={styles.stepBtn} onClick={() => {
                    if (stepActiveForm !== 3) {
                        setStepActiveForm(stepActiveForm + 1)
                    }
                }}>Suivant</span>


            </div>
        )
    }

    return (
        <div className={styles.container}>

            <div className={styles.purple}></div>

            <div className={styles.block}>
                <div className={styles.imgContainer}>
                    <img src={"/assets/gon.png"}/>
                </div>

                <div className={styles.formContainer}>
                    <div className={styles.header}>
                        <h1>Deviens écrivain </h1>
                        {
                            stepActiveForm !== 3 ?
                                <p>{activeText}</p>
                                :
                                <p>Votre inscription sera traitée le plus rapidement possible par l'équipe d'OGLA !</p>
                        }
                    </div>

                    <div className={styles.form}>
                        <Formik
                                innerRef={ref}
                                initialValues={initialValues}
                                validationSchema={AuthorSchema}
                                onSubmit={(values,actions) => {
                                    submit(values)
                                }}
                        >
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


                        </Formik>
                    </div>

                </div>
            </div>

        </div>
    )
}
export default DevenirAuteur;