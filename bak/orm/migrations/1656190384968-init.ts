import { MigrationInterface, QueryRunner } from "typeorm"

export class init1656190384968 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`
        create table users(
          id serial primary key,
          first_name varchar(255),
          last_name varchar(255)
        );
      `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`
        drop table users;
      `)
    }

}
