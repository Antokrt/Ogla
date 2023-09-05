import {createSlice} from "@reduxjs/toolkit";
import {HYDRATE} from "next-redux-wrapper";

const initialState = {
    infos: {
        activeId: null,
        title: null,
        author: {
            pseudo: null,
            provider: null,
            img: null,
        },
        type: null,
        filter: 'popular',
        ready: false,
        loading: false,
        pages: 1,
        nbComments: null,
        getMyComments: false,
        lastCommentId: [],
    },
    reportModal:{
        type:null,
        id:null,
        content:null
    },
    deleteModal:{
        type:null,
        id:null,
        content:null
    },
    err: {
        err: false,
        msg: null
    },
    comments: []
};


export const commentSlice = createSlice({
    name: 'comments',
    initialState,
    reducers: {
        addActiveId: (state, action) => {
            state.activeId = action.payload;
        },

        mountComment: (state, action) => {
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

        activeLoading: (state) => {
            state.infos.loading = true;
        },

        disableLoading: (state) => {
            state.infos.loading = false
        },

        setReady: (state) => {
            state.infos.ready = true
        },

        addMyComments: (state, action) => {
            if (action.payload) {
                state.comments = action.payload.concat(state.comments);
                state.infos.nbComments += 1;
            }
        },

        hasGetMyComments: (state) => {
            state.infos.getMyComments = true;
        },

        addComment: (state, action) => {
            if (action.payload) {
                state.comments.push(action.payload);
            }
        },

        getMoreAnswers: (state, action) => {
            if (action.payload) {
                const commentId = action.payload.commentId;
                const answersToAdd = action.payload.answers;
                const commentToSelect = state.comments.find((comment) => comment._id === commentId);
                if (answersToAdd.length === 0) {
                    commentToSelect.seeMoreAnswers = false;
                } else {
                    commentToSelect.answers = commentToSelect.answers.concat(answersToAdd);
                    commentToSelect.answersPage += 1;
                }
            } else {
                return null;
            }
        },


        likeAComment: (state, action) => {
            const commentId = action.payload;
            state.comments.forEach((item) => {
                if (commentId === item._id) {
                    if (item.hasLike) {
                        item.likes = item.likes - 1;
                    } else {
                        item.likes += 1;
                    }
                    item.hasLike = !item.hasLike;
                }
            })
        },

        likeOneAnswer: (state, action) => {
            const {commentId, id} = action.payload;
            const commentSelect = state.comments.find((comment) => comment._id === commentId);
            commentSelect.answers.forEach((answer) => {
                if(answer._id === id){
                    if(answer.hasLike){
                        answer.likes -= 1;
                    }
                    else {
                        answer.likes += 1;
                    }
                    answer.hasLike = !answer.hasLike;
                }
            })
        },

        addAnswer:(state,action) => {
            if(action.payload){
                const {commentId,data} = action.payload;
                const commentSelect = state.comments.find((comment) => comment._id === commentId);
                commentSelect.answers.unshift(data);
                commentSelect.nbAnswers += 1;
            }
        },

        deleteMyAnswer:(state,action) => {
            if(action.payload){
                const {commentId,answerId} = action.payload;
                const commentSelect = state.comments.find((comment) => comment._id === commentId);
                commentSelect.answers = commentSelect.answers.filter((answer) => answer._id !== answerId);
                commentSelect.nbAnswers -= 1;
            }
        },

        deleteMyComment: (state, action) => {
            if(action.payload){
                const id = action.payload;
                state.comments = state.comments.filter((comment) => comment._id !== id);
                state.infos.nbComments -= 1;
            }
        },

        cleanComments: (state, action) => {
            state.infos.getMyComments = false;
            state.infos.pages = 1;
            state.comments = [];
        },

        incrPages: (state) => {
            state.infos.pages += 1;
        },

        changePages: (state, action) => {
            state.infos.pages = action.payload;
        },

        setPopular: (state) => {
            state.infos.filter = 'popular'
        },

        setRecent: (state) => {
            state.infos.filter = 'recent'
        },

        activeReportModal:(state,action) => {
            if (!action.payload) return null;
            const validTypes = ['comment', 'answer'];
            if(!validTypes.includes(action.payload.type)) return null;
            state.reportModal = action.payload;
        },

        activeDeleteModal:(state,action) => {
            if(!action.payload) return null;
            const validTypes = ['comment', 'answer'];
            if(!validTypes.includes(action.payload.type)) return null;
            state.deleteModal = action.payload
        },

        disableModalReport:(state,action) => {
            for(let key in state.reportModal){
                state.reportModal[key] = null;
            }
        },

        disableDeleteModal:(state,action) => {
            for(let key in state.deleteModal){
                state.deleteModal[key] = null;
            }
        },

        throwAnErr: (state, action) => {
            const msg = action.payload;
            state.err.err = true;
            if (msg) {
                state.err.msg = msg;
            }
        },

        removeAnErr: (state) => {
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

export const {
    addComment,
    editComment,
    likeAComment,
    mountComment,
    activeLoading,
    getMoreAnswers,
    disableLoading,
    cleanInfos,
    likeOneAnswer,
    addActiveId,
    deleteMyComment,
    cleanComments,
    addMyComments,
    hasGetMyComments,
    activeDeleteModal,
    activeReportModal,
    disableDeleteModal,
    disableModalReport,
    setReady,
    addAnswer,
    deleteMyAnswer,
    incrPages,
    changePages,
    throwAnErr,
    removeAnErr,
    setPopular,
    setRecent
} = commentSlice.actions;


export const selectInfosComment = (state) => state.comments.infos;
export const selectComments = (state) => state.comments.comments;
export const selectAnswers = (state, commentId) => {
    const commentToSelect = state.comments.comments.find(comment => commentId === comment._id);
    return commentToSelect.answers;
};
export const selectAnswersPage = (state, commentId) => {
    const commentToSelect = state.comments.comments.find(comment => commentId === comment._id);
    return commentToSelect.answersPage;
}
export const selectReportModal = (state) => state.comments.reportModal;
export const selectDeleteModal = (state) => state.comments.deleteModal;
export const selectErrComments = (state) => state.comments.err;

export default commentSlice.reducer;
