import { MutationUpdaterFunction as BaseMutationUpdaterFunction, DefaultContext, ApolloCache } from '@apollo/client';

import { ArrayElement } from '../util/types';

import * as generated from './generated';
import { apolloCache } from './apollo-cache';

export type GetUsersQueryItem = ArrayElement<generated.GetUsersQuery['getUsers']['items']>;

type MutationUpdaterFunction<TData, TVariables> = BaseMutationUpdaterFunction<TData, TVariables, DefaultContext, ApolloCache<typeof apolloCache>>;

export const createUserMutationUpdate: MutationUpdaterFunction<generated.CreateUserMutation, generated.CreateUserMutationVariables> = (cache, { data }) => {
  cache.modify({
    fields: {
      getUsers(existing: generated.GetUsersQuery['getUsers'], { toReference }) {
        if (data) {
          const newUser = toReference({
            __typename: data.createUser.__typename,
            id: data.createUser.id
          });

          return {
            items: [newUser, ...existing.items],
            cursors: existing.cursors
          };
        }
      }
    }
  });
};
