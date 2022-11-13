import { Table } from './table-util';
import { TableAliasHelper } from './table-alias-helper';

export const usersTable = new TableAliasHelper('users', {
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

export const imagesTable = new Table('images', {
  id: 'id',
  creationTimestamp: 'creation_timestamp',
  ownerId: 'owner_id',
  url: 'url',
  caption: 'caption',
});

export const tagsTable = new Table('tags', {
  id: 'id',
  creationTimestamp: 'creation_timestamp',
  name: 'name',
});

export const postTagsTable = new Table('post_tags', {
  id: 'id',
  creationTimestamp: 'creation_timestamp',
  postId: 'post_id',
  tagId: 'tag_id',
});

export const imageTagsTable = new Table('image_tags', {
  id: 'id',
  creationTimestamp: 'creation_timestamp',
  imageId: 'image_id',
  tagId: 'tag_id',
});

export const commentsTable = new Table('comments', {
  id: 'id',
  creationTimestamp: 'creation_timestamp',
  ownerId: 'owner_id',
  body: 'body',
});

export const commentCommentsTable = new Table('comment_comments', {
  id: 'id',
  parentCommentId: 'parent_comment_id',
  childCommentId: 'child_comment_id',
});

export const postCommentsTable = new Table('post_comments', {
  id: 'id',
  postId: 'post_id',
  commentId: 'comment_id',
});

export const imageCommentsTable = new Table('image_comments', {
  id: 'id',
  imageId: 'image_id',
  commentId: 'comment_id',
});
