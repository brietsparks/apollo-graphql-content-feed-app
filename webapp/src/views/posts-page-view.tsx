import React, { ComponentType, ReactNode, useState } from 'react';
import { Button } from '@mui/material';

export interface PostsPageProps {
  postCreationDialogComponent: ComponentType<PostCreationDialogComponentProps>;
  postsList: ReactNode;
}

export interface PostCreationDialogComponentProps {
  isOpen: boolean;
  close: () => void;
}

export function PostsPageView(props: PostsPageProps) {
  const { postCreationDialogComponent: PostCreationDialog } = props;

  const [creationDialogOpened, setCreationDialogOpened] = useState(false);

  return (
    <div>
      <div>
        <Button onClick={() => setCreationDialogOpened(true)}>Create Post</Button>
        {creationDialogOpened && (
          <PostCreationDialog
            isOpen={creationDialogOpened}
            close={() => setCreationDialogOpened(false)}
          />
        )}
      </div>
      <div>
        {props.postsList}
      </div>
    </div>
  );
}
