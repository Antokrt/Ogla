import {createSlice} from "@reduxjs/toolkit";
import {HYDRATE} from "next-redux-wrapper";

const initialState = {
    categories:[]
}


export const categorySlice = createSlice({
    name: 'categories',
    initialState,
    reducers: {
        addCategory: (state, action) => {
          state.categories = [...action.payload];
        },
    },

    extraReducers: {
        [HYDRATE]: (state, action) => {
            return {
                ...state,
                ...action.payload.categories
            }
        }
    }
})

export const {addCategory} = categorySlice.actions;
export const selectCategories = (state) => state.categories.categories;
export default categorySlice.reducer;
