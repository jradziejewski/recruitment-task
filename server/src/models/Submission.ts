import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { v4 as uuidv4 } from "uuid";

@Entity()
export class Submission {
  @PrimaryKey({ type: "uuid" })
  id: string = uuidv4();

  @Property({ type: "string" })
  firstName!: string;

  @Property({ type: "string" })
  lastName!: string;

  @Property({ type: "string" })
  company!: string;

  @Property({ type: "string" })
  phoneNumber!: string;

  @Property({ type: "string" })
  email!: string;

  @Property({ type: "string" })
  message!: string;

  @Property({ type: "datetime", defaultRaw: "CURRENT_TIMESTAMP" })
  createdAt!: Date | null;
}
