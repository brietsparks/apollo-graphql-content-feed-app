import { PostsListWidget, PostCreationFormDialogWidget } from '~/widgets';
import { addApolloState, GetPostsDocument, initializeApollo } from '~/apollo';
import { PostsPageView } from '~/views';

export interface PostsPageProps {
}

export default function PostsPage(props: PostsPageProps) {
  return (
    <PostsPageView
      postCreationDialogComponent={PostCreationFormDialogWidget}
      postsList={<PostsListWidget />}
    />
  );
}

export async function getServerSideProps(context: any) {
  const client = initializeApollo()
  await client.resetStore();
  await client.clearStore();

  await client.query({
    query: GetPostsDocument,
    variables: {
      params: {
        pagination: {}
      }
    },
  });

  const documentProps = addApolloState(client, { props: {} });

  return { props: documentProps.props }
}
