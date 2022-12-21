import styles from "../../styles/Pages/Form/DevenirAuteur.module.scss";
import scrollbar from "../../styles/utils/scrollbar.module.scss";

import {useEffect, useState} from "react";
import {ArrowDownIcon} from "@heroicons/react/24/outline";
import {Capitalize} from "../../utils/String";

import Category from "../../json/category.json";
import {router, useRouter} from "next/router";
import {useSession} from "next-auth/react";


const DevenirAuteur = () => {

    const [stepActiveForm, setStepActiveForm] = useState(1);
    const [activeText, setActiveText] = useState("Il nous faut peu de mots pour exprimer l’essentiel, il nous faut tous les mots pour le rendre réel...");
    const {data: session, status} = useSession();
    const router = useRouter();

    /// SI L'UTILISATEUR EST CONNECTÉ \\\
    const [userObject, setUserObject] = useState({});

    useEffect(() => {
        if (session && !session.user.is_author) {
            setUserObject(session.user);
        }
        if (session && session.user.is_author) {
            router.replace('/');
        }
    }, [])

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
                <label htmlFor={"sName"}>Nom</label>
                <input type={"text"} name={"sName"} placeholder={"Nom"}/>
                <label htmlFor={"fName"}>Prénom</label>
                <input type={"text"} name={"fName"} placeholder={"Prénom"}></input>

                <label htmlFor={"age"}>Date de naissance</label>
                <input type={"date"} className={styles.date} name={"age"} min="1928-01-01" max="2022-07-12"/>
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
                        <label htmlFor={"email"}>Email</label>
                        <input type={"email"} name={"email"} placeholder={"Email"}></input>
                        <label htmlFor={"password"}>Mot de passe</label>
                        <input type={"password"} name={"password"} placeholder={"Mot de passe"}/>
                        <label htmlFor={"confirmPassword"}>Confirmez votre mot de passe</label>
                        <input type={"password"} className={styles.date} placeholder={"Confirmez votre mot de passe"}
                               name={"confirmPassword"}/>
                    </>

                }

                {loginLink()}
            </div>
        )
    }

    const thirdStepForm = () => {
        return (
            <div className={styles.selectItem + " " + "fadeIn"}>
                <label htmlFor={"pseudo"}>Auteur</label>
                <input type={"text"} name={"pseudo"} placeholder={"Nom d'auteur"}></input>


                <label htmlFor={"genres"}>Genre favoris</label>
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
                </div>
                <label htmlFor={"description"}>Une petite présentation</label>
                <textarea className={scrollbar.scrollbar} name={"description"}
                          placeholder={"Une petite présentation brève qui s'affichera sur votre profil..."}></textarea>


                <div className={styles.conditions}>
                    <input type={"checkbox"} className={styles.date} name={"confirmConditions"}/>
                    <label htmlFor={"confirmConditions"}>J'accepte les <span>conditions d'utilisations</span></label>
                </div>

                {

                    loginLink()
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

    const onSubmit = (e) => {
        e.preventDefault()
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


                <button type={'submit'} className={styles.stepBtn}>Envoyez</button>

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

                    <form onSubmit={onSubmit} className={styles.form}>
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

                    </form>
                </div>
            </div>

        </div>
    )
}
export default DevenirAuteur;