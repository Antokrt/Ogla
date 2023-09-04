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
        getMyComments:false,
        lastCommentId:[],
    },
    err:{
        err:false,
        msg:null
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

        cleanInfos: (state) => {
            state.infos = initialState.infos;
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

        likeAComment:(state,action) => {
            const commentId = action.payload;
            state.comments.forEach((item) => {
                if(commentId === item._id){
                    if(item.hasLike){
                        item.likes = item.likes - 1;
                    }
                    else {
                        item.likes += 1;
                    }
                    item.hasLike = !item.hasLike;
                }
            })
        },

        deleteMyComment:(state,action) => {
            const id = action.payload;
            state.comments = state.comments.filter((comment) => comment._id !== id);
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

        throwAnErr:(state,action) => {
            const msg = action.payload;
            state.err.err = true;
            if(msg){
                state.err.msg = msg;
            }
        },

        removeAnErr:(state) => {
            state.err.err = false;
            state.err.msg = null;
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

export const {addComment, editComment,likeAComment,mountComment,activeLoading,disableLoading,cleanInfos,addActiveId, deleteMyComment, cleanComments,addMyComments, hasGetMyComments,setReady,incrPages,changePages,throwAnErr,removeAnErr,setPopular,setRecent} = commentSlice.actions;
export const selectInfosComment = (state) => state.comments.infos;
export const selectComments = (state) => state.comments.comments;
export const selectErrComments = (state) => state.comments.err;

export default commentSlice.reducer;
