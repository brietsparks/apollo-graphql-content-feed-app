import 'reflect-metadata'
import { DataSource, DataSourceOptions } from 'typeorm'
import { User } from './user'

export type TypeOrm = DataSource;

export function createOrm(opts: Partial<DataSourceOptions> = {}) {
  return new DataSource({
    ...opts,
    type: 'postgres',
    entities: [User],
  } as DataSourceOptions)
}


