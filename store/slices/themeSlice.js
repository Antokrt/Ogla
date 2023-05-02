import { createSlice } from "@reduxjs/toolkit"
import { HYDRATE } from "next-redux-wrapper"

const initialState = {light: true}

export const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        changeTheme: (state) => {
            state.light = !state.light
        } 
    },
    extraReducers : {
        [HYDRATE]: (state, action) => {
            return {
                ...state,
                ...action.payload.light,
            }
        }
    }
});

export const {changeTheme} = themeSlice.actions;
export const selectTheme = (state) => state.theme.light;
export default themeSlice.reducer;