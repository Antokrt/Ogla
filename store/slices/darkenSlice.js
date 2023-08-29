import {createSlice} from "@reduxjs/toolkit";
import {HYDRATE} from "next-redux-wrapper";

const initialState = {
    darken: false,
}

export const darkenSlice = createSlice({
    name: 'darken',
    initialState,
    reducers: {
        setDarkenState: (state, action) => {
            state.darken = action.payload;
        }
    },
    extraReducers: {
        [HYDRATE]: (state, action) => {
            return {
                ...state,
                ...action.payload.darken,
            };
        },
    },
})

export const {setDarkenState} = darkenSlice.actions;
export const selectDarkenState = (state) => state.darken.darken;
export default darkenSlice.reducer;
