import sqlite3 from "sqlite3";
import {open} from "sqlite";

let db;

export async function initDB() {
    db = await open({filename:"./haclib.db", driver: sqlite3.Database});
    await db.exec(`CREATE TABLE IF NOT EXISTS resources (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, type TEXT, author TEXT, tags TEXT, link TEXT, notes TEXT, status TEXT)`);
    await db.exec(`CREATE TABLE IF NOT EXISTS suggestions (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, type TEXT, author TEXT, tags TEXT, link TEXT, notes TEXT, status TEXT)`);
    await db.exec(`CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, email TEXT UNIQUE NOT NULL, password_hash TEXT NOT NULL)`);
    await db.exec(`CREATE TABLE IF NOT EXISTS user_resources (user_id TEXT, resource_id INTEGER, status TEXT CHECK(status IN ('wishlist', 'reading', 'done')), PRIMARY KEY (user_id, resource_id))`);
}

export function getDB() {
    return db;
}
