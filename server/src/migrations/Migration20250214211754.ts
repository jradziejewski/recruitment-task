import { Migration } from '@mikro-orm/migrations';

export class Migration20250214211754 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "submission" alter column "first_name" type varchar(50) using ("first_name"::varchar(50));`);
    this.addSql(`alter table "submission" alter column "last_name" type varchar(50) using ("last_name"::varchar(50));`);
    this.addSql(`alter table "submission" alter column "company" type varchar(100) using ("company"::varchar(100));`);
    this.addSql(`alter table "submission" alter column "phone_number" type varchar(20) using ("phone_number"::varchar(20));`);
    this.addSql(`alter table "submission" alter column "email" type varchar(254) using ("email"::varchar(254));`);
    this.addSql(`alter table "submission" alter column "message" type varchar(1000) using ("message"::varchar(1000));`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "submission" alter column "first_name" type varchar(255) using ("first_name"::varchar(255));`);
    this.addSql(`alter table "submission" alter column "last_name" type varchar(255) using ("last_name"::varchar(255));`);
    this.addSql(`alter table "submission" alter column "company" type varchar(255) using ("company"::varchar(255));`);
    this.addSql(`alter table "submission" alter column "phone_number" type varchar(255) using ("phone_number"::varchar(255));`);
    this.addSql(`alter table "submission" alter column "email" type varchar(255) using ("email"::varchar(255));`);
    this.addSql(`alter table "submission" alter column "message" type varchar(255) using ("message"::varchar(255));`);
  }

}
