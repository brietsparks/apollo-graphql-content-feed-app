import type { NextPage } from 'next'
import { addApolloState, initializeApollo, GetUsersDocument } from '~/apollo';

import { CurrentUserContextProviderWidget, UserCreationFormWidget, UsersListWidget, TagCreationFormWidget, TagsCollectionFormWidget, PostCreationFormWidget } from '~/widgets';
import { HomePageLayout } from '~/views';

const Home: NextPage = () => {
  return (
    <CurrentUserContextProviderWidget>
      <HomePageLayout
        userCreationForm={<UserCreationFormWidget />}
        usersList={<UsersListWidget />}
        tagCreationForm={<TagCreationFormWidget />}
        tagSearchBar={<TagsCollectionFormWidget />}
        postCreationForm={<PostCreationFormWidget />}
      />
    </CurrentUserContextProviderWidget>
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
