import type { NextPage } from 'next'
import { addApolloState, initializeApollo, GetUsersDocument, GetPostsDocument } from '~/apollo';

import { CurrentUserContextProviderWidget, UserCreationFormWidget, UsersListWidget, TagCreationFormWidget, TagsCollectionFormWidget, PostCreationFormWidget, PostsListWidget, ImageCreationFormWidget } from '~/widgets';
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
        postsList={<PostsListWidget />}
        imageCreationForm={<ImageCreationFormWidget />}
      />
    </CurrentUserContextProviderWidget>
  );
}

export async function getServerSideProps(context: any) {
  const client = initializeApollo()
  await Promise.all([
    client.query({
      query: GetUsersDocument,
      variables: {
        params: {}
      },
    }),
    client.query({
      query: GetPostsDocument,
      variables: {
        params: {
          pagination: {}
        }
      },
    })
  ]);

  const documentProps = addApolloState(
    client,
    { props: {} }, // { props: {...(await serverSideTranslations(locale, ['header', 'complaintList', 'footer']))}, }
  );

  // Will be passed to the page component as props
  return { props: documentProps.props }
}


export default Home;
