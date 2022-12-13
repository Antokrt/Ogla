import styles from "../../styles/Pages/Form/Login.module.scss";
import {ArrowDownIcon} from "@heroicons/react/24/outline";
import Category from "../../json/category.json";
import {Capitalize} from "../../utils/String";
import {useState} from "react";


const Register = ({login}) => {

    const [stepActiveForm, setStepActiveForm] = useState(1);
    const [errItem,setErrItem] = useState({
        email:{
            msg:"Veuillez rentrer une adresse mail valide",
            show:false
        },
        password:{
            msg:"5 caractères minimum 1 chiffre et un symbole",
            show:false
        },
        confirmPassWord:{
            msg:"Les mots de passe ne correspondent pas",
            show:false
        },
        pseudo:{
            msg:'Votre pseudo doit contenir plus de 3 caractères',
            show:false
        },
    });
    const [submitErr, setSubmitErr] = useState({
        msg:"Erreur lors de l'envoi du formulaire",
        show:false
    })

    const [email , setEmail] = useState('');
    const [pseudo , setPseudo] = useState('');
    const [password , setPassword] = useState('');
    const [confPassword , setConfPassword] = useState('');
    const [genres , setGenres] = useState('');


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


    const firstStepForm = () => {
        return (
            <div className={styles.selectItem + " " + "fadeIn"}>

                <label htmlFor={"email"}>Email</label>
                {errItem.email.show &&  errMsgItem(errItem.email.msg)}
                <input type={"email"} value={email} onChange={(e) => setEmail(e.target.value)} name={"email"} placeholder={"Email"}/>
                <label htmlFor={"password"}>Mot de passe</label>
                {errItem.password.show &&  errMsgItem(errItem.password.msg)}
                <input onChange={(e) => setPassword(e.target.value) } type={"password"} name={"password"} value={password} placeholder={"Mot de passe"}/>
                <label htmlFor={"confirmPassword"}>Confirmez votre mot de passe</label>
                {errItem.confirmPassWord.show &&  errMsgItem(errItem.confirmPassWord.msg)}
                <input onChange={(e) => setConfPassword(e.target.value)} value={confPassword} type={"password"} className={styles.date} placeholder={"Confirmez votre mot de passe"}
                       name={"confirmPassword"}/>
                {loginLink()}
            </div>
        )
    }

    const secondStepForm = () => {
        return (
            <div className={styles.selectItem + " " + "fadeIn"}>
                <label htmlFor={"pseudo"}>Pseudo</label>
                {errItem.pseudo.show &&  errMsgItem(errItem.pseudo.msg)}
                <input type={"text"} value={pseudo} onChange={(e)=> setPseudo(e.target.value)} name={"pseudo"} placeholder={"Pseudo"}/>
                <label htmlFor={"genres"}>Genre favoris</label>
                <div className={styles.selectCategory}>
                    <ArrowDownIcon/>
                    <select name="genres" id="pet-select">
                        {
                            Category.category.map((item) => {
                                return (
                                    // eslint-disable-next-line react/jsx-key
                                    <option value={Capitalize(item.name)}>{Capitalize(item.name)}</option>
                                )
                            })
                        }
                        <option value={"none"}>Pas de préférence</option>
                    </select>
                </div>
                {loginLink()}
            </div>
        )
    }

    const displayForm = (param) => {
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

    const onSubmit = (e) => {
        e.preventDefault()
        const object = { a: 1, b: 2, c: 3 };
        const formData = {
            pseudo:pseudo.toString(),
            email:email.toString(),
            password:password.toString(),
            confPassword:confPassword.toString(),
        }
        const keys = Object.keys(formData);
        for (const key of keys) {
            const val = formData[key];
            if(val === ''){
                setSubmitErr(prevState => ({
                    show: true,
                    msg: "Tous les champs n'ont pas été remplis correctement!"
                }))
            }
            else{
                switch (key){
                    case 'pseudo':
                        if(val.length < 3){
                            setErrItem(prevState => ({
                                ...prevState,
                                pseudo:{
                                    show:true,
                                    msg: 'Votre pseudo doit contenir plus de 3 caractères'
                                }
                            }))
                        }

                        if(val.length < 50){
                            setErrItem(prevState => ({
                                ...prevState,
                                pseudo:{
                                    show:true,
                                    msg: 'Votre pseudo doit contenir moins de 15 caractères'
                                }
                            }))
                        }
                }
            }

        }
    }

    const btn = () => {
        return (
            <div className={styles.stepBtnContainer}>
                {
                    stepActiveForm !== 1 &&
                    <span className={styles.stepBtn + " " + styles.pre} onClick={() => {
                        setSubmitErr(submitErr.show === true);
                        setStepActiveForm(stepActiveForm - 1)
                    }}>Précédent</span>
                }


                <button type={'submit'} className={styles.stepBtn}>S'inscrire</button>

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
        <div className={styles.formContainer}>

            <div className={styles.header}>
                <h1>Rejoins nous !</h1>
                <p> Ogla est une plateforme d’écriture et de lecture de livres, d’histoires ou de romans ouverte à tous. Nous voulons que vous vous assuriez que personne ne puisse jamais vous empêcher d’écrire votre histoire parce que nous croyons au pouvoir des mots.
                </p>
            </div>

            <form onSubmit={onSubmit} className={styles.form}>
                {
                    submitErr.show &&
                    <p className={styles.submitErr}>{submitErr.msg}</p>
                }
                {
                    displayForm(stepActiveForm)
                }

                {
                    stepActiveForm !== 2 ?
                        nextPreviousBtn()
                        :
                        btn()
                }




            </form>
        </div>
    )
}

export default Register;