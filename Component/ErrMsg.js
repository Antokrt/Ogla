import styles from '../styles/Component/Err/Err.module.scss';
import {useRouter} from "next/router";
import {ArrowLeftIcon} from "@heroicons/react/24/solid";
import {ArrowLeftCircleIcon} from "@heroicons/react/24/outline";

export const ErrMsg = ({text,textBtn,click}) => {

    const router = useRouter();

    return (
        <div className={styles.container}>

            <img src={'/assets/jim/angry4.png'}/>
            <h4>Oups !</h4>
            <p>{text}</p>
            <button onClick={click} ><ArrowLeftCircleIcon/> {textBtn}</button>
        </div>
    )
}

export const ErrMsgOnChapter = ({text,textBtn,click}) => {

    const router = useRouter();

    return (
        <div className={styles.containerChapter}>

            <img src={'/assets/jim/angry4.png'}/>
            <h4>Oups !</h4>
            <p>{text}</p>
            <button onClick={click} > <ArrowLeftCircleIcon/> {textBtn}</button>
        </div>
    )
}