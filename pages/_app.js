import '../styles/globals.scss';
import '../styles/editor.css';
import LangueProvider from "../utils/context";
import { SessionProvider } from "next-auth/react";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Provider } from 'react-redux';
import { wrapper } from '../utils/reducer/store';
// import SocketComponent from '../Component/useSocket'
import { useEffect } from 'react';
import  SocketProvider  from '../utils/context/socket';

function MyApp({ Component, pageProps }) {

  // const {store} = wrapper.useWrappedStore(pageProps);

  return (
    <SessionProvider session={pageProps.session} >
      <SocketProvider>
        {/* <Provider store={store} > */}
        {/* <SocketComponent /> */}
        <Component {...pageProps} />
        <ToastContainer limit={3} />
        {/* </Provider> */}
      </SocketProvider>
    </SessionProvider>
  )
}

export default MyApp
