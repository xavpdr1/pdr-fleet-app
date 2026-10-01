// Photo Storage - Uses IndexedDB for large image data
// Keeps photos separate from main app data to avoid localStorage quota issues

const photoStorage = {
    dbName: 'pdrFleetPhotos',
    storeName: 'photos',
    db: null,
    initialized: false,

    async init() {
        if (this.initialized) return true;

        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, 1);

            request.onerror = () => {
                console.error('❌ Failed to initialize photo storage:', request.error);
                this.db = null;
                resolve(false); // Graceful fallback
            };

            request.onsuccess = () => {
                this.db = request.result;
                this.initialized = true;
                console.log('✓ Photo storage initialized (IndexedDB)');
                resolve(true);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(this.storeName)) {
                    db.createObjectStore(this.storeName, { keyPath: 'id' });
                    console.log('✓ Created photos object store');
                }
            };
        });
    },

    // Save a photo for an asset
    async savePhoto(assetId, photoData) {
        if (!this.db) await this.init();
        if (!this.db) return false;

        return new Promise((resolve) => {
            try {
                const transaction = this.db.transaction([this.storeName], 'readwrite');
                const store = transaction.objectStore(this.storeName);

                const photoRecord = {
                    id: assetId,
                    data: photoData,
                    timestamp: new Date().toISOString()
                };

                const request = store.put(photoRecord);

                request.onsuccess = () => {
                    console.log(`✓ Saved photo for ${assetId}`);
                    resolve(true);
                };

                request.onerror = () => {
                    console.error(`✗ Failed to save photo for ${assetId}`);
                    resolve(false);
                };
            } catch (err) {
                console.error('Error saving photo:', err);
                resolve(false);
            }
        });
    },

    // Load a photo for an asset
    async loadPhoto(assetId) {
        if (!this.db) await this.init();
        if (!this.db) return null;

        return new Promise((resolve) => {
            try {
                const transaction = this.db.transaction([this.storeName], 'readonly');
                const store = transaction.objectStore(this.storeName);
                const request = store.get(assetId);

                request.onsuccess = () => {
                    const result = request.result;
                    if (result) {
                        console.log(`✓ Loaded photo for ${assetId}`);
                        resolve(result.data);
                    } else {
                        resolve(null);
                    }
                };

                request.onerror = () => {
                    console.error(`✗ Failed to load photo for ${assetId}`);
                    resolve(null);
                };
            } catch (err) {
                console.error('Error loading photo:', err);
                resolve(null);
            }
        });
    },

    // Delete a photo
    async deletePhoto(assetId) {
        if (!this.db) await this.init();
        if (!this.db) return false;

        return new Promise((resolve) => {
            try {
                const transaction = this.db.transaction([this.storeName], 'readwrite');
                const store = transaction.objectStore(this.storeName);
                const request = store.delete(assetId);

                request.onsuccess = () => {
                    console.log(`✓ Deleted photo for ${assetId}`);
                    resolve(true);
                };

                request.onerror = () => {
                    console.error(`✗ Failed to delete photo for ${assetId}`);
                    resolve(false);
                };
            } catch (err) {
                console.error('Error deleting photo:', err);
                resolve(false);
            }
        });
    },

    // Clear all photos
    async clearAll() {
        if (!this.db) await this.init();
        if (!this.db) return false;

        return new Promise((resolve) => {
            try {
                const transaction = this.db.transaction([this.storeName], 'readwrite');
                const store = transaction.objectStore(this.storeName);
                const request = store.clear();

                request.onsuccess = () => {
                    console.log('✓ Cleared all photos from storage');
                    resolve(true);
                };

                request.onerror = () => {
                    console.error('✗ Failed to clear photos');
                    resolve(false);
                };
            } catch (err) {
                console.error('Error clearing photos:', err);
                resolve(false);
            }
        });
    }
};

export default photoStorage;
