import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

const executeMigration = async () => {
    const migrationClient = postgres(process.env.PG_DATABASE_URL!, { max: 1 });
    await migrate(drizzle(migrationClient), { migrationsFolder: "./drizzle" });
};

executeMigration()
.then(() => {
    console.log("Migration complete");
})
.catch((error) => {
    console.error("Migration failed:", error);
}).finally(() => {
    process.exit();
});