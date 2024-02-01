import dotenv from "dotenv";

console.log("[config] Load environment variables from .env");
dotenv.config();

if (process.env.NODE_ENV) {
    const path = `.env.${process.env.NODE_ENV.trim()}`;
    console.log(`[config] Load environment variables from ${path}`);
    dotenv.config({ path: path, override: true });
}
