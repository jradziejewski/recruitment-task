import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { v4 as uuidv4 } from "uuid";

@Entity()
export class Submission {
  @PrimaryKey({ type: "uuid", length: 36 })
  id: string = uuidv4();

  @Property({ type: "string", length: 50 })
  firstName!: string;

  @Property({ type: "string", length: 50 })
  lastName!: string;

  @Property({ type: "string", length: 100 })
  company!: string;

  @Property({ type: "string", length: 20 })
  phoneNumber!: string;

  @Property({ type: "string", length: 254 })
  email!: string;

  @Property({ type: "string", length: 1000 })
  message!: string;

  @Property({ type: "datetime", defaultRaw: "CURRENT_TIMESTAMP" })
  createdAt!: Date | null;
}
