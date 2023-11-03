import { openDB, IDBPDatabase } from "idb";

const DB_VERSION = 2;

export abstract class Database {
  private static db?: IDBPDatabase<any>;

  static async openDatabase() {
    if (this.db) return this.db;

    const db = await openDB<any>("cdk-builder", DB_VERSION, {
      upgrade(db) {
        const names = db.objectStoreNames;

        if (!names.contains("projects")) {
          db.createObjectStore("projects");
        }

        if (!names.contains("timestamps")) {
          db.createObjectStore("timestamps");
        }

        if (!names.contains("blueprints")) {
          db.createObjectStore("blueprints");
        }
      },
      blocked(currentVersion, blockedVersion, event) {
        console.log(
          `Database is blocked from version ${currentVersion} to ${blockedVersion}`,
          event
        );
      },
      blocking(currentVersion, blockedVersion, event) {
        console.log(
          `Database is blocking version ${blockedVersion}, current version ${currentVersion}`,
          event
        );
      },
      terminated() {
        console.log("Database is terminated");
      },
    });

    this.db = db;
    return db;
  }

  static async keys(storeName: string) {
    const db = await this.openDatabase();

    const tx = db.transaction(storeName, "readonly");
    const store = tx.objectStore(storeName);
    const value: string[] = await store.getAllKeys();
    await tx.done;

    return value;
  }

  static async values(storeName: string) {
    const db = await this.openDatabase();

    const tx = db.transaction(storeName, "readonly");
    const store = tx.objectStore(storeName);
    const value = await store.getAll();
    await tx.done;

    return value;
  }

  static async entries(storeName: string) {
    const db = await this.openDatabase();
    const results: { key: string; value: any }[] = [];

    const tx = db.transaction(storeName, "readonly");
    const store = tx.objectStore(storeName);
    let cursor = await store.openCursor();

    while (cursor) {
      results.push({ key: cursor.key, value: cursor.value });
      cursor = await cursor.continue();
    }

    await tx.done;

    return results;
  }

  static async get(storeName: string, key: string) {
    const db = await this.openDatabase();
    const tx = db.transaction(storeName, "readonly");
    const store = tx.objectStore(storeName);
    const value = await store.get(key);
    await tx.done;

    return value;
  }

  static async set(storeName: string, key: string, value: any) {
    const db = await this.openDatabase();
    const tx = db.transaction(storeName, "readwrite");
    const store = tx.objectStore(storeName);
    await store.put(value, key);
    await tx.done;

    return value;
  }

  static async del(storeName: string, key: string) {
    const db = await this.openDatabase();
    const tx = db.transaction(storeName, "readwrite");
    const store = tx.objectStore(storeName);
    const value = await store.delete(key);
    await tx.done;

    return value;
  }
}
