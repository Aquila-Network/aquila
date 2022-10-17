import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import { SessionProvider } from 'next-auth/react';

import { wrapper } from '../store';
import '../styles/globals.scss';
import { Session } from 'next-auth';
import InitComponent from '../components/hoc/InitComponent';

interface ApplicationProps {
  session: Session
}

function MyApp({ Component, pageProps: { session, ...rest} }: AppProps<ApplicationProps>) {
  const {store, props} = wrapper.useWrappedStore(rest);

  return (
    <SessionProvider session={session}>
      <Provider store={store}>
        <InitComponent>
          <Component {...props.pageProps} />
        </InitComponent>
      </Provider>
    </SessionProvider>
  );
}

export default MyApp;
