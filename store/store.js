import {configureStore} from "@reduxjs/toolkit";
import {createWrapper} from "next-redux-wrapper";
import {commentSlice} from "./slices/commentSlice";
import {modalSlice} from "./slices/modalSlice";
import {musicSlice} from "./slices/musicSlice";
import {notifSlice} from "./slices/notifSlice";

const makeStore = () =>
    configureStore({
        reducer: {
            [commentSlice.name]: commentSlice.reducer,
            [notifSlice.name]: notifSlice.reducer,
            [modalSlice.name]: modalSlice.reducer,
            [musicSlice.name]: musicSlice.reducer
        },
        devTools: true
    })

export const wrapper = createWrapper(makeStore);