import {createSlice} from "@reduxjs/toolkit";
import {HYDRATE} from "next-redux-wrapper";


const initialState = {
    active: false,
    index:1
}

export const musicSlice = createSlice({
    name: 'music',
    initialState,
    reducers: {
        setActiveMusic: (state, action) => {
            state.active = action.payload
        },
        setIndexMusic:(state,action) => {
            if(state.index >= 2){
               return  state.index = 1;
            }
            else  state.index = action.payload;
        }
    },
    extraReducers: {
        [HYDRATE]: (state, action) => {
            return {
                ...state,
                ...action.payload.active,
            };
        },
    },
})

export const {setActiveMusic} = musicSlice.actions;
export const {setIndexMusic} = musicSlice.actions;

export const selectActiveMusicStatus = (state) => state.music.active;
export const selectIndexStateMusic = (state) => state.music.index;

export default musicSlice.reducer;
