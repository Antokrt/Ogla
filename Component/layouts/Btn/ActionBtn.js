import styles from '../../../styles/Layouts/Btn/ActionBtn.module.scss';
import {ArrowDownIcon, ArrowsUpDownIcon, CheckIcon, XMarkIcon} from "@heroicons/react/24/outline";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {selectActiveMusicStatus, selectIndexStateMusic, setActiveMusic} from "../../../store/slices/musicSlice";

export const CloseBtn = () => {
    return (
        <div className={styles.close}>
            <XMarkIcon/>
        </div>
    )
}

export const CheckBtn = () => {
    return (
        <div className={styles.check}>
            <CheckIcon/>
        </div>
    )
}

export const FilterBtn = ({filter, onclick}) => {
    return (
        <>
            {
                filter === 'recent' ?
                    <button onClick={onclick} className={styles.filter}>
                        Récent(s)
                        <ArrowsUpDownIcon/>
                    </button> :
                    <button onClick={onclick} className={styles.filter}>
                        Plus ancien(s)
                        <ArrowsUpDownIcon/>
                    </button>
            }
        </>

    )
}

export const FilterBtn3 = ({filter, onclick}) => {
    return (
        <>
            {
                filter === 'recent' ?
                    <button onClick={onclick} className={styles.filter}>
                        Récent(s)
                        <ArrowsUpDownIcon/>
                    </button> :
                    <button onClick={onclick} className={styles.filter}>
                        Populaire(s)
                        <ArrowsUpDownIcon/>
                    </button>
            }
        </>

    )
}

export const SeeMoreBtn = ({onclick}) => {
    return (

        <div className={styles.seeMore}>
            <button onClick={onclick}><ArrowDownIcon/></button>
        </div>

    )
}

export const TextSeeMore = ({onclick}) => {
    return <button className={styles.seeMoreText} onClick={onclick}>Voir plus</button>
}

export const HeadPhoneBtn = ({onclick}) => {

    const selectMusicState = useSelector(selectActiveMusicStatus);
    const selectIndex = useSelector(selectIndexStateMusic);

    const dispatch = useDispatch();

    return <div className={styles.headphone} onClick={() => dispatch(setActiveMusic(!selectMusicState))}>
        <svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 115.34 122.88">
            <path
                d="M97.74,119.52a2,2,0,0,1-.68-.12V65.93a2,2,0,0,1,.68-.12c3.34,0,6.43,5,8.48,7l-.46-12.12c0-12.8-3.72-23.11-9.68-30.93a7.37,7.37,0,0,1-5.86-2.23l-.68-.7C80.91,18.29,69,14.44,57.24,14.66S33.76,19.19,25.69,26.91l-.66.64a7.3,7.3,0,0,1-6.49,2.05c-6,7.84-9.75,18.21-9.75,31.14L8.33,74.63c2.25-2.71,6.34-8.66,10-8.82v53.71C10.52,119.36,4.91,107.05,3,101H0V60.74A57.33,57.33,0,0,1,12.83,24.57a7.35,7.35,0,0,1,1.8-7.36l1-.95C26.36,6,41.62.3,57,0s31.25,4.9,42.87,16.46l.91.93a7.33,7.33,0,0,1,1.74,7.2,57.34,57.34,0,0,1,12.81,36.13V101h-2.21c-1.89,6.14-7.54,18.57-15.39,18.57Zm-5.55,3.36h-9a3.48,3.48,0,0,1-3.48-3.47V65.65a3.49,3.49,0,0,1,3.48-3.48h9v60.71Zm-69-60.71H33a3.5,3.5,0,0,1,3.48,3.48v53.76A3.49,3.49,0,0,1,33,122.88H23.14V62.17Z"/>
        </svg>
        {
            !selectMusicState &&
            <span className={styles.disabled}>

            </span>
        }
    </div>

}