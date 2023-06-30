import styles from "../../styles/Pages/Form/Login.module.scss";
import {useEffect, useState} from "react";
import Register from "../../Component/Form/Register";
import {useRouter} from "next/router";
import Login from "../../Component/Form/Login";
import {useSession} from "next-auth/react";
import ForgotPassword from "../../Component/Form/ForgotPassword";
import {GetActiveMonthlyCateoryApi} from "../api/Category";
import {GetTopBooksOnHomeApi} from "../api/book";
import Head from "next/head";

export async function getServerSideProps() {


    const data = await fetch('https://jsonplaceholder.typicode.com/todos/1');

    return {
        props: {
            test:2
        }
    }
}


const Auth = ({test}) => {

    const {data: session, status} = useSession();
    const router = useRouter();
    const [query,setQuery] = useState(Object.keys(router.query)[0]);
    const [choice, setChoice] = useState("disable");

        useEffect(() => {
            if (router.isReady) {
                if(query === "login" || query === "register" || query === 'forgotPassword'){
                    setChoice(query);
                }
                else{
                    setChoice('login')
                }
            }
        }, [router.isReady]);


            return (
                <div className={styles.container}>
                    <Head>
                        <title>Ogla - Authentification</title>
                        <meta name="description" content="Generated by create next app" />
                        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"/>
                        <link rel="icon" href="/favicon.ico" />
                    </Head>
                    <div className={styles.content}> 
                        {
                            choice === "register" &&
                            <Register login={() => {
                                setChoice("login");
                                setQuery("login");
                            }}/>
                        }
                        {
                            choice === "login" &&
                                <Login register={() => {
                                    setChoice("register");
                                    setQuery("register");
                                }}
                                forgotPassword={() => {
                                setChoice("forgotPassword");
                                setQuery("forgotPassword")
                                }
                                }
                                />
                        }
                        {
                            choice === "forgotPassword" &&
                            <ForgotPassword
                            login={() => {
                            setChoice("login");
                            setQuery("login");
                            }

                            }
                            />
                        }
                    </div>
                </div>
            )
}
export default Auth;