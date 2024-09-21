import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";


const queryClient = postgres(process.env.PG_DATABASE_URL!, { max: 1 });
export const db = drizzle(queryClient);