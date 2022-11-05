import { useRouter } from 'next/router';

import { PostCreationFormWidget } from '~/widgets';

export default function CreatePostPage() {
  const router = useRouter();
  return (
    <PostCreationFormWidget
      onSuccess={() => router.push('/posts')}
    />
  );
}
