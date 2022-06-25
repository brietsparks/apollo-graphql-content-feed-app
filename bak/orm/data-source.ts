import 'pg';
import "reflect-metadata"
import { DataSource } from "typeorm"

import { User } from 'bak/orm/entities';

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "127.0.0.1",
    port: 5432,
    username: "appuser",
    password: "apppassword",
    database: "example_app",
    synchronize: true,
    logging: false,
    entities: [User],
    migrations: [],
    subscribers: [],
})
