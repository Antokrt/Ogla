import '../styles/globals.scss';
import '../styles/editor.css';
import '../styles/tippy.css';
import { SessionProvider, useSession } from "next-auth/react";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { wrapper } from "../store/store";
import { Provider, useDispatch, useSelector } from "react-redux";
import { selectLoginModalStatus, setActiveModalState } from "../store/slices/modalSlice";
import React, { useEffect, useRef, useState } from "react";
import { LoginModal } from "../Component/Modal/LoginModal";

import SocketProvider, { SocketContext } from '../utils/context/socket';
import YouTube from "react-youtube";
import { selectActiveMusicStatus, selectIndexStateMusic, setIndexMusic } from "../store/slices/musicSlice";
import { selectNotifStatus, setActiveModalNotif, setAllNotifs, selectNotifs, addNotif } from "../store/slices/notifSlice";
import { NotifModal } from "../Component/Modal/NotifModal";
import { useContext } from 'react';
import { io } from "socket.io-client";
import { selectSocketStatus, setActiveSocket } from '../store/slices/socketSlice';
import notifSlice from '../store/slices/notifSlice';
import { useCallback } from 'react';
import {addCategory, selectCategories} from "../store/slices/categorySlice";
import axios from "axios";
import {instance} from "../service/config/Interceptor";
import {toastDisplayInfo} from "../utils/Toastify";
import dynamic from "next/dynamic";
import {Notif} from "../Component/Notif";
import {Modal} from "../Component/Modal";
import {Socket} from "../socket/Socket";
import {GetCategories} from "../categories/Categories";
import {Maintenance} from "../Component/Maintenance";

const DynamicHeader = dynamic(() => import('../Component/Lofi'),{ssr:false})


function MyApp({ Component, pageProps }) {

    const { store } = wrapper.useWrappedStore(pageProps);

    if(process.env.maintenance){
        return (<Maintenance/>)
    }

    return (
        <SessionProvider session={pageProps.session}>
            <Provider store={store}>
                <Notif />
                <Modal />
                <Component {...pageProps} />
                <Socket />
                <ToastContainer toastStyle={{
                    fontFamily:'Poppins',
                }} limit={3} />
                <DynamicHeader/>
                <GetCategories/>
            </Provider>
        </SessionProvider>
    )
}

export default MyApp;
