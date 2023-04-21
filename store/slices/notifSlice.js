import {createSlice} from "@reduxjs/toolkit";
import {HYDRATE} from "next-redux-wrapper";

const initialState = {
    see: false,
    notifs: [],
}

export const notifSlice = createSlice({
    name: 'notif',
    initialState,
    reducers: {
        setActiveModalNotif: (state, action) => {
            state.see = action.payload
        },
        setAllNotifs: (state, action) => {
            state.notifs = action.payload
        },
        addNotif : (state, action) => {
            state.notifs.unshift(action.payload);
        },
        setOpen : (state) => {
            state.notifs.forEach((elem) => {
                if (!elem.open)
                    elem.open = true;
            });
        },
        setRead : (state, action) => {
            state.notifs.forEach((elem) => {
                if (elem._id === action.payload)
                    elem.read = true;
            });
        },
        deleteOne : (state, action) => {
            state.notifs.forEach((elem, index) => {
                if (elem._id === action.payload) {
                    state.notifs.splice(index, 1); 
                }
            })
        },
        allReadReducer : (state) => {
            state.notifs.forEach((elem) => {
                elem.read = true;
            })
        },
        allDel : (state) => {
            state.notifs.splice(0, state.notifs.length)
        }
    },
    extraReducers: {
        [HYDRATE]: (state, action) => {
            return {
                ...state,
                ...action.payload.see,
                ...action.payload.notifs,
            };
        },
    },
})

export const {setActiveModalNotif} = notifSlice.actions;
export const {setAllNotifs} = notifSlice.actions;
export const {addNotif} = notifSlice.actions;
export const {setOpen} = notifSlice.actions;
export const {setRead} = notifSlice.actions;
export const {deleteOne} = notifSlice.actions;
export const {allReadReducer} = notifSlice.actions;
export const {allDel} = notifSlice.actions;
export const selectNotifStatus = (state) => state.notif.see;
export const selectNotifs = (state) => state.notif.notifs;
export default notifSlice.reducer;
