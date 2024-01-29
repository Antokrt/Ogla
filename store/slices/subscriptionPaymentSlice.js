import {createSlice} from "@reduxjs/toolkit";
import {HYDRATE} from "next-redux-wrapper";

const initialState = {
    modal: false,
    infos:{
        userId:null,
        authorId:null,
        authorImg:null,
        authorPseudo:null
    }
}

export const subscriptionPaymentSlice = createSlice({
    name: 'payment',
    initialState,
    reducers: {
        setActivePaymentModalState: (state, action) => {
            if(action.payload) state.modal = action.payload
        },
        setInfosNewSub: (state, action) => {
            const { userId, authorId, authorImg,authorPseudo } = action.payload;
            if (!userId || !authorId) {
                return null;
            }

            state.infos = { userId, authorId, authorImg,authorPseudo };
        },

        closePayment: (state) => {
            state.modal = false;
            state.infos.userId = null;
            state.infos.authorId = null;
            state.infos.pseudo = null;
        }
    },

})

export const {setActivePaymentModalState} = subscriptionPaymentSlice.actions;
export const {setInfosNewSub} = subscriptionPaymentSlice.actions;
export const {closePayment} = subscriptionPaymentSlice.actions;
export const selectPaymentModalState = (state) => state.payment.modal;
export const selectInfosPaymentState = (state) => state.payment.infos;
export default subscriptionPaymentSlice.reducer;
