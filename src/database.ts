import { openDB } from 'idb';

const DBNAME = 'DB';
const STORENAME = 'THUMBNAILS';

export class Database {
    db: IDBDatabase;

    async add(id: string, dataUrl: string) {
        const db = await openDB(DBNAME, undefined, {
            upgrade(db) {
                db.createObjectStore(STORENAME, { keyPath: 'id' });
            }
        });
        const tx = db.transaction(STORENAME, 'readwrite');
        const store = tx.objectStore(STORENAME);
        await store.put({ id, dataUrl });
    }

    async get(id?: string) {
        const db = await openDB(DBNAME, undefined, {
            upgrade(db) {
                db.createObjectStore(STORENAME, { keyPath: 'id' });
            }
        });
        const tx = db.transaction(STORENAME, 'readonly');
        const store = tx.objectStore(STORENAME);
        return (await id) ? store.get(id) : store.getAll();
    }
}
