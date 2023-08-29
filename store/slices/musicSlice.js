import {createSlice} from "@reduxjs/toolkit";
import {HYDRATE} from "next-redux-wrapper";


const initialState = {
    active: false,
    index:Math.floor(Math.random() * 7) + 1
}

export const musicSlice = createSlice({
    name: 'music',
    initialState,
    reducers: {
        setActiveMusic: (state) => {
            state.active = !state.active
        },
        stopMusic:(state) => {
          state.active = false;
        },
        setIndexMusic:(state,action) => {
            if(state.index >= 7){
                state.index = 1;
            }
            else  state.index = action.payload;
        }
    },
    // extraReducers: {
    //     [HYDRATE]: (state, action) => {
    //         return {
    //             ...state,
    //             ...action.payload.active,
    //         };
    //     },
    // },
})

export const {setActiveMusic} = musicSlice.actions;
export const {setIndexMusic} = musicSlice.actions;
export const {stopMusic} = musicSlice.actions;
export const selectActiveMusicStatus = (state) => state.music.active;
export const selectIndexStateMusic = (state) => state.music.index;

export default musicSlice.reducer;
