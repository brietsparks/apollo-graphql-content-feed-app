import { TableAliasHelper } from '~/lib/knex';

export const usersTable = new TableAliasHelper('users', {
  id: 'id',
  name: 'name',
  creationTimestamp: 'creation_timestamp',
});

export const postsTable = new TableAliasHelper('posts', {
  id: 'id',
  creationTimestamp: 'creation_timestamp',
  ownerId: 'owner_id',
  title: 'title',
  body: 'body',
});

export const imagesTable = new TableAliasHelper('images', {
  id: 'id',
  creationTimestamp: 'creation_timestamp',
  ownerId: 'owner_id',
  url: 'url',
  caption: 'caption',
});

export const tagsTable = new TableAliasHelper('tags', {
  id: 'id',
  creationTimestamp: 'creation_timestamp',
  name: 'name',
});

export const postTagsTable = new TableAliasHelper('post_tags', {
  id: 'id',
  creationTimestamp: 'creation_timestamp',
  postId: 'post_id',
  tagId: 'tag_id',
});

export const imageTagsTable = new TableAliasHelper('image_tags', {
  id: 'id',
  creationTimestamp: 'creation_timestamp',
  imageId: 'image_id',
  tagId: 'tag_id',
});

export const commentsTable = new TableAliasHelper('comments', {
  id: 'id',
  creationTimestamp: 'creation_timestamp',
  ownerId: 'owner_id',
  body: 'body',
});

export const commentCommentsTable = new TableAliasHelper('comment_comments', {
  id: 'id',
  parentCommentId: 'parent_comment_id',
  childCommentId: 'child_comment_id',
});

export const postCommentsTable = new TableAliasHelper('post_comments', {
  id: 'id',
  postId: 'post_id',
  commentId: 'comment_id',
});

export const imageCommentsTable = new TableAliasHelper('image_comments', {
  id: 'id',
  imageId: 'image_id',
  commentId: 'comment_id',
});
