import {createSlice} from "@reduxjs/toolkit";
import {HYDRATE} from "next-redux-wrapper";

const initialState = {
    test: [
        {
            comment: 'Gojo looks nice. Excellent work amigo!',
            username: 'Saitama',
        },
        {
            comment: 'Catoru Sensei! Konnichiwa!',
            username: 'Yuji',
        },
    ],
};


export const commentSlice = createSlice({
    name: 'comments',
    initialState,
    reducers: {
        addComment: (state, action) => {
            state.test = [...state.test, action.payload];
        },
        editComment: (state, action) => {
            const {username, comment} = action.payload;
            const index = state.test.findIndex(item => item.username === username);
            if (index !== -1) {
                state.test[index].comment = comment;
            }
        }
    },

    extraReducers: {
        [HYDRATE]: (state, action) => {
            return {
                ...state,
                ...action.payload.comments
            }
        }
    }
})

export const {addComment, editComment} = commentSlice.actions;
export const selectComments = (state) => state.comments.test;
export default commentSlice.reducer;
