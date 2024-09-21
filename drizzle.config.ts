import type { Config } from "drizzle-kit";

export default {
    schema: "./server/db/schema/*",
    out: "./drizzle",
    dialect: "postgresql",
    dbCredentials: {
        url: process.env.PG_DATABASE_URL!,
    }
} satisfies Config;
