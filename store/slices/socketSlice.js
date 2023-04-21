import { createSlice } from "@reduxjs/toolkit"
import { HYDRATE } from "next-redux-wrapper";

const initialState = {
    socketState: false,
}

export const socketSlice = createSlice({
    name: 'mySocket',
    initialState,
    reducers: {
        setActiveSocket: (state, action) => {
            state.socketState = action.payload
        }
    },
    extraReducers: {
        [HYDRATE]: (state, action) => {
            return {
                ...state,
                ...action.payload.socketState,
            }
        }
    }
})

export const {setActiveSocket} = socketSlice.actions;
export const selectSocketStatus = (state) => state.mySocket.socketState;
export default socketSlice.reducer;