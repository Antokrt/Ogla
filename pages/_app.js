import '../styles/globals.scss';
import LangueProvider from "../utils/context";
import {SessionProvider} from "next-auth/react";

function MyApp({ Component, pageProps }) {
  return (
      <SessionProvider session={pageProps.session}>
        <Component {...pageProps} />
      </SessionProvider>
  )
}

export default MyApp
