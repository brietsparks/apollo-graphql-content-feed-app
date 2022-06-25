import { AppDataSource } from 'bak/orm/data-source';

export function migrate() {
  return AppDataSource.query(`select now() as now;`);
}
