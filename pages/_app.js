import '../styles/globals.scss';
import '../styles/editor.css';
import '../styles/tippy.css';
import { SessionProvider, useSession } from "next-auth/react";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { wrapper } from "../store/store";
import { Provider, useDispatch, useSelector } from "react-redux";
import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Notif } from "../Component/Notif";
import { Modal } from "../Component/Modal";
import { Socket } from "../socket/Socket";
import { GetCategories } from "../categories/Categories";
import { Maintenance } from "../Component/Maintenance";
import { persistor, store } from '../store/store';
import { PersistGate } from 'redux-persist/integration/react';

const DynamicHeader = dynamic(() => import('../Component/Lofi'), { ssr: false })


function MyApp({ Component, pageProps }) {

    // const { store } = wrapper.useWrappedStore(pageProps);

    if (process.env.maintenance) {
        return (<Maintenance />)
    }
    return (
        <SessionProvider session={pageProps.session}>
            <Provider store={store}>
                <PersistGate loading={<div style={{
                    width: "100%",
                    height: "100vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: "35px",
                }}> OGLA </div>} persistor={persistor}>
                    <Notif />
                    <Modal />
                    <Component {...pageProps} />
                    <Socket />
                    <ToastContainer toastStyle={{
                        fontFamily: 'Poppins',
                        fontSize: "12px"
                    }} limit={3} />
                    <DynamicHeader />
                    <GetCategories />
                </PersistGate>
            </Provider>
        </SessionProvider>
    )
}

export default MyApp;
