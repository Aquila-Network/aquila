import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import { SessionProvider } from 'next-auth/react';
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { wrapper } from '../store';
import '../styles/globals.scss';
import { Session } from 'next-auth';
import InitComponent from '../components/hoc/InitComponent';
import BaseLayout from '../components/layout/base/baseLayout';

interface ApplicationProps {
  session: Session
}

function MyApp({ Component, pageProps: { session, ...rest} }: AppProps<ApplicationProps>) {
  const {store, props} = wrapper.useWrappedStore(rest);

  return (
    <SessionProvider session={session}>
      <ToastContainer />
      <Provider store={store}>
        <InitComponent>
          <BaseLayout>
            <Component {...props.pageProps} />
          </BaseLayout>
        </InitComponent>
      </Provider>
    </SessionProvider>
  );
}

export default MyApp;
