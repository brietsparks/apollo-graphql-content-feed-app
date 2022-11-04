import type { NextPage } from 'next'
import { addApolloState, initializeApollo, GetUsersDocument, GetTagsDocument, GetPostsDocument, GetImagesDocument, GetContentItemsDocument } from '~/apollo';

import { UserCreationFormWidget, UsersListWidget, TagCreationFormWidget, TagsListWidget, TagsCollectionFormWidget, PostCreationFormWidget, PostsListWidget, ImageCreationFormWidget, ImagesListWidget, ContentItemsListWidget } from '~/widgets';
import { HomePageLayout } from '~/views';

const Home: NextPage = () => {
  return (
    <HomePageLayout
      userCreationForm={<UserCreationFormWidget />}
      usersList={<UsersListWidget />}
      tagCreationForm={<TagCreationFormWidget />}
      tagsList={<TagsListWidget />}
      tagSearchBar={<TagsCollectionFormWidget />}
      postCreationForm={<PostCreationFormWidget />}
      postsList={<PostsListWidget />}
      imageCreationForm={<ImageCreationFormWidget />}
      imagesList={<ImagesListWidget />}
      contentItemsList={<ContentItemsListWidget />}
    />
  );
}

export async function getServerSideProps(context: any) {
  const client = initializeApollo()

  // ensure non-stale cache
  await client.resetStore();
  await client.clearStore();

  await Promise.all([
    client.query({
      query: GetUsersDocument,
      variables: {
        params: {}
      },
    }),
    client.query({
      query: GetTagsDocument,
      variables: {
        params: {
          pagination: {}
        }
      },
    }),
    client.query({
      query: GetPostsDocument,
      variables: {
        params: {
          pagination: {}
        }
      },
    }),
    client.query({
      query: GetImagesDocument,
      variables: {
        params: {
          pagination: {}
        }
      },
    }),
    client.query({
      query: GetContentItemsDocument,
      variables: {
        params: {
          pagination: {}
        }
      }
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
