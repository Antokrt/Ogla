import {createSlice} from "@reduxjs/toolkit";
import {HYDRATE} from "next-redux-wrapper";

const initialState = {
    login: false,
}

export const modalSlice = createSlice({
    name: 'modal',
    initialState,
    reducers: {
        setActiveModalState: (state, action) => {
            state.login = action.payload
        }
    },
    // extraReducers: {
    //     [HYDRATE]: (state, action) => {
    //         return {
    //             ...state,
    //             ...action.payload.login,
    //         };
    //     },
    // },
})

export const {setActiveModalState} = modalSlice.actions;
export const selectLoginModalStatus = (state) => state.modal.login;
export default modalSlice.reducer;
