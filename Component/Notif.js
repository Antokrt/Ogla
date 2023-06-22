import {useDispatch, useSelector} from "react-redux";
import {selectNotifStatus, setActiveModalNotif} from "../store/slices/notifSlice";
import {NotifModal} from "./Modal/NotifModal";
import React from "react";
import {BodyOverflowUtils} from "../utils/BodyUtils";

export const Notif = () => {
    const notifState = useSelector(selectNotifStatus);
    const dispatch = useDispatch();

    if (notifState) {
        BodyOverflowUtils('hidden');
        return (
            <NotifModal close={() => dispatch(setActiveModalNotif(false))} />
        )
    }
    else {
        BodyOverflowUtils('initial');
    }
}
