import styles from '../styles/Component/Darken.module.scss';
import anim from '../styles/utils/anim.module.scss';
import {useDispatch, useSelector} from "react-redux";
import {selectDarkenState, setDarkenState} from "../store/slices/darkenSlice";
import ScreenSize from "../utils/Size";
import {useEffect} from "react";
import {useRouter} from "next/router";

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