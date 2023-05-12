import { openDB } from 'idb';

const DBNAME = 'DB2';
const STORENAME = 'LOG';

export class BrowserDatabase {
    db: IDBDatabase;

    async add(doNotShowAboutByDefault: boolean) {
        const db = await openDB(DBNAME, undefined, {
            upgrade(db) {
                db.createObjectStore(STORENAME, { keyPath: 'id' });
            }
        });
        const tx = db.transaction(STORENAME, 'readwrite');
        const store = tx.objectStore(STORENAME);
        await store.put({ id: 'log', doNotShowAboutByDefault });
    }

    async get() {
        const db = await openDB(DBNAME, undefined, {
            upgrade(db) {
                db.createObjectStore(STORENAME, { keyPath: 'id' });
            }
        });
        const tx = db.transaction(STORENAME, 'readonly');
        const store = tx.objectStore(STORENAME);
        return store.get('log');
    }
}
