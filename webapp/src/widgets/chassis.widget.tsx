import React, { ReactNode } from 'react';
import Link from 'next/link';

export interface ChassisWidgetProps {
  children: ReactNode;
}

export function ChassisWidget(props: ChassisWidgetProps) {
  return (
    <div>
      <div style={{ display: 'flex', gap: 16 }}>
        <Link href="/">Home</Link>
        <Link href="/tags-page">Tags</Link>
        <Link href="/create-tag">Create Tag</Link>
        <Link href="/posts">Posts</Link>
        <Link href="/create-post">Create Post</Link>
      </div>

      <div>
        {props.children}
      </div>
    </div>
  );
}
