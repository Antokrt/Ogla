import styles from "../../styles/Pages/EntryChoice.module.scss";
import {useState} from "react";
import {router} from "next/router";

const EntryChoice = () => {

    const [value, setValue] = useState("Disable");

    const changeValue = (e) => {
        if (value === e) {
            setValue("Disable")
        } else {
            setValue(e);
        }
    }

    return (
        <div className={styles.container}>

            <h2>Rejoins la communauté d'OGLA</h2>

            <div className={styles.containerRadio}>
                <label onClick={() => changeValue("read")} htmlFor={"read"}
                       className={ value === "read" ? styles.upValid + " " + styles.item + " " + styles.fItem : styles.item + " " + styles.fItem}>
                    <img src={"/assets/entry/read.jpg"}/>
                    <h3>Je suis un <span>lecteur</span></h3>
                    <p>Découvrez une multitude d'oeuvre écrit par la communauté francaise...</p>
                    <input className={styles.radio} type="radio" name={"entry"} value={value}
                           checked={value === "read"}/>

                </label>

                <label onClick={() => {
                    changeValue("write")
                }} htmlFor={"write"}
                       className={ value === "write" ? styles.upValid + " " + styles.item + " " + styles.fItem : styles.item + " " + styles.fItem}>
                    <img src={"/assets/entry/write.jpg"}/>
                    <h3>Je suis un <span>auteur</span></h3>
                    <p>Rejoignez le cercle des écrivains d'OGLA et lancez votre carrière !</p>
                    <input className={styles.radio} type="radio" name={"entry"} value={value}
                           checked={value === "write"}/>
                </label>
            </div>

            <button
                onClick={() => router.push("/devenir-auteur/")}
                className={value === "Disable" ? styles.invalid + " " + styles.btn : styles.valid + " " + styles.btn}>C'est
                parti !
            </button>

        </div>
    )
}

export default EntryChoice;