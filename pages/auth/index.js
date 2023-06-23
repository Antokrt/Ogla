import styles from "../../styles/Pages/Form/Login.module.scss";
import {useEffect, useState} from "react";
import Register from "../../Component/Form/Register";
import {useRouter} from "next/router";
import Login from "../../Component/Form/Login";
import {useSession} from "next-auth/react";
import ForgotPassword from "../../Component/Form/ForgotPassword";
import {GetActiveMonthlyCateoryApi} from "../api/Category";
import {GetTopBooksOnHomeApi} from "../api/book";

export async function getServerSideProps() {


    const data = await fetch('http://127.0.0.1:3008/answer/');

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

        if(session && !session?.error){
            router.replace('/')
        }
        else {
            return (
                <div className={styles.container}>

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
}
export default Auth;