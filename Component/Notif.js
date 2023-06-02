import {useDispatch, useSelector} from "react-redux";
import {selectNotifStatus, setActiveModalNotif} from "../store/slices/notifSlice";
import {NotifModal} from "./Modal/NotifModal";
import React from "react";

export const Notif = () => {
    const notifState = useSelector(selectNotifStatus);
    const dispatch = useDispatch();

    if (notifState) {
        if (typeof window !== 'undefined') {
            const body = document.querySelector('body');
            body.style.overflow = 'hidden';
        }
        return (
            <NotifModal close={() => dispatch(setActiveModalNotif(false))} />
        )
    }
    else {
        if (typeof window !== 'undefined') {
            const body = document.querySelector('body');
            body.style.overflow = 'initial';
        }
    }
}
