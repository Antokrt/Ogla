import styles from '../../../styles/Layouts/Btn/ActionBtn.module.scss';
import {ArrowDownIcon, ArrowsUpDownIcon, CheckIcon, MusicalNoteIcon, XMarkIcon} from "@heroicons/react/24/outline";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {selectActiveMusicStatus, selectIndexStateMusic, setActiveMusic} from "../../../store/slices/musicSlice";
import {useRouter} from "next/router";
import { selectTheme } from '../../../store/slices/themeSlice';

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
    const theme = useSelector(selectTheme)
    return (
        <button className={theme? styles.seeMoreText :styles.darkSeeMoreText} onClick={onclick}>Voir plus</button>
    )
}

export const HeadPhoneBtn = ({onclick}) => {

    const selectMusicState = useSelector(selectActiveMusicStatus);
    const selectIndex = useSelector(selectIndexStateMusic);
    const router = useRouter();
    const dispatch = useDispatch();
    const theme = useSelector(selectTheme);

    return <div className={router.pathname === '/' ? styles.headphone + ' ' + styles.home : theme? styles.headphone : styles.darkHeadphone} onClick={() => dispatch(setActiveMusic(!selectMusicState))}>
        <MusicalNoteIcon/>
        {
            selectMusicState &&
            <div className={styles.animation}></div>
        }

    </div>

}