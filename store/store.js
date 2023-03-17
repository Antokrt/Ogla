import {configureStore} from "@reduxjs/toolkit";
import {createWrapper} from "next-redux-wrapper";
import {commentSlice} from "./slices/commentSlice";

const makeStore = () =>
    configureStore({
        reducer:{
            [commentSlice.name]: commentSlice.reducer
        },
        devTools:true
    })

export const wrapper = createWrapper(makeStore);