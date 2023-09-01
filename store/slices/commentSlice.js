import {createSlice} from "@reduxjs/toolkit";
import {HYDRATE} from "next-redux-wrapper";

const initialState = {
    infos:{
        activeId:null,
        title:null,
        author: {
            pseudo:null,
            provider:null,
            img:null,
        },
        type:null,
        filter:'popular',
        ready:false,
        loading:false,
        pages:1,
        nbComments:null,
        err:false,
        getMyComments:false,
        lastCommentId:[]
    },
    comments:[]
};


export const commentSlice = createSlice({
    name: 'comments',
    initialState,
    reducers: {
        addActiveId: (state,action) => {
          state.activeId = action.payload;
        },

        mountComment:(state,action) => {
            const data = {...action.payload};
            state.infos.activeId = data.activeId;
            state.infos.title = data.title;
            state.infos.author = data.author;
            state.infos.type = data.type;
            state.infos.loading = false;
            state.infos.nbComments = data.nbComments;
        },



        activeLoading:(state) => {
          state.infos.loading = true;
        },

        disableLoading:(state) => {
            state.infos.loading = false
        },

        setReady:(state) => {
            state.infos.ready = true
        },

        addMyComments:(state,action) => {
            if(action.payload){
                state.comments = action.payload.concat(state.comments);
            }
        },

        hasGetMyComments:(state) => {
          state.infos.getMyComments = true;
        },

        addComment: (state, action) => {
            if(action.payload){
                state.comments.push(action.payload);
            }
        },

        cleanComments:(state,action) => {
            state.infos.getMyComments = false;
            state.infos.pages = 1;
            state.comments = [];
        },

        incrPages:(state) => {
            state.infos.pages += 1;
        },

        changePages: (state,action) => {
            state.infos.pages = action.payload;
        },

        setPopular: (state) => {
            state.infos.filter = 'popular'
        },

        setRecent:(state) => {
            state.infos.filter = 'recent'
        },

        throwAnErr:(state) => {
            state.infos.err = true;
        },

        removeAnErr:(state) => {
            state.infos.err = false;
        },

        editComment: (state, action) => {
            const {username, comment} = action.payload;
            const index = state.test.findIndex(item => item.username === username);
            if (index !== -1) {
                state.test[index].comment = comment;
            }
        }
    },

    // extraReducers: {
    //     [HYDRATE]: (state, action) => {
    //         return {
    //             ...state,
    //             ...action.payload.comments
    //         }
    //     }
    // }
})

export const {addComment, editComment,mountComment,activeLoading,disableLoading,addActiveId, cleanComments,addMyComments, hasGetMyComments,setReady,incrPages,changePages,throwAnErr,removeAnErr,setPopular,setRecent} = commentSlice.actions;
export const selectInfosComment = (state) => state.comments.infos;
export const selectComments = (state) => state.comments.comments;

export default commentSlice.reducer;
