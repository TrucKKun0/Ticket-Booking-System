"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_path_1 = __importDefault(require("node:path"));
const db_1 = require("../lib/db");
const logger_1 = require("../lib/logger");
const node_fs_1 = __importDefault(require("node:fs"));
const MIGRATION_DIR = node_path_1.default.join(process.cwd(), 'migrations');
console.log("Directory Path", MIGRATION_DIR);
const CREATE_MIGRATION_TABLE_SQL = `
    CREATE TABLE IF NOT EXISTS migrations(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    executed_at TIMESTAMP NOT NULL DEFAULT NOW()
    )
`;
function getMigrationFiles() {
    return node_fs_1.default.readdirSync(MIGRATION_DIR).filter((file) => file.endsWith(".sql")).sort();
}
async function getExecutedMigration() {
    const result = await db_1.pool.query(`
        SELECT name FROM migrations ORDER BY name
        `);
    return result.rows.map((row) => row.name);
}
async function runMigration(fileName) {
    const sql = node_fs_1.default.readFileSync(node_path_1.default.join(MIGRATION_DIR, fileName), 'utf-8');
    const client = await db_1.pool.connect();
    try {
        await client.query("BEGIN");
        await client.query(sql);
        await client.query(`INSERT INTO migrations (name) VALUES ($1)`, [fileName]);
        await client.query("COMMIT");
        logger_1.logger.info(`Migration completed: ${fileName}`);
    }
    catch (error) {
        await client.query("ROLLBACK");
        throw error;
    }
    finally {
        client.release();
    }
}
async function migrate() {
    await db_1.pool.query(CREATE_MIGRATION_TABLE_SQL);
    const executed = new Set(await getExecutedMigration());
    const pending = getMigrationFiles().filter((file) => !executed.has(file));
    console.log(pending);
    if (pending.length === 0) {
        logger_1.logger.info("No pending migration files");
        return;
    }
    for (const fileName of pending) {
        await runMigration(fileName);
    }
    logger_1.logger.info("All migration completed");
}
migrate().catch((err) => {
    logger_1.logger.error({ err }, `Migartion Failed`);
    process.exit(1);
}).finally(() => {
    db_1.pool.end();
});
