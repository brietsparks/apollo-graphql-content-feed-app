import { Knex } from 'knex';
import { v4 as uuid } from 'uuid';

import { tagsTable, postTagsTable, imageTagsTable } from '../database';

import { TransactionOptions, TransactionsHelper } from './transactions';

export type Tag = {
  id: string;
  creationTimestamp: Date;
  name: string;
}

export type PostTag =
  Tag & {
  postId: string;
}

export interface CreateTagParams {
  name: string;
}

export class TagsRepository {
  private trx: TransactionsHelper;

  constructor(
    private db: Knex
  ) {
    this.trx = new TransactionsHelper(db);
  }

  createTag = async (params: CreateTagParams, opts: TransactionOptions) => {
    return this.trx.query(opts, (async (trx) => {
      const id = uuid();

      await trx
        .into(tagsTable.name)
        .insert(tagsTable.writeColumns({
          id,
          ...params,
        }));

      return { id };
    }));
  };

  getTag = async (id: string) => {
    return this.db
      .from(tagsTable.name)
      .select(tagsTable.columns)
      .where({ [tagsTable.columns.id]: id })
      .first();
  };

  getTags = async (ids: string[]) => {
    return this.db
      .from(tagsTable.name)
      .select(tagsTable.columns)
      .whereIn(tagsTable.columns.id, ids);
  }

  getAllTags = async (): Promise<Tag[]> => {
    return this.db
      .from(tagsTable.name)
      .select(tagsTable.columns)
  };

  getTagsOfPosts = async (postIds: string[]): Promise<PostTag[]> => {
    const rows = await this.db
      .from(tagsTable.name)
      .innerJoin(
        postTagsTable.name,
        postTagsTable.prefixedColumns.get('tagId'),
        tagsTable.prefixedColumns.get('id')
      )
      .select(tagsTable.prefixedColumns.all)
      .select(postTagsTable.prefixedColumns.all)
      .distinctOn(tagsTable.prefixedColumns.get('id'))
      .whereIn(postTagsTable.prefixedColumns.get('postId'), postIds);

    return rows.map(row => {
      const tag = tagsTable.prefixedColumns.unmarshal(row);
      const { postId } = postTagsTable.prefixedColumns.unmarshal(row);
      return { ...tag, postId } as PostTag;
    });
  };
}
