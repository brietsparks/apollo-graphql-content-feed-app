import { NextPage, GetServerSideProps } from 'next'
import { GetUsersDocument, GetTagsDocument, GetPostsDocument, GetImagesDocument, GetContentItemsDocument } from '~/apollo';
import { createApolloClient } from '~/apollo';

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

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const client = createApolloClient()
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

  return {
    props: client.injectState({})
  }
}


export default Home;
