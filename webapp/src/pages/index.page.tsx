import type { NextPage, GetServerSideProps } from 'next'
import { useApolloClient } from '@apollo/client';

import { API_URL } from '~/config';
import { ApolloProvider, getApolloClient, GetUsersDocument } from '~/apollo';

import { UserCreationFormWidget, UsersListWidget } from '~/widgets';

const Home: NextPage = () => {
  return (
    <ApolloProvider url={API_URL}>
      <>
        <UserCreationFormWidget />
        <UsersListWidget />
      </>
    </ApolloProvider>
  );
}

export default Home;
