import { table } from './util';
import { Table } from './table-util';

export const usersTable = table('users', {
  id: 'id',
  name: 'name',
  creationTimestamp: 'creation_timestamp',
});

export const postsTable = new Table('posts', {
  id: 'id',
  creationTimestamp: 'creation_timestamp',
  ownerId: 'owner_id',
  title: 'title',
  body: 'body',
});

export const imagesTable = table('images', {
  id: 'id',
  creationTimestamp: 'creation_timestamp',
  ownerId: 'owner_id',
  url: 'url',
  caption: 'caption',
});

export const tagsTable = table('tags', {
  id: 'id',
  creationTimestamp: 'creation_timestamp',
  name: 'name',
});

export const postTagsTable = table('post_tags', {
  id: 'id',
  creationTimestamp: 'creation_timestamp',
  postId: 'post_id',
  tagId: 'tag_id',
});

export const imageTagsTable = table('image_tags', {
  id: 'id',
  creationTimestamp: 'creation_timestamp',
  imageId: 'image_id',
  tagId: 'tag_id',
});
