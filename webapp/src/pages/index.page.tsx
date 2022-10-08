import type { NextPage } from 'next'
import { addApolloState, initializeApollo, GetUsersDocument } from '~/apollo';

import { UserCreationFormWidget, UsersListWidget, TagCreationFormWidget } from '~/widgets';

const Home: NextPage = () => {
  return (
    <>
      <UserCreationFormWidget />
      <UsersListWidget />
      <TagCreationFormWidget />
    </>
  );
}

export async function getServerSideProps(context: any) {
  const client = initializeApollo()
  await client.query({
    query: GetUsersDocument,
    variables: {
      params: {}
    },
  });

  const documentProps = addApolloState(
    client,
    { props: {} }, // { props: {...(await serverSideTranslations(locale, ['header', 'complaintList', 'footer']))}, }
  );

  // Will be passed to the page component as props
  return { props: documentProps.props }
}


export default Home;
