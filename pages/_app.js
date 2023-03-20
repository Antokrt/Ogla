import '../styles/globals.scss';
import '../styles/editor.css';
import {SessionProvider, useSession} from "next-auth/react";
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {wrapper} from "../store/store";
import {Provider, useDispatch, useSelector} from "react-redux";
import {selectLoginModalStatus, setActiveModalState} from "../store/slices/modalSlice";
import {useState} from "react";
import {LoginModal} from "../Component/Modal/LoginModal";
import Banner from "../Component/Banner";
import LangueProvider, {LangueContext} from "../utils/context";

function MyApp({Component, pageProps}) {

    const {store} = wrapper.useWrappedStore(pageProps);

    return (
        <SessionProvider session={pageProps.session}>
                <Provider store={store}>
                    <LangueProvider>
                        <Modal/>
                        <Component {...pageProps} />
                        <ToastContainer limit={3}/>
                    </LangueProvider>
                </Provider>
        </SessionProvider>
    )
}

function Modal() {
    const modalState = useSelector(selectLoginModalStatus);
    const dispatch = useDispatch();
    const {data:session} = useSession();

    if(modalState && !session){
        return (
            <LoginModal close={() => dispatch(setActiveModalState(false))}/>
        )
    }
}


export default MyApp;
