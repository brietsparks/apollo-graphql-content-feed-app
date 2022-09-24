import { Knex } from 'knex';
import { v4 as uuid } from 'uuid';

import { tagsTable, postTagsTable } from '../database';

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
        .insert(tagsTable.toColumnCase({
          id,
          ...params,
        }));

      return { id };
    }));
  };

  getTag = async (id: string) => {
    return this.db
      .from(tagsTable.name)
      .select(tagsTable.rawColumns())
      .where({ [tagsTable.rawColumn('id')]: id })
      .first();
  };

  getTags = async (ids: string[]) => {
    return this.db
      .from(tagsTable.name)
      .select(tagsTable.rawColumns())
      .whereIn(tagsTable.rawColumn('id'), ids);
  }

  getAllTags = async (): Promise<Tag[]> => {
    return this.db
      .from(tagsTable.name)
      .select(tagsTable.rawColumns())
  };

  getTagsOfPosts = async (postIds: string[]): Promise<PostTag[]> => {
    const rows = await this.db
      .from(tagsTable.name)
      .innerJoin(
        postTagsTable.name,
        postTagsTable.prefixedColumn('tagId'),
        tagsTable.prefixedColumn('id')
      )
      .select(tagsTable.prefixedColumns())
      .select(postTagsTable.prefixedColumns())
      .whereIn(postTagsTable.prefixedColumn('postId'), postIds)
      .orderBy(postTagsTable.prefixedColumn('creationTimestamp'));

    return rows.map(row => {
      const tag = tagsTable.toAttributeCase(row);
      const { postId } = postTagsTable.toAttributeCase(row);
      return { ...tag, postId } as PostTag;
    });
  };
}
