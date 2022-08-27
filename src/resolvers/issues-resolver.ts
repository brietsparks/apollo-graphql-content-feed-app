import { IFieldResolver } from '@graphql-tools/utils';

import { Repositories, Issue } from '../repositories';
import * as schema from '../graphql';

import { adaptCursorPagination } from './adapters';
import { RequestContext } from './context';

export function makeIssuesResolver(repositories: Repositories) {
  const createIssue: IFieldResolver<unknown, RequestContext, schema.MutationCreateIssueArgs> = async (_, { params }) => {
    const creation = await repositories.issuesRepository.createIssue(params, { commit: true });
    return repositories.issuesRepository.getIssue(creation.id);
  }

  const getIssue: IFieldResolver<unknown, RequestContext, schema.QueryGetIssueArgs> = (_, { id }) => {
    return repositories.issuesRepository.getIssue(id);
  };

  const getIssuesByCursor: IFieldResolver<unknown, RequestContext, schema.QueryGetIssuesByCursorArgs> = (_, { pagination }) => {
    return repositories.issuesRepository.getIssuesByCursor({
      pagination: adaptCursorPagination<Issue>(pagination)
    });
  };

  const getIssues = getIssuesByCursor;

  return {
    Query: {
      getIssue,
      getIssues,
      getIssuesByCursor,
    },
    Mutation: {
      createIssue,
    },
    Issue: {
      id: (i) => i.id,
      creationTimestamp: (i) => i.creationTimestamp,
      assigneeId: (i) => i.assigneeId,
      statusId: (i) => i.statusId,
      name: (i) => i.name,
      description: (i) => i.description,
    }
  };
}
