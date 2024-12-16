import { Options } from "@mikro-orm/core";
import { Migrator } from "@mikro-orm/migrations";
import { AbstractSqlDriver, PostgreSqlDriver } from "@mikro-orm/postgresql";

const config: Options<AbstractSqlDriver> = {
  driver: PostgreSqlDriver,
  clientUrl:
    process.env.DB_CONNECTION ??
    "postgresql://user:secret123@127.0.0.1:5432/db",
  entities: ["./dist/src/models"],
  entitiesTs: ["./src/models"],
  extensions: [Migrator],

  dynamicImportProvider(id) {
    return import(id);
  },
};

export default config;
