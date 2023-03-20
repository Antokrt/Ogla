import {configureStore} from "@reduxjs/toolkit";
import {createWrapper} from "next-redux-wrapper";
import {commentSlice} from "./slices/commentSlice";
import {modalSlice} from "./slices/modalSlice";

const makeStore = () =>
    configureStore({
        reducer:{
            [commentSlice.name]: commentSlice.reducer,
            [modalSlice.name]: modalSlice.reducer

        },
        devTools:true
    })

export const wrapper = createWrapper(makeStore);