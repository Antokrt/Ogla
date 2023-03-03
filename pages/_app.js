import '../styles/globals.scss';
import '../styles/editor.css';

import LangueProvider from "../utils/context";
import {SessionProvider} from "next-auth/react";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function MyApp({ Component, pageProps }) {
  return (
      <SessionProvider session={pageProps.session}>
        <Component {...pageProps} />
			  <ToastContainer limit={3}/>
      </SessionProvider>
  )
}

export default MyApp
