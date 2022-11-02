import { gql } from 'graphql-request';

export const createUser = gql`
  mutation createUser($params: CreateUserParams!){
    createUser(params: $params) {
      id
      creationTimestamp
      name
    }
  }
`;

export const getUser = gql`
  query getUser($id: String!) {
    getUser(id: $id) {
      id
      creationTimestamp
      name
    }
  }
`;

export const createTag = gql`
  mutation createTag($params: CreateTagParams!){
    createTag(params: $params) {
      id
      creationTimestamp
      name
    }
  }
`;

export const getTag = gql`
  query getTag($id: String!) {
    getTag(id: $id) {
      id
      creationTimestamp
      name
    }
  }
`;

export const createPost = gql`
  mutation createPost($params: CreatePostParams!) {
    createPost(params: $params) {
      id
      creationTimestamp
      ownerId
      title
      body
    }
  }
`;

export const getPost = gql`
  query getPost($id: String!) {
    getPost(id: $id) {
      id
      creationTimestamp
      ownerId
      title
      body
    }
  }
`;

export const createPostComment = gql`
  mutation createComment($params: CreatePostCommentParams!) {
    createPostComment(params: $params) {
      id
      creationTimestamp
      ownerId
      body
    }
  }
`;

export const getComment = gql`
  query getComment($id: String!) {
    getComment(id: $id) {
      id
      creationTimestamp
      ownerId
      body
    }
  }
`;
