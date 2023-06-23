import {configureStore} from "@reduxjs/toolkit";
import {createWrapper} from "next-redux-wrapper";
import {commentSlice} from "./slices/commentSlice";
import {modalSlice} from "./slices/modalSlice";
import {musicSlice} from "./slices/musicSlice";
import {notifSlice} from "./slices/notifSlice";
import {socketSlice} from "./slices/socketSlice";
import {themeSlice} from "./slices/themeSlice";
import {categorySlice} from "./slices/categorySlice";
import {darkenSlice} from "./slices/darkenSlice";

const makeStore = () =>
    configureStore({
        reducer: {
            [commentSlice.name]: commentSlice.reducer,
            [notifSlice.name]: notifSlice.reducer,
            [modalSlice.name]: modalSlice.reducer,
            [musicSlice.name]: musicSlice.reducer,
            [socketSlice.name]: socketSlice.reducer,
            [themeSlice.name]: themeSlice.reducer,
            [categorySlice.name]: categorySlice.reducer,
            [darkenSlice.name]: darkenSlice.reducer
        },
        devTools: true
    })

export const wrapper = createWrapper(makeStore);