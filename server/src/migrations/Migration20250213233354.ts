import { Migration } from '@mikro-orm/migrations';

export class Migration20250213233354 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "submission" ("id" uuid not null, "first_name" varchar(255) not null, "last_name" varchar(255) not null, "company" varchar(255) not null, "phone_number" varchar(255) not null, "email" varchar(255) not null, "message" varchar(255) not null, "created_at" timestamptz not null default CURRENT_TIMESTAMP, constraint "submission_pkey" primary key ("id"));`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "submission" cascade;`);
  }

}
