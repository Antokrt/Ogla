import styles from '../styles/Component/Err/Err.module.scss';
import {useRouter} from "next/router";

const ErrMsg = ({text}) => {

    const router = useRouter();

    return (
        <div className={styles.container}>

            <img src={'/assets/chara/chara6.png'}/>
            <h4>Oups !</h4>
            <p>{text}</p>
            <button onClick={() => router.push('/')}>Retour à l'accueil</button>
        </div>
    )
}

export default ErrMsg;