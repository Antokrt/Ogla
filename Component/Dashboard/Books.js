import styles from '../../../styles/Component/Dashboard/Books.module.scss';
import {useEffect} from "react";
import {BellAlertIcon, MagnifyingGlassIcon, PencilIcon, PlusIcon} from "@heroicons/react/24/outline";



const Books = ({user,message}) => {

    useEffect(() => {
        console.log(message)
    },[message])

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h3>Mes livres <br/> <span>Bienvenue JJJ ! </span></h3>
                <div className={styles.sBlock}>
                    <button className={styles.search}><MagnifyingGlassIcon/></button>
                    <button className={styles.search}><BellAlertIcon className={styles.bell}/></button>
                    <button className={styles.addBtnHeader}> + Nouveau livre</button>
                </div>
            </div>
            <div className={styles.main}>
                <div className={styles.hasNotWriteContainer}>
                    <div>
                        <h3>OUPS <span>...</span></h3>
                        <p>Il n'y a pas encore de livres ici, mais ça ne veut pas dire que vous ne pouvez pas être le prochain Hemingway ou J.K. Rowling ! <br/> Commencez à écrire votre chef-d'œuvre dès maintenant !</p>
                        <h5>Quelques astuces pour bien débuter :</h5>
                        <ul>
                            <li>1. Écrire sur <span>OGLA</span></li>
                            <li>2. Choisir son image</li>
                            <li>3. Fidéliser ses lecteurs</li>

                        </ul>
                        <button>Nouveau livre <PencilIcon/></button>
                    </div>
                    <img src={'assets/chara/chara4.png'}/>

                </div>
            </div>
        </div>
    )
}

export default Books;