import "dotenv/config"; // 1. CRITICAL: Loads your .env file into process.env
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    // 2. CRITICAL: Pass the direct connection string here for the CLI to use
    url: env("DIRECT_URL"), 
  },
});