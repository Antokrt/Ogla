import styles from '../styles/Component/Darken.module.scss';
import anim from '../styles/utils/anim.module.scss';
import {useSelector} from "react-redux";
import {selectDarkenState} from "../store/slices/darkenSlice";
import ScreenSize from "../utils/Size";

export const Darken = () => {
    const isDarken = useSelector(selectDarkenState);
    const [width] = ScreenSize();


    if(isDarken && width <= 950){
        return (
            <div className={styles.container + ' ' + anim.fadeIn}>

            </div>
        )
    }
    else return <></>;


}