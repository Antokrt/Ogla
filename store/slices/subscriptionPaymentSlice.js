import {createSlice} from "@reduxjs/toolkit";
import {HYDRATE} from "next-redux-wrapper";

const initialState = {
    modal: false,
    infos:{
        userId:null,
        authorId:null,
        month_duration:null
    }
}

export const subscriptionPaymentSlice = createSlice({
    name: 'payment',
    initialState,
    reducers: {
        setActivePaymentModalState: (state, action) => {
            state.modal = action.payload
        },
        setInfosNewSub: (state, action) => {
            const { userId, authorId, month_duration } = action.payload;
console.log('jeyhye')
            if (!userId || !authorId || !month_duration) {
                return null;
            }

            state.infos = { userId, authorId, month_duration };
            state.modal = true;
        },

        closePayment: (state) => {
            state.modal = false;
            state.infos.userId = null;
            state.infos.authorId = null;
            state.infos.month_duration = null;
        }
    },

})

export const {setActivePaymentModalState} = subscriptionPaymentSlice.actions;
export const {setInfosNewSub} = subscriptionPaymentSlice.actions;
export const {closePayment} = subscriptionPaymentSlice.actions;
export const selectPaymentModalState = (state) => state.payment.modal;
export const selectInfosPaymentState = (state) => state.payment.infos;
export default subscriptionPaymentSlice.reducer;
