import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import { SessionProvider } from 'next-auth/react';

import { store } from '../store';
import '../styles/globals.scss';
import { Session } from 'next-auth';

interface ApplicationProps {
  session: Session
}

function MyApp({ Component, pageProps: { session, ...pageProps} }: AppProps<ApplicationProps>) {
  return (
    <SessionProvider session={session}>
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    </SessionProvider>
  );
}

export default MyApp;
