import {createSlice} from "@reduxjs/toolkit";
import {HYDRATE} from "next-redux-wrapper";


const initialState = {
    see: false,
}

export const notifSlice = createSlice({
    name: 'notif',
    initialState,
    reducers: {
        setActiveModalNotif: (state, action) => {
            state.see = action.payload
        }
    },
    extraReducers: {
        [HYDRATE]: (state, action) => {
            return {
                ...state,
                ...action.payload.see,
            };
        },
    },
})

export const {setActiveModalNotif} = notifSlice.actions;
export const selectNotifStatus = (state) => state.notif.see;
export default notifSlice.reducer;
