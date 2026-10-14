import { betterAuth } from "better-auth";
import { Pool } from "pg";
import { config as loadEnv } from "dotenv";
import { ENV_FILE } from "../config/env.js";

loadEnv({ path: ENV_FILE });

export const auth = betterAuth({
  database: new Pool({
    connectionString: process.env.DATABASE_URL,
  }),
  advanced: {
    database: {
      generateId: "uuid",
    },
  },
});