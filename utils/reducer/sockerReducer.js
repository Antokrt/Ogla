import { createSlice } from "@reduxjs/toolkit";
import { io } from "socket.io-client";

export const initialState = {
	socket: io('http://localhost:3008/notifications', {extraHeaders: {Authorization:"Bearer authorization_token_here"}}),
};

export const socketSlice = createSlice({
	name:'socket',
	initialState,
	reducers: {
		addSocket: (state, action) => {
			state.value = [...state.value, action.payload];
		},
	} 
})

export const { addSocket } = socketSlice.actions
export const { newSocket } = socketSlice.actions
export const socket = (state) => state.socket;
export default socketSlice.reducer;