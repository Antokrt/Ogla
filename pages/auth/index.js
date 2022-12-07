import styles from "../../styles/Pages/Form/Login.module.scss";
import scrollbar from "../../styles/utils/scrollbar.module.scss";
import {useEffect, useState} from "react";
import {ArrowDownIcon} from "@heroicons/react/24/outline";
import {Capitalize} from "../../utils/String";
import Category from "../../json/category.json";
import Register from "../../Component/Form/Register";
import {useRouter} from "next/router";
import {getData, getPostByUser} from "../../services/Post";
import Login from "../../Component/Form/Login";


const Auth = () => {


    const [stepActiveForm, setStepActiveForm] = useState(1);
    const [activeText, setActiveText] = useState("Il nous faut peu de mots pour exprimer l’essentiel, il nous faut tous les mots pour le rendre réel...");
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
export default Auth;