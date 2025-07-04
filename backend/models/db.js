import sqlite3 from "sqlite3";
import {open} from "sqlite";

let db;

export async function initDB() {
    db = await open({filename:"./haclib.db", driver: sqlite3.Database});
    await db.exec(`CREATE TABLE IF NOT EXISTS resources (
        id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, type TEXT, author TEXT, tags TEXT, link TEXT, notes TEXT, status TEXT)`);
}

export {db};
