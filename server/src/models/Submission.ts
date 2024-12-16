import { Entity, PrimaryKey, Property } from "@mikro-orm/core";

@Entity()
export class Submission {
  @PrimaryKey({ type: "uuid" })
  id!: string;

  @Property({ type: "string" })
  firstName!: string;

  @Property({ type: "string" })
  email!: string;
}
