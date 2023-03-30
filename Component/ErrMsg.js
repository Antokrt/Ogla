import styles from '../styles/Component/Err/Err.module.scss';
import {useRouter} from "next/router";

const ErrMsg = ({text,textBtn,click}) => {

    const router = useRouter();

    return (
        <div className={styles.container}>

            <img src={'/assets/jim/angry4.png'}/>
            <h4>Oups !</h4>
            <p>{text}</p>
            <button onClick={click} >{textBtn}</button>
        </div>
    )
}

export default ErrMsg;