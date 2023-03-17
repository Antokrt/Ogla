import '../styles/globals.scss';
import '../styles/editor.css';

import {SessionProvider} from "next-auth/react";
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {wrapper} from "../store/store";
import {Provider} from "react-redux";

function MyApp({Component, pageProps}) {

    const {store} = wrapper.useWrappedStore(pageProps);

    return (
        <SessionProvider session={pageProps.session}>
            <Provider store={store}>
                <Component {...pageProps} />
                <ToastContainer limit={3}/>
            </Provider>
        </SessionProvider>
    )
}

export default MyApp;
