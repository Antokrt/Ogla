import styles from "../../styles/Pages/Form/Login.module.scss";
import {useEffect, useState} from "react";
import Register from "../../Component/Form/Register";
import {useRouter} from "next/router";
import Login from "../../Component/Form/Login";
import {useSession} from "next-auth/react";
import ForgotPassword from "../../Component/Form/ForgotPassword";
import ResetPasswordForm from "../../Component/Form/ResetPassword";


export async function getServerSideProps({req,query}){

    if(!query.token || !query.email || !query.id){
        return {
            redirect: {
                permanent: false,
                destination: "/",
            },
        }
    }

    return {
        props:{
            ressources: query
        }
    }
}

const ResetPassword = ({ressources}) => {

    const router = useRouter();

        return (
            <div className={styles.container}>

                <div className={styles.purple}></div>

                <div className={styles.block}>
                    <div className={styles.imgContainer}>
                        <img src={"/assets/gon.png"}/>
                    </div>


                    <ResetPasswordForm
                        id={ressources.id}
                        email={ressources.email}
                    token={ressources.token}
                    />

                </div>

            </div>
        )
}
export default ResetPassword;