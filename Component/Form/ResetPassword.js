import styles from "../../styles/Pages/Form/ResetPassword.module.scss";
import {ArrowDownIcon} from "@heroicons/react/24/outline";
import Category from "../../json/category.json";
import {Capitalize} from "../../utils/String";

import scrollbar from "../../styles/utils/scrollbar.module.scss";
import {useSession, signIn, signOut} from "next-auth/react";
import React, {useEffect, useRef, useState} from "react";
import {router, useRouter} from "next/router";
import {SendNewPasswordWhenForgot} from "../../service/User/Password.service";
import {instance} from "../../service/config/Interceptor";
import {ReloadSession} from "../../utils/ReloadSession";
import ScreenSize from "../../utils/Size";
import {GetImgPathOfAssets} from "../../utils/ImageUtils";
import {GetApiPath} from "../../pages/api/utils/Instance";

const ResetPasswordForm = ({email, token, id}) => {

    const {data: session, status} = useSession();
    const formRef = useRef(null);
    const [newPassword, setNewPassword] = useState('');
    const [confPassword, setConfPassword] = useState('');
    const [submitErr, setSubmitErr] = useState({
        msg: "",
        show: false
    });
    const router = useRouter();
    const [width] = ScreenSize();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newPassword !== '' && newPassword === confPassword) {
            const data = {
                userId: id,
                token,
                email,
                newPassword
            }
            SendNewPasswordWhenForgot(data)
                .then(async () => {
                    await instance.get(GetApiPath() + '/api/auth/session?update-google-provider');
                })
                .then(() => ReloadSession())
                .then(() => router.replace({
                    pathname: '/auth',
                    query: 'login'
                }))

                .catch((err) => setSubmitErr({
                    msg: 'Impossible de modifier le mot de passe',
                    show: true
                }));
        }
    }

    return (
        <div className={styles.formContainer}>
            <div className={styles.leftBlock}>
                <div className={styles.container}>
                    <div className={styles.LogoHead}>
                        <h1 onClick={() => router.push("/")}> OGLA </h1>
                    </div>


                    <div className={styles.headerTwo}>
                        <h1>Modifier votre mot de passe</h1>

                    </div>

                    <form onSubmit={handleSubmit} ref={formRef} className={styles.form}>

                        <div className={styles.selectItem + " " + "fadeIn"}>
                            <label htmlFor={"password"}>Nouveau mot de passe</label>
                            <input type={"password"} onChange={(e) => setNewPassword(e.target.value)} name={"password"}
                                   placeholder={"Nouveau mot de passe"}></input>
                            <label htmlFor={"password"}>Confirmer le mot de passe</label>
                            <input type={"password"} onChange={(e) => setConfPassword(e.target.value)} name={"password"}
                                   placeholder={"Confirmer le mot de passe"}/>

                        </div>
                        {
                            submitErr.show &&
                            <p className={styles.submitErr + ' ' + styles.fadeIn}>{submitErr.msg}</p>
                        }

                        <div className={styles.stepBtnContainer}>
                            <button type={'submit'}
                                    className={confPassword === newPassword ? styles.newPassBtn : styles.disabledBtn + ' ' + styles.newPassBtn}>Modifier
                            </button>
                        </div>
                    </form>
                </div>

            </div>
            {
                width > 1000 &&
                <div className={styles.containerImg}>
                    <img alt={'Image Bannière Modifier Mot de passe Ogla'}
                         onError={(e) => e.target.src = '/assets/diapo/knight.png'}
                         src={GetImgPathOfAssets() + 'diapo/knight.png'}/>
                </div>
            }
        </div>
    )

}

export default ResetPasswordForm;