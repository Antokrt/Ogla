import {useDispatch, useSelector} from "react-redux";
import {selectLoginModalStatus, setActiveModalState} from "../store/slices/modalSlice";
import {useSession} from "next-auth/react";
import {LoginModal} from "./Modal/LoginModal";
import React from "react";

export const AuthModal = () => {
    const modalState = useSelector(selectLoginModalStatus);
    const dispatch = useDispatch();
    const { data: session } = useSession();

    if (modalState && !session) {
        return (
            <LoginModal close={() => dispatch(setActiveModalState(false))} />
        )
    }
}