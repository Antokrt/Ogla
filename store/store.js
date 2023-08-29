import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { createWrapper } from "next-redux-wrapper";
import { commentSlice } from "./slices/commentSlice";
import { modalSlice } from "./slices/modalSlice";
import { musicSlice } from "./slices/musicSlice";
import { notifSlice } from "./slices/notifSlice";
import { socketSlice } from "./slices/socketSlice";
import { themeSlice } from "./slices/themeSlice";
import { categorySlice } from "./slices/categorySlice";
import { darkenSlice } from "./slices/darkenSlice";
import {
    persistReducer,
    persistStore,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
    key: 'root',
    version: 1,
    storage,
    whitelist: ['theme', 'categories']
}

const rootReducer = combineReducers({
    [commentSlice.name]: commentSlice.reducer,
    [notifSlice.name]: notifSlice.reducer,
    [modalSlice.name]: modalSlice.reducer,
    [musicSlice.name]: musicSlice.reducer,
    [socketSlice.name]: socketSlice.reducer,
    [themeSlice.name]: themeSlice.reducer,
    [categorySlice.name]: categorySlice.reducer,
    [darkenSlice.name]: darkenSlice.reducer,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
    devTools: true,
})

export const persistor = persistStore(store)