import styles from '../../../styles/Layouts/Btn/ActionBtn.module.scss';
import {ArrowDownIcon, ArrowsUpDownIcon, CheckIcon, MusicalNoteIcon, XMarkIcon} from "@heroicons/react/24/outline";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {selectActiveMusicStatus, selectIndexStateMusic, setActiveMusic} from "../../../store/slices/musicSlice";
import {useRouter} from "next/router";
import {selectTheme} from '../../../store/slices/themeSlice';
import {useSession} from "next-auth/react";
import {setActiveModalState} from "../../../store/slices/modalSlice";

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

    const theme = useSelector(selectTheme);

    return (
        <>
            {
                filter === 'recent' ?
                    <button onClick={onclick} className={theme ? styles.filter : styles.filter + ' ' + styles.darkFilter}>
                        Récents
                        <ArrowsUpDownIcon/>
                    </button> :
                    <button onClick={onclick} className={theme ? styles.filter : styles.filter + ' ' + styles.darkFilter}>
                        Plus anciens
                        <ArrowsUpDownIcon/>
                    </button>
            }
        </>

    )
}

export const FilterBtn3 = ({filter, onclick}) => {

    const theme = useSelector(selectTheme);

    return (
        <>
            {
                filter === 'recent' ?
                    <button onClick={onclick} className={theme ? styles.filter : styles.filter + ' ' + styles.darkFilter}>
                        Récents
                        <ArrowsUpDownIcon/>
                    </button> :
                    <button onClick={onclick} className={theme ? styles.filter : styles.filter + ' ' + styles.darkFilter}>
                        Populaires
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
        <button className={theme ? styles.seeMoreText : styles.seeMoreText + ' ' + styles.dark} onClick={onclick}>Voir plus</button>
    )
}


export const HeadPhoneBtn = ({onclick}) => {

    const selectMusicState = useSelector(selectActiveMusicStatus);
    const selectIndex = useSelector(selectIndexStateMusic);
    const router = useRouter();
    const dispatch = useDispatch();
    const theme = useSelector(selectTheme);

    return <div
        className={router.pathname === '/' ? styles.headphone + ' ' + styles.home : theme ? styles.headphone : styles.darkHeadphone}
        onClick={() => dispatch(setActiveMusic())}>
        <MusicalNoteIcon/>
        {
            selectMusicState &&
            <div className={styles.animation}></div>
        }

    </div>

}

export const HeadPhoneBtnOnHeaderMain = ({onclick}) => {

    const selectMusicState = useSelector(selectActiveMusicStatus);
    const selectIndex = useSelector(selectIndexStateMusic);
    const router = useRouter();
    const dispatch = useDispatch();
    const theme = useSelector(selectTheme);

    return <div className={router.pathname === '/' && styles.headphoneMain} onClick={() => dispatch(setActiveMusic())}>
        <MusicalNoteIcon/>
        {
            selectMusicState &&
            <div className={styles.animationOnHeadPhoneMain}></div>
        }

    </div>

}

export const HeadPhoneBtnHeader = ({onclick}) => {

    const selectMusicState = useSelector(selectActiveMusicStatus);
    const dispatch = useDispatch();

    function change() {
        dispatch(setActiveMusic())
    }

    return <div className={styles.headphoneHeader}>
        <input type="checkbox" id="music" onChange={change} checked={!selectMusicState}/>
        <label htmlFor="music">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={styles.headPhone}>
                <path
                    d="M12 4C7.58172 4 4 7.58172 4 12H7C8.10457 12 9 12.8954 9 14V19C9 20.1046 8.10457 21 7 21H4C2.89543 21 2 20.1046 2 19V12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12V19C22 20.1046 21.1046 21 20 21H17C15.8954 21 15 20.1046 15 19V14C15 12.8954 15.8954 12 17 12H20C20 7.58172 16.4183 4 12 4ZM4 14V19H7V14H4ZM17 14V19H20V14H17Z"></path>
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={styles.off}>
                <path
                    d="M10 7.22056L6.60282 10.0001H3V14.0001H6.60282L10 16.7796V7.22056ZM5.88889 16.0001H2C1.44772 16.0001 1 15.5524 1 15.0001V9.00007C1 8.44778 1.44772 8.00007 2 8.00007H5.88889L11.1834 3.66821C11.3971 3.49335 11.7121 3.52485 11.887 3.73857C11.9601 3.8279 12 3.93977 12 4.05519V19.9449C12 20.2211 11.7761 20.4449 11.5 20.4449C11.3846 20.4449 11.2727 20.405 11.1834 20.3319L5.88889 16.0001ZM20.4142 12.0001L23.9497 15.5356L22.5355 16.9498L19 13.4143L15.4645 16.9498L14.0503 15.5356L17.5858 12.0001L14.0503 8.46454L15.4645 7.05032L19 10.5859L22.5355 7.05032L23.9497 8.46454L20.4142 12.0001Z"></path>
            </svg>
        </label>
    </div>
}

export const HeadPhoneBtnOnFooter = ({onclick}) => {

    const selectMusicState = useSelector(selectActiveMusicStatus);
    const selectIndex = useSelector(selectIndexStateMusic);
    const router = useRouter();
    const {data: session} = useSession();
    const dispatch = useDispatch();
    const theme = useSelector(selectTheme);


    if (session) {
        if(!session?.user?.settings?.music){
            return null;
        }
        else {
            return <div className={theme ? styles.headphoneOnFooterBook : styles.darkHeadphoneOnFooterBook}
                        onClick={() => dispatch(setActiveMusic(!selectMusicState))}>
                <MusicalNoteIcon/>
                {
                    selectMusicState &&
                    <div className={styles.animation}></div>
                }
            </div>
        }
    }
    else {
        return (
            <div className={theme ? styles.headphoneOnFooterBook : styles.darkHeadphoneOnFooterBook}
                 onClick={() => dispatch(setActiveModalState(true))}>
                <MusicalNoteIcon/>
            </div>
            )
    }
}