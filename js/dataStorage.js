// Data Storage - Uses IndexedDB for reliable asset data storage
// Separates large asset collections from localStorage to avoid quota issues

const dataStorage = {
    dbName: 'pdrFleetData',
    storeName: 'assets',
    db: null,
    initialized: false,

    async init() {
        if (this.initialized) return true;

        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, 1);

            request.onerror = () => {
                console.error('❌ Failed to initialize data storage:', request.error);
                this.db = null;
                resolve(false);
            };

            request.onsuccess = () => {
                this.db = request.result;
                this.initialized = true;
                console.log('✓ Data storage initialized (IndexedDB)');
                resolve(true);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(this.storeName)) {
                    db.createObjectStore(this.storeName, { keyPath: 'id' });
                    console.log('✓ Created assets object store');
                }
            };
        });
    },

    // Save all asset data
    async saveAllData(people, vehicles, trailers, currentUsage) {
        if (!this.db) return false;

        return new Promise((resolve) => {
            try {
                const transaction = this.db.transaction([this.storeName], 'readwrite');
                const store = transaction.objectStore(this.storeName);

                const dataRecord = {
                    id: 'appData',
                    people,
                    vehicles,
                    trailers,
                    currentUsage,
                    timestamp: new Date().toISOString()
                };

                const request = store.put(dataRecord);

                request.onsuccess = () => {
                    console.log('✓ Saved all asset data to IndexedDB');
                    resolve(true);
                };

                request.onerror = () => {
                    console.error('✗ Failed to save asset data');
                    resolve(false);
                };
            } catch (err) {
                console.error('Error saving data:', err);
                resolve(false);
            }
        });
    },

    // Load all asset data
    async loadAllData() {
        if (!this.db) return null;

        return new Promise((resolve) => {
            try {
                const transaction = this.db.transaction([this.storeName], 'readonly');
                const store = transaction.objectStore(this.storeName);
                const request = store.get('appData');

                request.onsuccess = () => {
                    const result = request.result;
                    if (result) {
                        console.log('✓ Loaded all asset data from IndexedDB');
                        resolve({
                            people: result.people || [],
                            vehicles: result.vehicles || [],
                            trailers: result.trailers || [],
                            currentUsage: result.currentUsage || {}
                        });
                    } else {
                        resolve(null);
                    }
                };

                request.onerror = () => {
                    console.error('✗ Failed to load asset data');
                    resolve(null);
                };
            } catch (err) {
                console.error('Error loading data:', err);
                resolve(null);
            }
        });
    },

    // Clear all data
    async clearAll() {
        if (!this.db) return false;

        return new Promise((resolve) => {
            try {
                const transaction = this.db.transaction([this.storeName], 'readwrite');
                const store = transaction.objectStore(this.storeName);
                const request = store.clear();

                request.onsuccess = () => {
                    console.log('✓ Cleared all data from storage');
                    resolve(true);
                };

                request.onerror = () => {
                    console.error('✗ Failed to clear data');
                    resolve(false);
                };
            } catch (err) {
                console.error('Error clearing data:', err);
                resolve(false);
            }
        });
    }
};

export default dataStorage;
