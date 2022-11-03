import type { AppProps as BaseAppProps } from 'next/app';
import {ApolloProvider} from '@apollo/client';
import { EmotionCache } from '@emotion/react';

import { createEmotionCache, MuiStylesProvider } from '~/styles';
import { useApollo } from '~/apollo';
import { ChassisWidget } from '~/widgets';

const clientSideEmotionCache = createEmotionCache();

interface AppProps extends BaseAppProps {
  emotionCache?: EmotionCache;
}

function App(props: AppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const apolloClient = useApollo(pageProps);

  return (
    <MuiStylesProvider emotionCache={emotionCache}>
      <ApolloProvider client={apolloClient}>
        <ChassisWidget>
          <Component {...pageProps} />
        </ChassisWidget>
      </ApolloProvider>
    </MuiStylesProvider>
  );
}

export default App;
