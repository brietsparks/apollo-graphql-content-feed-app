import React, { ReactNode } from 'react';

export interface PostsPageProps {
  postsList: ReactNode;
}

export function PostsPage(props: PostsPageProps) {

  return (
    <div>
      <div>

      </div>

      <div>
        {props.postsList}
      </div>
    </div>
  );
}
