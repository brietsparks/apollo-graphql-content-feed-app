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

