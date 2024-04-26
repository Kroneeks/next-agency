import { pgTable, varchar, uuid } from "drizzle-orm/pg-core";
import * as schema from "./schema";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";

const client = postgres(process.env.DATABASE_URL as string);
export const db = drizzle(client, { schema, logger: true });
