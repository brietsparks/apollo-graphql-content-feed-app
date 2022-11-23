import { Knex } from 'knex';

export interface TransactionOptions {
  trx?: Knex.Transaction;
  commit: boolean;
}

export type TrxCallback<T> = (t: Knex.Transaction) => Promise<T>

export class TransactionsHelper {
  constructor(
    private db: Knex,
  ) {}

  query = async <T>({ trx, commit }: TransactionOptions, cb: TrxCallback<T>): Promise<T> => {
    trx = await this.getTrx(trx);
    try {
      const result = await cb(trx);
      if (commit) {
        await trx.commit();
      }
      return result;
    } catch (error) {
      trx.rollback(error);
      throw error;
    }
  }

  private async getTrx(trx: Knex.Transaction) {
    if (trx) {
      return trx;
    }

    trx = await this.db.transaction()
    await trx.raw('set constraints all deferred;');
    return trx;
  }
}
