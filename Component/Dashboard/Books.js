import styles from '../../../styles/Component/Dashboard/Books.module.scss';
import {useEffect} from "react";
import {BellAlertIcon, MagnifyingGlassIcon, PencilIcon, PlusIcon} from "@heroicons/react/24/outline";
import {useSession} from "next-auth/react";
import CardBook from "./Card/CardBook";
import DateNow from "../../utils/Date";
import SMSeachBar from "../SMSeachBar";



const Books = ({books}) => {

    const {data: session} = useSession();


    useEffect(() => {
        console.log(session)
    },[])

    const hasNoBooks = () => {
        return (
            <div className={styles.mainHasNoBooks}>
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


        )
    }


    return (
        <div className={styles.container}>

            <div className={styles.header}>
                <SMSeachBar width={40}/>
                <div className={styles.sBlock}>
                    <button className={styles.search}><BellAlertIcon className={styles.bell}/></button>
                    <button className={styles.addBtnHeader}> + Nouveau livre</button>
                </div>
            </div>
            {
                books.length !== 0 ?
                    <div className={styles.main}>
                        <div className={styles.headerMain}>
                            <div className={styles.f}>
                                <img src={session.user.image}/>
                                <div>
                                    <h5>Bienvenue <span>AntoninK1 !</span></h5>
                                    <p>Laissez votre imagination s'envoler...</p>
                                </div>
                            </div>

                            <div className={styles.s}>
                                <div className={styles.block}>
                                    <p>3</p>
                                    <span>livres</span>
                                </div>
                                <div className={styles.border}></div>
                                <div className={styles.block}>
                                    <p>15</p>
                                    <span>chapitres</span>
                                </div>
                            </div>
                        </div>
                        <div className={styles.booksContainer}>
                            <CardBook/>
                        </div>
                    </div>
                    :
                    hasNoBooks()
            }

        </div>
    )
}

export default Books;