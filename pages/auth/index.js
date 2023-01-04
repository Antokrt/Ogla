import styles from "../../styles/Pages/Form/Login.module.scss";
import {useEffect, useState} from "react";
import Register from "../../Component/Form/Register";
import {useRouter} from "next/router";
import Login from "../../Component/Form/Login";
import {useSession} from "next-auth/react";


const Auth = () => {

    const {data: session, status} = useSession();
    const router = useRouter();
    const [query,setQuery] = useState(Object.keys(router.query)[0]);
    const [choice, setChoice] = useState("disable");

        useEffect(() => {
            if(router.isReady){
                if(query === "login" || query === "register"){
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

                    <div className={styles.purple}></div>

                    <div className={styles.block}>
                        <div className={styles.imgContainer}>
                            <img src={"/assets/gon.png"}/>
                        </div>

                        {
                            choice === "register" ?
                                <Register login={() => {
                                    setChoice("login");
                                    setQuery("login");
                                }}/>
                                :
                                <Login register={() => {
                                    setChoice("register");
                                    setQuery("register");

                                }}/>
                        }


                    </div>

                </div>
            )
        }


}
export default Auth;