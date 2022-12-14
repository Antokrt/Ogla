import styles from "../../styles/Pages/Form/Login.module.scss";
import {ArrowDownIcon} from "@heroicons/react/24/outline";
import Category from "../../json/category.json";
import {Capitalize} from "../../utils/String";

import scrollbar from "../../styles/utils/scrollbar.module.scss";
import { useSession,signIn} from "next-auth/react";
import {useEffect, useRef, useState} from "react";
import axios from "axios";

const Login = ({register}) => {

    const { data: session, status } = useSession();

    useEffect(() => {
        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwc2V1ZG8iOiJqb3PDqTIiLCJzdWIiOiI2MzhkY2M2NmJiZDkyZGVmODMxMmFjNGQiLCJpYXQiOjE2NzEwNDIxOTQsImV4cCI6MTY3MTA2MjE5NH0.yskWAajQLdabyAwXE3s-IPZYbNqatBEG-qR1V8b1mcY'
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };

        axios.get('http://localhost:3008/user/profil', config)
            .then((res) => console.log(res))


    },[])

    const formRef = useRef(null);

    const [submitErr, setSubmitErr] = useState({
        msg:"Identifiant ou mot de passe incorrect",
        show:false
    })

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(formRef.current);
        if(!formData.get('pseudo') || !formData.get('password')) return alert('Data missing in form');
        const response = await signIn('login',{
            pseudo:formData.get('pseudo'),
            password:formData.get('password'),
            redirect:false
        })
            .then((res) => {
                if(res.status === 401){
                    switch (res.error){
                        case 'Impossible to find the user' :{
                            setSubmitErr(prevState => ({
                                   msg:'Identifiant ou mot de passe incorrect!',
                                    show:true
                            }))
                        }
                    }
                }
            })
    }

    const loginLink = () => {
        return (
            <div className={styles.conditions}>
                <p onClick={register}>Pas encore <span>inscrit</span>?</p>
            </div>
        )
    }

    const firstStepForm = () => {
        return (
            <div  className={styles.selectItem + " " + "fadeIn"}>
                    <label htmlFor={"pseudo"}>Identifiant</label>
                    <input type={"text"} name={"pseudo"} placeholder={"Email ou pseudo"}></input>
                    <label htmlFor={"password"}>Mot de passe</label>
                    <input type={"password"} name={"password"} placeholder={"Mot de passe"}/>
                    {loginLink()}
            </div>
        )
    }

    const btn = () => {
        return (
            <div className={styles.stepBtnContainer}>
                <button  type={'submit'} className={styles.stepBtn}>Se connecter</button>
            </div>
        )
    }


    return (
        <div className={styles.formContainer}>

            <div className={styles.header}>
                <h1>Connexion </h1>
                <p> Ogla est une plateforme d’écriture et de lecture de livres, d’histoires ou de romans ouverte à tous. Nous voulons que vous vous assuriez que personne ne puisse jamais vous empêcher d’écrire votre histoire parce que nous croyons au pouvoir des mots.
                </p>
            </div>

            <form onSubmit={handleSubmit} ref={formRef} className={styles.form}>

                {
                    firstStepForm()
                }
                {
                    submitErr.show &&
                    <p className={styles.submitErr}>{submitErr.msg}</p>
                }

                {btn()}



            </form>
        </div>
    )
}

export default Login;