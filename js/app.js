// PDR Fleet Management - Driver Logs, Maintenance & Recalls

const app = {

    authorizedReps: [
        { name: 'Xavier Fernandez', role: 'Fleet Manager' },
        { name: 'Curtis Wall', role: 'Authorized User' }
    ],

    // Current logged-in user (in production, this would come from authentication)
    currentUser: { name: 'Xavier Fernandez', isAdmin: true },

    // People/Users management
    people: [
        {
            id: 'person-1',
            name: 'Xavier Fernandez',
            email: 'xavier.fernandez@pdr-team.com',
            phone: '214-555-0101',
            address: 'Lewisville, TX',
            role: 'Admin',
            permissions: {
                viewVehicles: true,
                editVehicles: true,
                viewTrailers: true,
                editTrailers: true,
                logUsage: true,
                logMaintenance: true,
                managePeople: true,
                manageAlerts: true
            }
        },
        {
            id: 'person-2',
            name: 'Curtis Wall',
            email: 'curtis.wall@pdr-team.com',
            phone: '214-555-0102',
            address: 'Dallas, TX',
            role: 'Technician',
            permissions: {
                viewVehicles: true,
                editVehicles: false,
                viewTrailers: true,
                editTrailers: false,
                logUsage: true,
                logMaintenance: true,
                managePeople: false,
                manageAlerts: false
            }
        },
        {
            id: 'person-3',
            name: 'Anton Potgieter',
            email: 'anton.potgieter@pdr-team.com',
            phone: '214-555-0103',
            address: 'Arlington, TX',
            role: 'Technician',
            permissions: {
                viewVehicles: true,
                editVehicles: false,
                viewTrailers: true,
                editTrailers: false,
                logUsage: true,
                logMaintenance: true,
                managePeople: false,
                manageAlerts: false
            }
        },
        {
            id: 'person-4',
            name: 'Dial Mayfield',
            email: 'dial.mayfield@pdr-team.com',
            phone: '214-555-0104',
            address: 'Frisco, TX',
            role: 'Technician',
            permissions: {
                viewVehicles: true,
                editVehicles: false,
                viewTrailers: true,
                editTrailers: false,
                logUsage: true,
                logMaintenance: true,
                managePeople: false,
                manageAlerts: false
            }
        }
    ],

        vehicles: [
        {
            id: 'truck-1',
            type: 'vehicle',
            name: 'F-150',
            model: '2021 Ford F-150',
            licensePlate: 'VJB6093',
            vin: '1FTFW1ED9MFB41842',
            assignedTo: 'Field Operations',
            capacity: '5 seats',
            primaryUse: 'Site visits, equipment transport',
            mileage: 48500,
            status: 'available',
            lastMaintenance: '2026-09-20',
            nextMaintenance: '2026-10-20',
            appletag: 'APT-001-TRK1',
            insurance: {
                provider: 'State Farm',
                policyNumber: '0031891-SFX-43',
                expirationDate: '2026-12-16',
                agent: 'Kelsey DeLuca',
                phone: '214-295-9717'
            },
            registrationExpiration: '2027-05-31'
        },
        {
            id: 'truck-2',
            type: 'vehicle',
            name: 'F-250',
            model: '2021 Ford F-250',
            licensePlate: 'VHV1039',
            vin: '1FT8W2BT9MEC05393',
            assignedTo: 'Field Operations',
            capacity: '5 seats',
            primaryUse: 'Site visits, equipment transport',
            mileage: 41200,
            status: 'available',
            lastMaintenance: '2026-09-18',
            nextMaintenance: '2026-10-18',
            appletag: 'APT-002-TRK2',
            insurance: {
                provider: 'State Farm',
                policyNumber: '0031891-SFX-43',
                expirationDate: '2026-12-16',
                agent: 'Kelsey DeLuca',
                phone: '214-295-9717'
            },
            registrationExpiration: '2027-06-30'
        }
    ],

    trailers: [
        {
            id: 'trailer-1',
            type: 'trailer',
            name: 'Well Trailer',
            model: '2024 Well Trailer',
            licensePlate: '882027M',
            vin: '7VON11624RT415683',
            assignedTo: 'Field Operations',
            emptyWeight: 2300,
            capacity: 4600,
            grossWeight: 6900,
            status: 'available',
            lastMaintenance: '2026-09-15',
            nextMaintenance: '2026-10-15',
            appletag: 'APT-003-TRL1',
            insurance: {
                provider: 'State Farm',
                policyNumber: '0031891-SFX-43',
                expirationDate: '2026-12-16',
                agent: 'Kelsey DeLuca',
                phone: '214-295-9717'
            },
            registrationExpiration: '2027-06-01'
        },
        {
            id: 'trailer-2',
            type: 'trailer',
            name: 'GooseNeck',
            model: '2024 GooseNeck Trailer',
            licensePlate: '961334M',
            vin: '5WW6T2426R6033973',
            assignedTo: 'Field Operations',
            emptyWeight: 6370,
            capacity: 8630,
            grossWeight: 14000,
            status: 'available',
            lastMaintenance: '2026-09-12',
            nextMaintenance: '2026-10-12',
            appletag: 'APT-004-TRL2',
            insurance: {
                provider: 'State Farm',
                policyNumber: '0031891-SFX-43',
                expirationDate: '2026-12-16',
                agent: 'Kelsey DeLuca',
                phone: '214-295-9717'
            },
            registrationExpiration: '2026-09-30'
        },
        {
            id: 'trailer-3',
            type: 'trailer',
            name: 'Trailer',
            model: '2025 Trailer',
            licensePlate: '980007M',
            vin: '4D6EB14115C068035',
            assignedTo: 'Field Operations',
            emptyWeight: 1315,
            capacity: 1675,
            grossWeight: 2990,
            status: 'available',
            lastMaintenance: '2026-09-10',
            nextMaintenance: '2026-10-10',
            appletag: 'APT-005-TRL3',
            insurance: {
                provider: 'State Farm',
                policyNumber: '0031891-SFX-43',
                expirationDate: '2026-12-16',
                agent: 'Kelsey DeLuca',
                phone: '214-295-9717'
            },
            registrationExpiration: '2026-10-31'
        }
    ],

    currentVehicle: null,
    currentVehicleId: null,
    currentTab: 'vehicles', // 'vehicles', 'trailers', or 'people'
    tracking: {},
    usageLogs: {}, // Track usage history by vehicle ID
    currentUsage: {}, // Track who's currently using what: { assetId: { userName: string, startTime: timestamp } }
    selectedPerson: null, // Currently selected person

    // Alerts/Recalls system mapped by VIN
    alerts: {
        '1FTFW1ED9MFB41842': [
            { id: 'recall-001', type: 'recall', title: 'Brake Pad Inspection', description: 'Regular inspection recommended by manufacturer', date: '2026-09-25', severity: 'medium' }
        ],
        '1FT8W2BT9MEC05393': [
            { id: 'recall-002', type: 'recall', title: 'Tire Pressure Monitoring', description: 'Sensor calibration needed', date: '2026-10-01', severity: 'low' }
        ]
    },

    // Load data from IndexedDB first, then fallback to localStorage
    async loadData() {
        try {
            // Try to load from IndexedDB first (more reliable for large data)
            if (window.dataStorage) {
                const indexedData = await window.dataStorage.loadAllData();
                if (indexedData && indexedData.people && indexedData.people.length > 0) {
                    this.people = indexedData.people || [];
                    this.vehicles = indexedData.vehicles || [];
                    this.trailers = indexedData.trailers || [];
                    this.currentUsage = indexedData.currentUsage || {};
                    this._loadedFromStorage = true;
                    console.log('✓ Loaded data from IndexedDB');
                    console.log(`  - ${this.people.length} people`);
                    console.log(`  - ${this.vehicles.length} vehicles`);
                    console.log(`  - ${this.trailers.length} trailers`);
                    return;  // Successfully loaded from IndexedDB
                }
            }
        } catch (err) {
            console.warn('⚠️ IndexedDB load failed:', err);
        }
        
        // Fallback to localStorage if IndexedDB is empty
        try {
            const savedData = localStorage.getItem('pdrFleetAppData');
            if (savedData) {
                const data = JSON.parse(savedData);
                console.log('📦 Loaded data from localStorage (fallback)');
                if (data.people) {
                    this.people = data.people;
                    console.log(`  - ${data.people.length} people`);
                }
                if (data.vehicles) {
                    this._loadedFromStorage = true;
                    this.vehicles = data.vehicles;
                    console.log(`  - ${data.vehicles.length} vehicles`);
                }
                if (data.trailers) {
                    this.trailers = data.trailers;
                    console.log(`  - ${data.trailers.length} trailers`);
                }
                if (data.currentUsage) this.currentUsage = data.currentUsage;
            } else {
                console.log('ℹ️ No saved data found, using defaults');
            }
        } catch (e) {
            console.error('❌ Error loading from localStorage:', e);
        }
    },
    
    // Legacy method for compatibility
    async loadFromLocalStorage() {
        return this.loadData();
    },

    // Save data to IndexedDB with localStorage backup
    async saveData() {
        this._packIntoAssets();
        // Note which items changed since the last save/sync (gives them a fresh timestamp)
        const { changed, deleted } = this._hashes ? this._stampChanges() : { changed: [], deleted: [] };

        try {
            // Save to IndexedDB first (primary storage, no quota issues)
            if (window.dataStorage) {
                await window.dataStorage.saveAllData(
                    this.people,
                    this.vehicles,
                    this.trailers,
                    this.currentUsage
                );
                console.log('✓ Saved all data to IndexedDB');
            }
        } catch (err) {
            console.error('⚠️ IndexedDB save failed:', err);
        }
        
        // Also save minimal metadata to localStorage as backup
        try {
            const minimalData = {
                lastSaved: new Date().toISOString(),
                assetCount: this.people.length + this.vehicles.length + this.trailers.length,
                hasIndexedDB: !!window.dataStorage
            };
            localStorage.setItem('pdrFleetAppData', JSON.stringify(minimalData));
        } catch (e) {
            console.error('Error saving to localStorage backup:', e);
        }

        // Upload just the changed items (non-blocking)
        this.pushToCloud(changed, deleted);
    },

    // Usage/maintenance logs and "in use" status live on each vehicle/trailer record,
    // so they are saved on the phone and shared through the cloud with the unit itself.
    _packIntoAssets() {
        for (const a of [...this.vehicles, ...this.trailers]) {
            a.logs = this.usageLogs[a.id] || [];
            a.currentUse = this.currentUsage[a.id] || null;
        }
    },
    _hydrateFromAssets() {
        for (const a of [...this.vehicles, ...this.trailers]) {
            if (Array.isArray(a.logs)) this.usageLogs[a.id] = a.logs;
            if ('currentUse' in a) {
                if (a.currentUse) this.currentUsage[a.id] = a.currentUse;
                else delete this.currentUsage[a.id];
            }
        }
    },

    // Safety net: save shortly after any tap or form submit (only changed items are uploaded)
    _autoSave() {
        clearTimeout(this._autoSaveTimer);
        this._autoSaveTimer = setTimeout(() => this.saveData(), 600);
    },

    // ===== Cloud sync (Supabase fleet_records) =====
    _recKinds: { people: 'person', vehicles: 'vehicle', trailers: 'trailer' },

    _hashOf(rec) {
        const { _updatedAt, _default, ...rest } = rec || {};
        return JSON.stringify(rest);
    },

    // Remember what every item looks like right now
    _snapshot() {
        this._hashes = {};
        for (const [list, kind] of Object.entries(this._recKinds)) {
            for (const r of this[list]) this._hashes[kind + ':' + r.id] = this._hashOf(r);
        }
    },

    // Compare with the snapshot: timestamp changed items, list removed ones
    _stampChanges() {
        const now = new Date().toISOString();
        const seen = new Set();
        const changed = [];
        for (const [list, kind] of Object.entries(this._recKinds)) {
            for (const r of this[list]) {
                const key = kind + ':' + r.id;
                seen.add(key);
                const h = this._hashOf(r);
                if (this._hashes[key] !== h) {
                    r._updatedAt = now;
                    delete r._default;
                    this._hashes[key] = h;
                    changed.push({ kind, rec: r });
                }
            }
        }
        const deleted = [];
        for (const key of Object.keys(this._hashes)) {
            if (!seen.has(key)) {
                delete this._hashes[key];
                const i = key.indexOf(':');
                deleted.push({ kind: key.slice(0, i), id: key.slice(i + 1) });
            }
        }
        return { changed, deleted };
    },

    _loadTombs() { try { return JSON.parse(localStorage.getItem('pdrFleetDeleted') || '[]'); } catch (e) { return []; } },
    _saveTombs(t) { try { localStorage.setItem('pdrFleetDeleted', JSON.stringify(t)); } catch (e) {} },

    async pushToCloud(changed = [], deleted = []) {
        // deletions are queued on the device until the cloud confirms them
        let tombs = this._loadTombs();
        for (const d of deleted) if (!tombs.some(t => t.kind === d.kind && t.id === d.id)) tombs.push(d);
        this._saveTombs(tombs);
        if (!window.supabase || !window.supabase.client || !this._cloudReady) return; // cloudSync will catch up later

        const rows = changed
            .filter(c => !c.rec._default)
            .map(c => ({ kind: c.kind, id: c.rec.id, data: c.rec, deleted: false }))
            .concat(tombs.map(t => ({ kind: t.kind, id: t.id, data: {}, deleted: true })));
        if (!rows.length) return;
        const ok = await window.supabase.saveRecords(rows);
        if (ok && tombs.length) this._saveTombs([]);
    },

    // Merge cloud and device: nothing is ever replaced by an empty list.
    // For an item on both sides, the one changed most recently wins.
    async cloudSync() {
        if (this._syncing || !window.supabase || !window.supabase.client) return;
        this._syncing = true;
        try {
            const rows = await window.supabase.loadRecords();
            if (!rows) return; // table missing or offline → keep using device data

            const cloud = { person: new Map(), vehicle: new Map(), trailer: new Map() };
            const gone = new Set();
            for (const r of rows) {
                if (!cloud[r.kind]) continue;
                if (r.deleted) gone.add(r.kind + ':' + r.id);
                else cloud[r.kind].set(r.id, r.data);
            }
            // first run: bring the team list over from the old people table
            const migratePeople = !rows.some(r => r.kind === 'person');
            if (migratePeople) {
                for (const p of await window.supabase.loadPeople()) {
                    const { created_at, updated_at, ...person } = p;
                    cloud.person.set(person.id, person);
                }
            }
            const pendingDeletes = new Set(this._loadTombs().map(t => t.kind + ':' + t.id));

            const toPush = [];
            let localChanged = false;
            for (const [list, kind] of Object.entries(this._recKinds)) {
                const local = new Map(this[list].map(r => [r.id, r]));
                const ids = [...new Set([...local.keys(), ...cloud[kind].keys()])];
                const out = [];
                for (const id of ids) {
                    const key = kind + ':' + id;
                    if (gone.has(key) || pendingDeletes.has(key)) { if (local.has(id)) localChanged = true; continue; }
                    const l = local.get(id), c = cloud[kind].get(id);
                    if (l && !c) {
                        out.push(l);
                        if (!l._default) toPush.push({ kind, id, data: l, deleted: false });
                    } else if (c && !l) {
                        out.push(c); localChanged = true;
                    } else {
                        const lt = l._default ? '' : (l._updatedAt || ''), ct = c._updatedAt || '';
                        if (lt > ct) { out.push(l); toPush.push({ kind, id, data: l, deleted: false }); }
                        else if (this._hashOf(c) === this._hashOf(l)) out.push(l);   // same content: keep the object the screen is using
                        else { out.push(c); localChanged = true; }
                    }
                }
                this[list] = out;
            }

            if (migratePeople) for (const p of this.people) if (!p._default && !toPush.some(r => r.kind === 'person' && r.id === p.id)) toPush.push({ kind: 'person', id: p.id, data: p, deleted: false });
            // point the open unit at its (possibly updated) record
            if (this.currentVehicle) {
                const cur = this.findAsset(this.currentVehicle.id);
                if (cur) this.currentVehicle = cur;
            }
            this._hydrateFromAssets();
            this._packIntoAssets();
            this._cloudReady = true;
            await this.pushToCloud([], []);          // flush queued deletions
            if (toPush.length) await window.supabase.saveRecords(toPush);
            this._snapshot();
            if (localChanged && window.dataStorage) {
                await window.dataStorage.saveAllData(this.people, this.vehicles, this.trailers, this.currentUsage);
            }
            if (localChanged) this.refreshCurrentView();
            if (this._pendingAssetId) this.openAssetFromLink();
            this.syncPhotos();
            console.log(`✓ Cloud sync done (${toPush.length} uploaded${localChanged ? ', device updated' : ''})`);
        } catch (err) {
            console.warn('⚠️ Cloud sync failed (data still saved on this device):', err);
        } finally {
            this._syncing = false;
        }
    },

    refreshCurrentView() {
        if (this._userBusy()) { setTimeout(() => this.refreshCurrentView(), 5000); return; }
        const fleetPage = document.getElementById('fleetPage');
        if (!fleetPage || fleetPage.classList.contains('active')) this.renderFleetList();
    },

    // Don't redraw the list while someone is typing or has a USE menu open
    _userBusy() {
        const el = document.activeElement;
        if (el && /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName)) return true;
        return [...document.querySelectorAll('[id^="dropdown-"]')].some(d => d.style.display && d.style.display !== 'none');
    },

    // Photo: this device first, then the cloud (and keep a copy on the device)
    async getPhoto(assetId) {
        let photo = window.photoStorage ? await window.photoStorage.loadPhoto(assetId) : null;
        if (!photo && window.supabase && window.supabase.client) {
            photo = await window.supabase.loadPhotoCloud(assetId);
            if (photo && window.photoStorage) window.photoStorage.savePhoto(assetId, photo);
        }
        return photo;
    },

    // If an item lost its "has photo" mark but its photo is still on this device, reconnect it
    async recoverPhotoFlags() {
        if (!window.photoStorage) return;
        try { await window.photoStorage.init(); } catch (e) { return; }
        let fixed = 0;
        for (const a of [...this.vehicles, ...this.trailers]) {
            if (a.hasPhoto) continue;
            if (await window.photoStorage.loadPhoto(a.id)) { a.hasPhoto = true; fixed++; }
        }
        if (fixed) { console.log('✓ Reconnected', fixed, 'photo(s)'); await this.saveData(); this.refreshCurrentView(); }
    },

    // Upload photos that only exist on this device
    async syncPhotos() {
        if (!window.photoStorage || !window.supabase) return;
        const inCloud = await window.supabase.photoIdsInCloud();
        if (!inCloud) return;
        for (const a of [...this.vehicles, ...this.trailers]) {
            if (!a.hasPhoto || inCloud.has(a.id)) continue;
            const photo = await window.photoStorage.loadPhoto(a.id);
            if (photo) await window.supabase.savePhotoCloud(a.id, photo);
        }
    },

    // Legacy method for compatibility
    async saveToLocalStorage() {
        return this.saveData();
    },

    // Sync data to Supabase cloud
    async syncToCloud() {
        if (!window.supabase || !window.supabase.client) {
            return; // Supabase not ready
        }

        try {
            await window.supabase.syncToCloud({
                people: this.people,
                vehicles: this.vehicles,
                trailers: this.trailers
            });
        } catch (err) {
            console.warn('⚠️ Cloud sync failed (data still saved locally):', err);
        }
    },

    // Initialize the app
    async init() {
        console.log('Initializing PDR Fleet Tracker...');

        // Initialize photo storage (IndexedDB) in background
        if (window.photoStorage) {
            window.photoStorage.init().catch(err => {
                console.warn('⚠️ Photo storage unavailable:', err);
            });
        }

        // Load from IndexedDB first (reliable), fallback to localStorage
        await this.loadData();
        if (!this._loadedFromStorage) {
            // built-in sample data: never upload it or let it overwrite real data
            for (const list of ['people', 'vehicles', 'trailers']) this[list].forEach(r => { r._default = true; });
        }
        this._hydrateFromAssets();
        this._packIntoAssets();
        this._snapshot();
        document.addEventListener('submit', () => this._autoSave(), true);
        document.addEventListener('click', () => this._autoSave(), true);
        this.recoverPhotoFlags();

        // Initialize Supabase cloud sync in background (non-blocking)
        // Use timeout to prevent freezing if network is slow
        Promise.race([
            window.supabase.init(),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Supabase init timeout')), 3000))
        ]).then(async () => {
            console.log('✓ Supabase initialized for cloud sync');

            await this.cloudSync();
            // keep phones in step: every minute and whenever the app is reopened
            setInterval(() => this.cloudSync(), 60000);
            document.addEventListener('visibilitychange', () => { if (!document.hidden) this.cloudSync(); });
        }).catch(err => {
            console.warn('⚠️ Supabase unavailable, using localStorage only:', err.message);
        });

        // Set user avatar in header
        const userInitial = this.currentUser.name.charAt(0).toUpperCase();
        const avatarElement = document.getElementById('userAvatar');
        if (avatarElement) {
            avatarElement.textContent = userInitial;
        }

        // Load tracking data for all vehicles and trailers
        await this.loadTrackingData();

        // Render fleet list
        this.renderFleetList();

        // Opened by scanning a vehicle/trailer QR code?
        this.openAssetFromLink();

        // Set up real-time updates
        this.setupAutoUpdates();
    },

    // Page Navigation
    showPage(pageId) {
        document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
        const page = document.getElementById(pageId);
        if (page) {
            page.classList.add('active');
        }
    },

    setActiveNav(navId) {
        document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
        const navItems = document.querySelectorAll('.nav-item');
        const navMap = { 'fleet': 0, 'settings': 1 };
        if (navMap[navId] !== undefined) {
            navItems[navMap[navId]].classList.add('active');
        }
    },

    // Render fleet list (vehicles and trailers)
    async renderFleetList() {
        const assetList = document.getElementById('assetList');
        const items = this.currentTab === 'vehicles' ? this.vehicles : this.trailers;

        assetList.innerHTML = '';
        
        // Process each item, loading photos asynchronously
        for (const item of items) {
            const card = document.createElement('div');
            card.className = 'asset-card';

            // Load photo from IndexedDB if it exists
            let photoData = null;
            if (window.photoStorage && item.hasPhoto) {
                photoData = await this.getPhoto(item.id);
            }

            const fallbackEmoji = this.currentTab === 'vehicles' ? '🚗' : '🚛';
            const iconDisplay = photoData ?
                `<img src="${photoData}" alt="${item.name}" style="width: 100%; height: 100%; object-fit: cover; display: block;">`
                : `<span style="font-size: 28px; line-height: 1;">${fallbackEmoji}</span>`;
            const secondaryInfo = item.type === 'trailer'
                ? `${item.licensePlate} • ${item.capacity} lbs`
                : `${item.licensePlate} • ${item.mileage.toLocaleString()} mi`;

            const statusColor = this.getStatusColor(item.status);
            const isInUse = this.currentUsage[item.id];
            const usageInfo = isInUse ? `<div style="font-size: 12px; color: #f59e0b; font-weight: 600; margin-top: 4px;">⚠️ In use by ${isInUse.userName}${isInUse.location ? ` at ${isInUse.location}` : ''}</div>` : '';
            const alertBadges = item.type === 'trailer' ? '' : this.fleetBadgesHTML(item);
            const here = (isInUse && isInUse.location) || item.lastLocation;
            const locationInfo = item.type === 'trailer'
                ? `<div style="font-size: 12px; color: #374151; margin-top: 4px;"><i class="fas fa-map-marker-alt" style="color: #2E75B6;"></i> ${here ? (isInUse ? '' : 'Last at: ') + here : 'Location not set'}</div>`
                : '';

            card.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: flex-start; width: 100%;">
                    <div style="flex: 1; display: flex; align-items: center; gap: 12px; min-width: 0;" onclick="app.showAssetDetail('${item.id}')">
                        <div class="asset-icon">${iconDisplay}</div>
                        <div class="asset-info">
                            <div class="asset-name">${item.name}</div>
                            <div class="asset-details">
                                <span class="status-dot" style="background: ${statusColor};"></span>
                                ${secondaryInfo}
                            </div>
                            ${usageInfo}
                            ${isInUse && isInUse.location ? '' : locationInfo}
                            ${alertBadges}
                        </div>
                    </div>
                    <div style="display: flex; align-items: center; gap: 8px; position: relative;">
                        ${isInUse ? `
                        <div style="display: flex; gap: 6px;">
                            <button onclick="app.showUsageDetails('${item.id}')" style="padding: 8px 12px; background: #f59e0b; color: white; border: none; border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 12px; white-space: nowrap;">
                                IN USE
                            </button>
                            <button onclick="app.endUsage('${item.id}')" style="padding: 8px 12px; background: #ef4444; color: white; border: none; border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 11px; white-space: nowrap;">
                                End
                            </button>
                        </div>
                        ` : `
                        <div style="position: relative;">
                            <button id="useBtn-${item.id}" onclick="app.toggleUsageDropdown('${item.id}')" style="padding: 8px 12px; background: #10b981; color: white; border: none; border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 12px; white-space: nowrap;">
                                USE
                            </button>
                            <div id="dropdown-${item.id}" style="display: none; position: absolute; top: 100%; right: 0; background: white; border: 1px solid #e5e7eb; border-radius: 6px; min-width: 200px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); z-index: 1000; margin-top: 4px;">
                                <div style="padding: 8px 0;">
                                    ${item.type === 'trailer' ? `
                                        <div style="padding: 10px 12px; border-bottom: 1px solid #f3f4f6;" onclick="event.stopPropagation()">
                                            <label for="trailerLocation-${item.id}" style="display: block; font-size: 11px; font-weight: 700; color: #1F4E79; margin-bottom: 4px;"><i class="fas fa-map-marker-alt"></i> Location (where is it going?)</label>
                                            <input type="text" id="trailerLocation-${item.id}" value="${(item.lastLocation || '').replace(/"/g, '&quot;')}" placeholder="e.g. Lewisville shop, job site address" style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 13px;">
                                            <div style="font-size: 11px; color: #6b7280; margin-top: 6px;">Then pick who is using it:</div>
                                        </div>
                                    ` : ''}
                                    ${this.people.map(person => `
                                        <div onclick="app.logUsageWithPerson('${item.id}', '${person.name}'); app.toggleUsageDropdown('${item.id}')" style="padding: 10px 12px; cursor: pointer; font-size: 13px; color: #1f2937; border-bottom: 1px solid #f3f4f6; transition: background 0.2s;" onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background='white'">
                                            ${person.name}
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        </div>
                        `}
                    </div>
                </div>
            `;

            assetList.appendChild(card);
        }
        if (this.currentTab === 'vehicles') this.prefetchRecalls();
    },

    // Switch between vehicles and trailers tabs
    switchFleetTab(tab) {
        this.currentTab = tab;
        document.querySelectorAll('.fleet-tab').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
        this.renderFleetList();
    },

    // Show asset detail page
    async showAssetDetail(assetId) {
        const asset = this.vehicles.find(v => v.id === assetId) || this.trailers.find(t => t.id === assetId);
        if (!asset) return;

        this.currentVehicle = asset;
        this.currentVehicleId = assetId;

        const detailContent = document.getElementById('assetDetailContent');
        const tracking = this.tracking[asset.id] || {};
        const statusText = asset.status.replace('-', ' ').toUpperCase();

        let specs = '';
        if (asset.type === 'trailer') {
            specs = `
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px;">
                    <div style="background: #D9E1F2; padding: 12px; border-radius: 8px;">
                        <div style="font-size: 12px; color: #6b7280; margin-bottom: 4px;">Empty Weight</div>
                        <div style="font-size: 16px; font-weight: 600; color: #1F4E79;">${asset.emptyWeight.toLocaleString()} lbs</div>
                    </div>
                    <div style="background: #D9E1F2; padding: 12px; border-radius: 8px;">
                        <div style="font-size: 12px; color: #6b7280; margin-bottom: 4px;">Capacity</div>
                        <div style="font-size: 16px; font-weight: 600; color: #1F4E79;">${asset.capacity.toLocaleString()} lbs</div>
                    </div>
                </div>
            `;
        } else {
            specs = `
                <div style="background: #D9E1F2; padding: 12px; border-radius: 8px; margin-bottom: 16px;">
                    <div style="font-size: 12px; color: #6b7280; margin-bottom: 4px;">Current Mileage</div>
                    <div style="font-size: 18px; font-weight: 600; color: #1F4E79;">${asset.mileage.toLocaleString()} mi</div>
                </div>
            `;
        }

        // Load photo from IndexedDB if it exists
        let photoHtml = '';
        if (window.photoStorage && asset.hasPhoto) {
            const photoData = await this.getPhoto(assetId);
            if (photoData) {
                photoHtml = `
                    <div style="width: 100%; height: 200px; border-radius: 12px; overflow: hidden; margin-bottom: 16px; background: #e5e7eb;">
                        <img src="${photoData}" alt="${asset.name}" style="width: 100%; height: 100%; object-fit: cover;">
                    </div>
                `;
            }
        }

        detailContent.innerHTML = `
            <h2 style="color: #1F4E79; font-size: 24px; margin-bottom: 8px;">${asset.name}</h2>
            <p style="color: #6b7280; font-size: 14px; margin-bottom: 16px;">${asset.model}</p>

            ${photoHtml}

            <div style="background: #f3f4f6; padding: 8px 12px; border-radius: 6px; margin-bottom: 16px; display: inline-block;">
                <span style="font-size: 12px; font-weight: 600; color: #1F4E79;">${statusText}</span>
            </div>

            ${specs}

            ${asset.type === 'trailer' ? this.trailerLocationHTML(asset) : ''}

            <div style="background: white; border-radius: 12px; padding: 16px; margin-bottom: 16px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                <div style="font-weight: 600; color: #1F4E79; margin-bottom: 12px; font-size: 14px;">Information</div>
                <div style="display: grid; gap: 8px; font-size: 14px;">
                    <div style="display: flex; justify-content: space-between;">
                        <span style="color: #6b7280;">License Plate</span>
                        <span style="font-weight: 600; color: #1f2937;">${asset.licensePlate}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <span style="color: #6b7280;">VIN</span>
                        <span style="font-weight: 600; color: #1f2937; font-family: monospace; font-size: 12px;">${asset.vin}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <span style="color: #6b7280;">Assigned To</span>
                        <span style="font-weight: 600; color: #1f2937;">${asset.assignedTo}</span>
                    </div>
                </div>
            </div>

            <div style="background: white; border-radius: 12px; padding: 16px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                <div style="font-weight: 600; color: #1F4E79; margin-bottom: 12px; font-size: 14px;">Maintenance</div>
                <div style="display: grid; gap: 8px; font-size: 14px;">
                    <div style="display: flex; justify-content: space-between;">
                        <span style="color: #6b7280;">Last Service</span>
                        <span style="font-weight: 600; color: #1f2937;">${asset.lastMaintenance}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <span style="color: #6b7280;">Next Service</span>
                        <span style="font-weight: 600; color: #1f2937;">${asset.nextMaintenance}</span>
                    </div>
                </div>
            </div>

            ${asset.type === 'trailer' ? '' : this.registrationCardHTML(asset)}
            ${asset.type === 'trailer' ? '' : `<div id="recallBox">${this.recallCardHTML(asset)}</div>`}
            ${this.maintenanceSectionHTML(asset)}

            <div style="display: flex; align-items: center; gap: 14px; background: white; border-radius: 12px; padding: 12px; margin-top: 16px;">
                <div id="assetQrMini" style="width: 84px; height: 84px; flex: 0 0 84px;"></div>
                <div style="font-size: 13px; color: #374151; line-height: 1.5;">
                    <div style="font-weight: 700; color: #1F4E79;"><i class="fas fa-qrcode"></i> QR code assigned</div>
                    Scanning this unit's label opens this page.
                    <div style="font-size: 11px; color: #6b7280;">Code: ${asset.id}</div>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 16px;">
                <button onclick="app.openAssetQR()" style="padding: 14px; background: #2E75B6; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">
                    <i class="fas fa-qrcode"></i> View QR
                </button>
                <button onclick="app.openPhotoUpload('${assetId}')" style="padding: 14px; background: #8b5cf6; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">
                    <i class="fas fa-camera"></i> Photo
                </button>
                ${this.currentUser.isAdmin ? `
                    <button onclick="app.showEditAssetModal()" style="padding: 14px; background: #10b981; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                ` : ''}
            </div>
        `;

        this.showPage('assetDetailPage');
        if (asset.type !== 'trailer') this.loadRecallsInto(asset);
        const mini = document.getElementById('assetQrMini');
        if (mini && window.QRCode) new QRCode(mini, { text: this.assetLink(asset.id), width: 84, height: 84, correctLevel: QRCode.CorrectLevel.M });
    },

    // ===== Registration status =====
    registrationInfo(asset) {
        const d = asset.registrationExpiration;
        if (!d) return { level: 'none', label: 'Not set', detail: 'Add the expiration date with Edit.' };
        const days = Math.ceil((new Date(d + 'T23:59:59') - new Date()) / 864e5);
        const nice = new Date(d + 'T12:00:00').toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
        if (days < 0) return { level: 'bad', label: 'Expired', detail: `Expired ${nice} (${-days} day${days === -1 ? '' : 's'} ago)`, days, nice };
        if (days <= 30) return { level: 'warn', label: 'Expires soon', detail: `Expires ${nice} (${days} day${days === 1 ? '' : 's'} left)`, days, nice };
        return { level: 'ok', label: 'Current', detail: `Valid until ${nice}`, days, nice };
    },

    _alertColors: { ok: ['#ecfdf5', '#047857'], warn: ['#fff7ed', '#c2410c'], bad: ['#fef2f2', '#b91c1c'], none: ['#f3f4f6', '#4b5563'] },

    registrationCardHTML(asset) {
        const r = this.registrationInfo(asset);
        const [bg, fg] = this._alertColors[r.level];
        return `
            <div onclick="app.openRegistrationWindow('${asset.id}')" style="background: white; border-radius: 12px; padding: 16px; margin-bottom: 16px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); cursor: pointer;">
                <div style="display: flex; justify-content: space-between; align-items: center; gap: 8px;">
                    <div style="font-weight: 600; color: #1F4E79; font-size: 14px;"><i class="fas fa-id-card"></i> Registration</div>
                    <span style="background: ${bg}; color: ${fg}; font-weight: 700; font-size: 12px; padding: 4px 10px; border-radius: 99px;">${r.label}</span>
                </div>
                <div style="font-size: 14px; color: #1f2937; margin-top: 8px;">${r.detail}</div>
                <div style="font-size: 12px; color: #6b7280; margin-top: 2px;">Plate ${asset.licensePlate || '—'} · tap for details</div>
            </div>`;
    },

    openRegistrationWindow(assetId) {
        const a = this.findAsset(assetId); if (!a) return;
        const r = this.registrationInfo(a);
        const [bg, fg] = this._alertColors[r.level];
        this.openInfoWindow(`Registration · ${a.name}`, `
            <div style="background: ${bg}; color: ${fg}; border-radius: 10px; padding: 14px; font-weight: 700; font-size: 16px;">${r.label}</div>
            <div style="margin-top: 12px; font-size: 15px; color: #1f2937;">${r.detail}</div>
            <div style="display: grid; gap: 8px; margin-top: 16px; font-size: 14px;">
                <div style="display: flex; justify-content: space-between;"><span style="color: #6b7280;">License plate</span><b>${a.licensePlate || '—'}</b></div>
                <div style="display: flex; justify-content: space-between;"><span style="color: #6b7280;">VIN</span><b style="font-family: monospace;">${a.vin || '—'}</b></div>
                <div style="display: flex; justify-content: space-between;"><span style="color: #6b7280;">Expiration date</span><b>${r.nice || 'Not set'}</b></div>
            </div>
            <div style="font-size: 12px; color: #6b7280; margin-top: 14px;">Status is worked out from the expiration date saved for this vehicle. After renewing, update the date with Edit.</div>
            <a href="https://www.txdmv.gov/motorists/register-your-vehicle" target="_blank" rel="noopener" style="display: block; text-align: center; margin-top: 16px; padding: 13px; background: #2E75B6; color: white; border-radius: 8px; font-weight: 600; text-decoration: none;">Renew with Texas DMV</a>
            <button onclick="app.closeInfoWindow(); app.showEditAssetModal();" style="width: 100%; margin-top: 10px; padding: 12px; background: white; color: #2E75B6; border: 1px solid #2E75B6; border-radius: 8px; font-weight: 600;">Update expiration date</button>`);
    },

    // ===== Recalls (NHTSA, by VIN) =====
    _recallMem: {},

    _recallCache(vin, value) {
        const key = 'pdrRecalls:' + vin;
        try {
            if (value) { localStorage.setItem(key, JSON.stringify({ at: Date.now(), ...value })); return value; }
            const c = JSON.parse(localStorage.getItem(key) || 'null');
            return c && Date.now() - c.at < 12 * 3600e3 ? c : null;   // refresh twice a day
        } catch (e) { return null; }
    },

    async fetchRecalls(asset) {
        const vin = (asset.vin || '').trim().toUpperCase();
        if (vin.length !== 17) return { error: 'Add the 17-character VIN to check recalls.' };
        if (this._recallMem[asset.id] && this._recallMem[asset.id].vin === vin) return this._recallMem[asset.id];
        const cached = this._recallCache(vin);
        if (cached) return (this._recallMem[asset.id] = cached);
        try {
            const dec = (await (await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValues/${vin}?format=json`)).json()).Results[0];
            const make = dec.Make, model = dec.Model, year = dec.ModelYear;
            if (!make || !model || !year) return { error: 'This VIN could not be decoded. Check it in Edit.' };
            // NHTSA files recalls under model names like "F-250 SD" or "F-150 SUPER CREW", so check every matching name
            let names = [model];
            try {
                const list = (await (await fetch(`https://api.nhtsa.gov/products/vehicle/models?modelYear=${year}&make=${encodeURIComponent(make)}&issueType=r`)).json()).results || [];
                const base = model.toUpperCase();
                names = [...new Set([model, ...list.map(m => m.model).filter(m => m.toUpperCase() === base || m.toUpperCase().startsWith(base + ' '))])].slice(0, 8);
            } catch (e) {}
            const seen = new Map();
            for (const n of names) {
                const r = await (await fetch(`https://api.nhtsa.gov/recalls/recallsByVehicle?make=${encodeURIComponent(make)}&model=${encodeURIComponent(n)}&modelYear=${year}`)).json();
                for (const x of r.results || []) if (!seen.has(x.NHTSACampaignNumber)) seen.set(x.NHTSACampaignNumber, x);
            }
            const toISO = d => { const [dd, mm, yy] = String(d || '').split('/'); return yy ? `${yy}-${mm}-${dd}` : ''; };
            const recalls = [...seen.values()].map(x => ({
                id: x.NHTSACampaignNumber, date: toISO(x.ReportReceivedDate), component: x.Component, summary: x.Summary,
                consequence: x.Consequence, remedy: x.Remedy, notes: x.Notes, parkIt: x.parkIt, parkOutSide: x.parkOutSide, ota: x.overTheAirUpdate,
                manufacturer: x.Manufacturer,
            })).sort((a, b) => b.date.localeCompare(a.date));
            const out = { vin, make, model, year, recalls };
            this._recallCache(vin, out);
            return (this._recallMem[asset.id] = out);
        } catch (e) {
            return { error: 'Could not reach NHTSA right now. Try again later.' };
        }
    },

    recallStatusOf(asset, id) { return (asset.recallStatus || {})[id] || null; },
    openRecallCount(asset) {
        const data = this._recallMem[asset.id];
        return data && data.recalls ? data.recalls.filter(r => !this.recallStatusOf(asset, r.id)).length : null;
    },

    recallCardHTML(asset) {
        const data = this._recallMem[asset.id];
        const head = right => `
            <div style="display: flex; justify-content: space-between; align-items: center; gap: 8px; margin-bottom: 8px;">
                <div style="font-weight: 600; color: #1F4E79; font-size: 14px;"><i class="fas fa-exclamation-triangle"></i> Safety Recalls</div>${right}
            </div>`;
        const box = inner => `<div style="background: white; border-radius: 12px; padding: 16px; margin-bottom: 16px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">${inner}</div>`;
        if (!data) return box(head('') + '<div style="font-size: 13px; color: #6b7280;">Checking NHTSA for recalls…</div>');
        if (data.error) return box(head('') + `<div style="font-size: 13px; color: #6b7280;">${data.error}</div>`);
        const open = data.recalls.filter(r => !this.recallStatusOf(asset, r.id));
        const [bg, fg] = this._alertColors[open.length ? 'bad' : 'ok'];
        const pill = `<span style="background: ${bg}; color: ${fg}; font-weight: 700; font-size: 12px; padding: 4px 10px; border-radius: 99px;">${open.length ? open.length + ' to review' : 'All reviewed'}</span>`;
        const fmt = d => d ? new Date(d + 'T12:00:00').toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }) : '';
        const row = r => {
            const st = this.recallStatusOf(asset, r.id);
            return `
                <div onclick="app.openRecallWindow('${asset.id}', '${r.id}')" style="padding: 10px 0; border-top: 1px solid #f3f4f6; cursor: pointer; ${st ? 'opacity: 0.55;' : ''}">
                    <div style="display: flex; justify-content: space-between; gap: 8px;">
                        <span style="font-weight: 600; font-size: 13px; color: #1f2937; min-width: 0; overflow-wrap: anywhere;">${(r.component || 'Recall').split(':').slice(-2).join(' · ')}</span>
                        <span style="font-size: 12px; color: #6b7280; white-space: nowrap;">${fmt(r.date)}</span>
                    </div>
                    <div style="font-size: 12px; color: ${st ? '#047857' : '#6b7280'}; margin-top: 2px;">#${r.id}${r.parkIt ? ' · <b style="color:#b91c1c">PARK IT</b>' : ''}${st ? ' · ' + (st.status === 'na' ? 'Does not apply' : 'Completed') : ''}</div>
                </div>`;
        };
        return box(head(pill) + `
            <div style="font-size: 12px; color: #6b7280; margin-bottom: 4px;">${data.year} ${data.make} ${data.model} · ${data.recalls.length} recall${data.recalls.length === 1 ? '' : 's'} on file for this model year. Not all may apply to this truck: check the VIN below, then mark each one Repair done or Doesn't apply.</div>
            ${data.recalls.length ? open.map(row).join('') + data.recalls.filter(r => this.recallStatusOf(asset, r.id)).map(row).join('') : '<div style="font-size: 13px; color: #047857; margin-top: 6px;">No recalls on file for this vehicle.</div>'}
            <a href="https://www.nhtsa.gov/recalls?vin=${encodeURIComponent(asset.vin || '')}" target="_blank" rel="noopener" style="display: block; font-size: 12px; color: #2E75B6; margin-top: 10px;">Check which are still open for this exact VIN on NHTSA.gov →</a>`);
    },

    async loadRecallsInto(asset) {
        const id = asset.id;
        await this.fetchRecalls(asset);
        const box = document.getElementById('recallBox');
        if (box && this.currentVehicle && this.currentVehicle.id === id) box.innerHTML = this.recallCardHTML(this.findAsset(id) || asset);
    },

    async prefetchRecalls() {
        if (this._prefetching) return;
        this._prefetching = true;
        let changed = false;
        for (const v of this.vehicles) if (!this._recallMem[v.id]) { await this.fetchRecalls(v); changed = true; }
        this._prefetching = false;
        if (changed && !this._userBusy()) this.renderFleetList();
    },

    fleetBadgesHTML(asset) {
        const out = [];
        const n = this.openRecallCount(asset);
        if (n) out.push(`<span style="background:#fef2f2;color:#b91c1c;">⚠ ${n} recall${n === 1 ? '' : 's'} to review</span>`);
        const r = this.registrationInfo(asset);
        if (r.level === 'bad') out.push(`<span style="background:#fef2f2;color:#b91c1c;">Registration expired</span>`);
        else if (r.level === 'warn') out.push(`<span style="background:#fff7ed;color:#c2410c;">Registration due in ${r.days}d</span>`);
        if (!out.length) return '';
        return `<div style="display:flex;flex-wrap:wrap;gap:4px;margin-top:6px;">${out.map(b => b.replace('<span style="', '<span style="font-size:11px;font-weight:700;padding:2px 8px;border-radius:99px;')).join('')}</div>`;
    },

    openRecallWindow(assetId, recallId) {
        const a = this.findAsset(assetId);
        const data = this._recallMem[assetId];
        const r = data && data.recalls && data.recalls.find(x => x.id === recallId);
        if (!a || !r) return;
        const st = this.recallStatusOf(a, r.id);
        const sec = (t, v) => v ? `<div style="margin-top: 14px;"><div style="font-size: 12px; font-weight: 700; color: #1F4E79; text-transform: uppercase; letter-spacing: .03em;">${t}</div><div style="font-size: 14px; color: #1f2937; margin-top: 4px; line-height: 1.5;">${v}</div></div>` : '';
        const fmt = d => d ? new Date(d + 'T12:00:00').toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' }) : '';
        this.openInfoWindow(`Recall #${r.id}`, `
            <div style="font-weight: 700; font-size: 16px; color: #1f2937;">${r.component || ''}</div>
            <div style="font-size: 13px; color: #6b7280; margin-top: 4px;">${a.name} · ${data.year} ${data.make} ${data.model} · reported ${fmt(r.date)}</div>
            ${r.parkIt ? '<div style="margin-top: 12px; background: #fef2f2; color: #b91c1c; padding: 10px 12px; border-radius: 8px; font-weight: 700;">Do not drive this vehicle until it is repaired.</div>' : ''}
            ${r.parkOutSide ? '<div style="margin-top: 12px; background: #fff7ed; color: #c2410c; padding: 10px 12px; border-radius: 8px; font-weight: 700;">Park outside and away from buildings until repaired.</div>' : ''}
            ${sec('Summary', r.summary)}
            ${sec('Safety risk', r.consequence)}
            ${sec('Remedy', r.remedy)}
            ${sec('Notes', r.notes)}
            <div style="margin-top: 16px; font-size: 12px; color: #6b7280;">${st ? `Marked ${st.status === 'na' ? '"does not apply"' : 'completed'} by ${st.by || 'team'} on ${fmt((st.at || '').slice(0, 10))}.` : 'This recall is on file for this model. Confirm on NHTSA.gov or with the dealer whether it is open for this VIN.'}</div>
            <a href="https://www.nhtsa.gov/recalls?vin=${encodeURIComponent(a.vin || '')}" target="_blank" rel="noopener" style="display: block; text-align: center; margin-top: 14px; padding: 12px; background: #2E75B6; color: white; border-radius: 8px; font-weight: 600; text-decoration: none;">Check this VIN on NHTSA.gov</a>
            ${st
                ? `<button onclick="app.setRecallStatus('${a.id}', '${r.id}', null)" style="width: 100%; margin-top: 10px; padding: 12px; background: white; color: #b91c1c; border: 1px solid #b91c1c; border-radius: 8px; font-weight: 600;">Mark as open again</button>`
                : `<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 10px;">
                    <button onclick="app.setRecallStatus('${a.id}', '${r.id}', 'done')" style="padding: 12px; background: #047857; color: white; border: none; border-radius: 8px; font-weight: 600;">Repair done</button>
                    <button onclick="app.setRecallStatus('${a.id}', '${r.id}', 'na')" style="padding: 12px; background: white; color: #374151; border: 1px solid #d1d5db; border-radius: 8px; font-weight: 600;">Doesn't apply</button>
                   </div>`}`);
    },

    setRecallStatus(assetId, recallId, status) {
        const a = this.findAsset(assetId); if (!a) return;
        a.recallStatus = { ...(a.recallStatus || {}) };
        if (status) a.recallStatus[recallId] = { status, by: this.currentUser.name, at: new Date().toISOString() };
        else delete a.recallStatus[recallId];
        this.saveData();
        this.closeInfoWindow();
        this.showAssetDetail(assetId);
        this.renderFleetList();
    },

    // Generic pop-up window (used by recalls and registration)
    openInfoWindow(title, html) {
        document.getElementById('infoWindowTitle').textContent = title;
        document.getElementById('infoWindowBody').innerHTML = html;
        const m = document.getElementById('infoWindow');
        m.classList.add('active');
        m.querySelector('.qr-form-sheet').scrollTop = 0;
    },
    closeInfoWindow() { document.getElementById('infoWindow').classList.remove('active'); },

    // ===== Maintenance log for one vehicle / trailer =====
    maintenanceEntries(assetId) {
        return (this.usageLogs[assetId] || [])
            .filter(l => l.type === 'maintenance')
            .map(l => ({ ...l, _date: l.date || (l.timestamp || '').slice(0, 10) }))
            .sort((a, b) => String(b._date).localeCompare(String(a._date)) || String(b.timestamp || '').localeCompare(String(a.timestamp || '')));
    },

    maintenanceSectionHTML(asset) {
        const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
        const fmt = d => { if (!d) return ''; const [y, m, dd] = d.split('-'); return `${m}/${dd}/${y}`; };
        const list = this.maintenanceEntries(asset.id);
        const total = list.reduce((sum, l) => sum + (parseFloat(l.cost) || 0), 0);
        return `
            <div style="background: white; border-radius: 12px; padding: 16px; margin-top: 16px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                <div style="display: flex; flex-wrap: wrap; gap: 8px; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <div style="font-weight: 600; color: #1F4E79; font-size: 14px;"><i class="fas fa-wrench"></i> Maintenance Log</div>
                    <button onclick="app.openMaintLog('${asset.id}')" style="white-space: nowrap; padding: 8px 12px; background: #2E75B6; color: white; border: none; border-radius: 8px; font-weight: 600; font-size: 13px; cursor: pointer;">+ Log maintenance</button>
                </div>
                ${list.length ? `
                    <div style="font-size: 12px; color: #6b7280; margin-bottom: 6px;">${list.length} entr${list.length === 1 ? 'y' : 'ies'}${total ? ` · $${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} total` : ''} · tap one to edit</div>
                    ${list.map(l => `
                        <div onclick="app.openMaintLog('${asset.id}', '${esc(l.id)}')" style="padding: 10px 0; border-top: 1px solid #f3f4f6; cursor: pointer;">
                            <div style="display: flex; justify-content: space-between; gap: 8px; min-width: 0;">
                                <span style="font-weight: 600; color: #1f2937; font-size: 14px; min-width: 0; overflow-wrap: anywhere;">${esc(l.maintenanceType || 'Maintenance')}</span>
                                <span style="color: #6b7280; font-size: 13px; white-space: nowrap;">${fmt(l._date)}</span>
                            </div>
                            ${l.description ? `<div style="font-size: 13px; color: #374151; margin-top: 2px; overflow-wrap: anywhere;">${esc(l.description)}</div>` : ''}
                            <div style="font-size: 12px; color: #6b7280; margin-top: 2px;">${[l.doneBy && 'By ' + esc(l.doneBy), l.mileage && Number(l.mileage).toLocaleString() + ' mi', parseFloat(l.cost) ? '$' + parseFloat(l.cost).toFixed(2) : ''].filter(Boolean).join(' · ')}</div>
                        </div>`).join('')}
                ` : '<div style="font-size: 13px; color: #6b7280;">No maintenance logged yet.</div>'}
            </div>`;
    },

    openMaintLog(assetId, logId) {
        const asset = this.findAsset(assetId);
        if (!asset) return;
        this._maintAssetId = assetId;
        this._maintLogId = logId || null;
        if (!(this.usageLogs[assetId] || []).every(l => l.id) ) {
            // older entries had no id: give them one so they can be edited
            (this.usageLogs[assetId] || []).forEach((l, i) => { if (!l.id) l.id = 'log-' + Date.now().toString(36) + '-' + i; });
        }
        const entry = logId ? (this.usageLogs[assetId] || []).find(l => l.id === logId) : null;
        const today = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);
        document.getElementById('maintLogTitle').textContent = `${entry ? 'Edit' : 'Log'} Maintenance · ${asset.name}`;
        document.getElementById('mlDate').value = entry ? (entry.date || (entry.timestamp || '').slice(0, 10)) : today;
        document.getElementById('mlType').value = entry?.maintenanceType || 'Oil change';
        document.getElementById('mlDesc').value = entry?.description || '';
        document.getElementById('mlMileageGroup').style.display = asset.type === 'trailer' ? 'none' : '';
        document.getElementById('mlMileage').value = entry ? (entry.mileage || '') : (asset.mileage || '');
        document.getElementById('mlCost').value = entry?.cost || '';
        document.getElementById('mlDoneBy').value = entry?.doneBy || '';
        document.getElementById('mlNext').value = entry ? '' : (asset.nextMaintenance || '');
        document.getElementById('mlPeople').innerHTML = this.people.map(p => `<option value="${p.name}">`).join('');
        document.getElementById('mlDelete').style.display = entry ? '' : 'none';
        document.getElementById('maintLogModal').classList.add('active');
    },

    closeMaintLog() {
        document.getElementById('maintLogModal').classList.remove('active');
    },

    submitMaintLog(event) {
        event.preventDefault();
        const asset = this.findAsset(this._maintAssetId);
        if (!asset) return;
        if (!this.usageLogs[asset.id]) this.usageLogs[asset.id] = [];
        const data = {
            type: 'maintenance',
            date: document.getElementById('mlDate').value,
            maintenanceType: document.getElementById('mlType').value,
            description: document.getElementById('mlDesc').value.trim(),
            mileage: asset.type === 'trailer' ? null : (parseInt(document.getElementById('mlMileage').value) || null),
            cost: parseFloat(document.getElementById('mlCost').value) || 0,
            doneBy: document.getElementById('mlDoneBy').value.trim(),
        };
        const existing = this._maintLogId && this.usageLogs[asset.id].find(l => l.id === this._maintLogId);
        if (existing) Object.assign(existing, data, { editedAt: new Date().toISOString() });
        else this.usageLogs[asset.id].push({ id: 'log-' + Date.now().toString(36), timestamp: new Date().toISOString(), ...data });

        // keep the unit's service info current
        const newest = this.maintenanceEntries(asset.id)[0];
        if (newest) asset.lastMaintenance = newest._date;
        const next = document.getElementById('mlNext').value;
        if (next) asset.nextMaintenance = next;
        if (data.mileage && asset.type !== 'trailer' && data.mileage > (asset.mileage || 0)) asset.mileage = data.mileage;

        this.saveData();
        this.closeMaintLog();
        this.showAssetDetail(asset.id);
        this.renderFleetList();
    },

    deleteMaintLog() {
        const asset = this.findAsset(this._maintAssetId);
        if (!asset || !this._maintLogId) return;
        if (!confirm('Delete this maintenance entry?')) return;
        this.usageLogs[asset.id] = (this.usageLogs[asset.id] || []).filter(l => l.id !== this._maintLogId);
        const newest = this.maintenanceEntries(asset.id)[0];
        if (newest) asset.lastMaintenance = newest._date;
        this.saveData();
        this.closeMaintLog();
        this.showAssetDetail(asset.id);
    },

    // Where a trailer is now, and where it has been
    trailerLocationHTML(asset) {
        const use = this.currentUsage[asset.id];
        const now = (use && use.location) || asset.lastLocation;
        const history = (this.usageLogs[asset.id] || []).filter(l => l.location).slice(-5).reverse();
        const when = t => t ? new Date(t).toLocaleString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) : '';
        return `
            <div style="background: white; border-radius: 12px; padding: 16px; margin-bottom: 16px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                <div style="font-weight: 600; color: #1F4E79; margin-bottom: 10px; font-size: 14px;"><i class="fas fa-map-marker-alt"></i> Location</div>
                <div style="font-size: 16px; font-weight: 600; color: #1f2937;">${now || 'Not set yet'}</div>
                <div style="font-size: 12px; color: #6b7280; margin-top: 2px;">${use ? `In use by ${use.userName} since ${when(use.startTime)}` : now ? `Last recorded ${when(asset.lastLocationAt)}` : 'Enter a location when you tap USE'}</div>
                ${history.length ? `
                    <div style="margin-top: 12px; border-top: 1px solid #f3f4f6; padding-top: 10px; font-size: 13px;">
                        <div style="color: #6b7280; font-size: 12px; margin-bottom: 6px;">Recent locations</div>
                        ${history.map(h => `<div style="display: flex; justify-content: space-between; gap: 8px; padding: 4px 0;"><span style="color: #1f2937;">${h.location}</span><span style="color: #6b7280; white-space: nowrap;">${h.userName || ''} · ${when(h.startTime)}</span></div>`).join('')}
                    </div>` : ''}
            </div>`;
    },

    // ===== QR codes for vehicles & trailers =====
    // Permanent link printed on each unit's label
    assetLink(assetId) {
        return `${window.location.origin}${window.location.pathname}?asset=${encodeURIComponent(assetId)}`;
    },

    findAsset(assetId) {
        return this.vehicles.find(v => v.id === assetId) || this.trailers.find(t => t.id === assetId);
    },

    openAssetFromLink() {
        const params = new URLSearchParams(window.location.search);
        const id = this._pendingAssetId || params.get('asset') || params.get('vehicle');
        if (!id) return;
        const asset = this.findAsset(id);
        if (!asset) { this._pendingAssetId = id; return; } // wait for cloud sync
        this._pendingAssetId = null;
        history.replaceState(null, '', window.location.pathname);
        this.currentTab = asset.type === 'trailer' || this.trailers.includes(asset) ? 'trailers' : 'vehicles';
        this.showAssetDetail(id);
    },

    showQRLabels() {
        const label = a => `
            <div class="qr-label">
                <div class="qr-box" data-qr="${this.assetLink(a.id)}"></div>
                <div class="qr-name">${a.name || a.id}</div>
                <div class="qr-sub">${[a.licensePlate, a.appletag].filter(Boolean).join(' • ')}</div>
                <div class="qr-sub">Scan for details &amp; logs</div>
            </div>`;
        const section = (title, list) => list.length ? `
            <div class="qr-labels-section">${title} (${list.length})</div>
            <div class="qr-labels-grid" style="margin-bottom: 18px;">${list.map(label).join('')}</div>` : '';
        const el = document.getElementById('qrLabelsContent');
        el.innerHTML = section('Vehicles', this.vehicles) + section('Trailers', this.trailers)
            || '<div style="color: white;">No vehicles or trailers yet.</div>';
        el.querySelectorAll('[data-qr]').forEach(box => {
            new QRCode(box, { text: box.dataset.qr, width: 280, height: 280, correctLevel: QRCode.CorrectLevel.M, colorDark: '#000000', colorLight: '#ffffff' });
        });
        this.showPage('qrLabelsPage');
        window.scrollTo(0, 0);
    },

    printQRLabels() {
        document.body.classList.add('printing-labels');
        const done = () => { document.body.classList.remove('printing-labels'); window.removeEventListener('afterprint', done); };
        window.addEventListener('afterprint', done);
        setTimeout(() => window.print(), 50);
        setTimeout(done, 60000);
    },

    // Open QR code for current asset
    openAssetQR() {
        if (!this.currentVehicle) return;

        const qrContainer = document.getElementById('qrCodeDisplay');
        qrContainer.innerHTML = '';

        const qrUrl = this.assetLink(this.currentVehicle.id);
        new QRCode(qrContainer, {
            text: qrUrl,
            width: 250,
            height: 250,
            correctLevel: QRCode.CorrectLevel.H,
            colorDark: '#1F4E79',
            colorLight: '#ffffff'
        });

        this.showPage('qrPage');
        this.setActiveNav('qr');
    },

    // Open photo upload
    openPhotoUpload(assetId) {
        const asset = this.vehicles.find(v => v.id === assetId) || this.trailers.find(t => t.id === assetId);
        if (!asset) return;

        // Create a hidden file input
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                // Use Image and Canvas for compression to avoid UI freeze
                const img = new Image();
                img.onload = () => {
                    // Create canvas for image compression
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;

                    // Resize to max 400px while maintaining aspect ratio
                    const maxDim = 400;
                    if (width > maxDim || height > maxDim) {
                        const ratio = Math.min(maxDim / width, maxDim / height);
                        width *= ratio;
                        height *= ratio;
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);

                    // Compress as JPEG with 0.7 quality (reduces ~5MB to <500KB)
                    const compressedPhoto = canvas.toDataURL('image/jpeg', 0.7);

                    // Use setTimeout to prevent UI thread blocking
                    setTimeout(async () => {
                        // Save photo to IndexedDB instead of asset object
                        if (window.photoStorage) {
                            await window.photoStorage.savePhoto(assetId, compressedPhoto);
                        }
                        // share the photo with other phones (non-blocking)
                        if (window.supabase && window.supabase.client) window.supabase.savePhotoCloud(assetId, compressedPhoto);

                        // Mark asset as having a photo (without storing the actual data)
                        asset.hasPhoto = true;
                        asset.photo = null; // Don't store in memory

                        this.saveToLocalStorage();
                        this.renderFleetList();
                        this.showAssetDetail(assetId);
                        alert('✓ Photo uploaded successfully');
                    }, 100);
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        };
        input.click();
    },

    // Show QR form modal
    showQRFormModal(actionType) {
        const formTitle = document.getElementById('qrFormTitle');
        const formFields = document.getElementById('qrFormFields');

        let title = '', fields = '';

        if (actionType === 'checkout') {
            title = '📋 Checkout Asset';
            fields = `
                <div class="form-group">
                    <label class="form-label">Driver Name</label>
                    <input type="text" name="driverName" class="form-input" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Purpose</label>
                    <input type="text" name="purpose" class="form-input" placeholder="e.g., Site visit, Equipment transport" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Expected Return Time</label>
                    <input type="time" name="returnTime" class="form-input" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Notes</label>
                    <input type="text" name="notes" class="form-input" placeholder="Optional">
                </div>
            `;
        } else if (actionType === 'usage') {
            const isVehicle = this.currentVehicle.type === 'vehicle';
            title = '⚡ Log Usage';
            fields = `
                <div class="form-group">
                    <label class="form-label">Driver Name</label>
                    <input type="text" name="driverName" class="form-input" required>
                </div>
                ${isVehicle ? `
                <div class="form-group">
                    <label class="form-label">Starting Mileage</label>
                    <input type="number" name="startMileage" class="form-input" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Ending Mileage</label>
                    <input type="number" name="endMileage" class="form-input" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Fuel Added (gal)</label>
                    <input type="number" name="fuelAdded" class="form-input" step="0.1" value="0">
                </div>
                ` : ''}
                <div class="form-group">
                    <label class="form-label">Trip Notes</label>
                    <input type="text" name="tripNotes" class="form-input" placeholder="Where, what for, etc.">
                </div>
            `;
        } else if (actionType === 'maintenance') {
            title = '🔧 Log Maintenance';
            fields = `
                <div class="form-group">
                    <label class="form-label">Maintenance Type</label>
                    <select name="maintenanceType" class="form-input" required>
                        <option value="">Select...</option>
                        <option value="oil-change">Oil Change</option>
                        <option value="tire-rotation">Tire Rotation</option>
                        <option value="inspection">Inspection</option>
                        <option value="repair">Repair</option>
                        <option value="cleaning">Cleaning</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Description</label>
                    <input type="text" name="description" class="form-input" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Cost ($)</label>
                    <input type="number" name="cost" class="form-input" step="0.01" value="0">
                </div>
                <div class="form-group">
                    <label class="form-label">Notes</label>
                    <input type="text" name="notes" class="form-input" placeholder="Optional">
                </div>
            `;
        }

        formTitle.textContent = title;
        formFields.innerHTML = fields;
        document.getElementById('qrForm').dataset.actionType = actionType;
        document.getElementById('qrFormModal').classList.add('active');
    },

    // Close QR form modal
    closeQRFormModal() {
        document.getElementById('qrFormModal').classList.remove('active');
    },

    // Submit QR form
    submitQRForm(event) {
        event.preventDefault();

        const formData = new FormData(document.getElementById('qrForm'));
        const actionType = document.getElementById('qrForm').dataset.actionType;

        let message = '';
        if (actionType === 'checkout') {
            message = `✓ Asset checked out to ${formData.get('driverName')}`;
        } else if (actionType === 'usage') {
            const driverName = formData.get('driverName');
            message = `✓ Usage logged for ${driverName}`;

            // Log to usage tracking
            if (!this.usageLogs[this.currentVehicleId]) {
                this.usageLogs[this.currentVehicleId] = [];
            }

            this.usageLogs[this.currentVehicleId].push({
                driver: driverName,
                timestamp: new Date().toISOString(),
                startMileage: formData.get('startMileage') || null,
                endMileage: formData.get('endMileage') || null,
                fuelAdded: formData.get('fuelAdded') || 0,
                tripNotes: formData.get('tripNotes') || ''
            });

            // Mark as in use
            this.currentUsage[this.currentVehicleId] = {
                userName: driverName,
                startTime: new Date()
            };

            this.renderFleetList();
        } else if (actionType === 'maintenance') {
            message = `✓ Maintenance logged: ${formData.get('maintenanceType')}`;

            // Log maintenance
            if (!this.usageLogs[this.currentVehicleId]) {
                this.usageLogs[this.currentVehicleId] = [];
            }

            this.usageLogs[this.currentVehicleId].push({
                type: 'maintenance',
                maintenanceType: formData.get('maintenanceType'),
                description: formData.get('description'),
                cost: formData.get('cost') || 0,
                notes: formData.get('notes') || '',
                timestamp: new Date().toISOString()
            });
        }

        this.saveData();
        alert(message);
        this.closeQRFormModal();
    },

    // Download QR code
    downloadQRCode() {
        if (!this.currentVehicle) return;

        const canvas = document.querySelector('#qrCodeDisplay canvas');
        if (canvas) {
            const link = document.createElement('a');
            link.href = canvas.toDataURL('image/png');
            link.download = `${this.currentVehicle.name.replace(/\s+/g, '_')}_QRCode.png`;
            link.click();
        }
    },

    // Show usage details modal
    showUsageDetails(assetId) {
        const asset = this.vehicles.find(v => v.id === assetId) || this.trailers.find(t => t.id === assetId);
        if (!asset || !this.currentUsage[assetId]) return;

        const usage = this.currentUsage[assetId];
        const startTime = new Date(usage.startTime);
        const duration = new Date() - startTime;
        const hours = Math.floor(duration / 3600000);
        const minutes = Math.floor((duration % 3600000) / 60000);

        alert(`\n${asset.name} is currently in use\n\nDriver: ${usage.userName}\nIn use since: ${startTime.toLocaleTimeString()}\nDuration: ${hours}h ${minutes}m\n\nClick "Details" to return to fleet view.`);
    },

    // Show log usage modal with self-assignment
    toggleUsageDropdown(assetId) {
        const dropdown = document.getElementById(`dropdown-${assetId}`);
        if (dropdown) {
            dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
        }
    },

    logUsageWithPerson(assetId, personName) {
        const asset = this.vehicles.find(v => v.id === assetId) || this.trailers.find(t => t.id === assetId);
        if (!asset) return;

        // Get location if it's a trailer (from input field if available)
        let location = '';
        if (asset.type === 'trailer') {
            const locationInput = document.getElementById(`trailerLocation-${assetId}`);
            location = locationInput ? locationInput.value.trim() : '';
            // Don't require location, just use what's entered
        }

        // Mark asset as in use
        this.currentUsage[assetId] = {
            userName: personName,
            startTime: new Date(),
            location: location || null
        };

        // Update asset status to in-use
        asset.status = 'in-use';
        if (location && location.trim()) { asset.lastLocation = location.trim(); asset.lastLocationAt = new Date().toISOString(); }

        // Log to usage logs
        if (!this.usageLogs[assetId]) {
            this.usageLogs[assetId] = [];
        }

        this.usageLogs[assetId].push({
            userName: personName,
            startTime: new Date().toISOString(),
            location: location || null,
            type: 'usage'
        });

        // Save data to localStorage
        this.saveToLocalStorage();

        // Refresh fleet list to show updated status
        this.renderFleetList();

        alert(`✓ ${asset.name} is now in use by ${personName}${location ? ' at ' + location : ''}`);
    },

    showLogUsageModal(assetId) {
        const asset = this.vehicles.find(v => v.id === assetId) || this.trailers.find(t => t.id === assetId);
        if (!asset) return;

        const userName = prompt('Enter your name to log usage:');
        if (!userName || userName.trim() === '') return;

        // For trailers, allow optional location input
        let location = '';
        if (asset.type === 'trailer') {
            location = prompt('Where is the trailer located? (optional)', '');
        }

        // Mark asset as in use
        this.currentUsage[assetId] = {
            userName: userName.trim(),
            startTime: new Date(),
            location: location && location.trim() ? location.trim() : null
        };

        // Update asset status to in-use
        asset.status = 'in-use';
        if (location && location.trim()) { asset.lastLocation = location.trim(); asset.lastLocationAt = new Date().toISOString(); }

        // Log to usage logs
        if (!this.usageLogs[assetId]) {
            this.usageLogs[assetId] = [];
        }

        this.usageLogs[assetId].push({
            userName: userName.trim(),
            startTime: new Date().toISOString(),
            location: location && location.trim() ? location.trim() : null,
            type: 'usage'
        });

        // Save data to localStorage
        this.saveToLocalStorage();

        // Refresh fleet list to show updated status
        this.renderFleetList();

        alert(`✓ ${asset.name} is now marked as in use by ${userName}${location && location.trim() ? ' at ' + location : ''}`);
    },

    // End usage for an asset
    endUsage(assetId) {
        const asset = this.vehicles.find(v => v.id === assetId) || this.trailers.find(t => t.id === assetId);
        if (!asset || !this.currentUsage[assetId]) return;

        const usage = this.currentUsage[assetId];
        const endTime = new Date();

        // Update usage log with end time
        if (this.usageLogs[assetId] && this.usageLogs[assetId].length > 0) {
            this.usageLogs[assetId][this.usageLogs[assetId].length - 1].endTime = endTime.toISOString();
        }

        delete this.currentUsage[assetId];

        // Reset asset status to available
        asset.status = 'available';

        // Save data to localStorage
        this.saveToLocalStorage();

        this.renderFleetList();

        alert(`✓ ${asset.name} usage ended for ${usage.userName}`);
    },

    // [DEPRECATED - moved to renderFleetList]
    // Render vehicle/trailer selector buttons with tabs
    renderVehicleButtons_old() {
        const container = document.getElementById('vehicleButtons');
        container.innerHTML = '';

        // Create tabs
        const tabsContainer = document.createElement('div');
        tabsContainer.style.display = 'grid';
        tabsContainer.style.gridTemplateColumns = '1fr 1fr';
        tabsContainer.style.gap = '8px';
        tabsContainer.style.marginBottom = '16px';

        const vehiclesTab = document.createElement('button');
        vehiclesTab.style.cssText = `
            padding: 10px;
            border: 2px solid ${this.currentTab === 'vehicles' ? '#2E75B6' : '#e5e7eb'};
            background: ${this.currentTab === 'vehicles' ? '#2E75B6' : 'white'};
            color: ${this.currentTab === 'vehicles' ? 'white' : '#1F4E79'};
            border-radius: 6px;
            cursor: pointer;
            font-weight: 600;
            font-size: 14px;
            transition: all 0.2s ease;
        `;
        vehiclesTab.textContent = '🚗 Vehicles';
        vehiclesTab.onclick = () => {
            this.currentTab = 'vehicles';
            if (this.vehicles.length > 0) {
                this.selectVehicle(this.vehicles[0].id);
            }
        };

        const trailersTab = document.createElement('button');
        trailersTab.style.cssText = `
            padding: 10px;
            border: 2px solid ${this.currentTab === 'trailers' ? '#2E75B6' : '#e5e7eb'};
            background: ${this.currentTab === 'trailers' ? '#2E75B6' : 'white'};
            color: ${this.currentTab === 'trailers' ? 'white' : '#1F4E79'};
            border-radius: 6px;
            cursor: pointer;
            font-weight: 600;
            font-size: 14px;
            transition: all 0.2s ease;
        `;
        trailersTab.textContent = '🚛 Trailers';
        trailersTab.onclick = () => {
            this.currentTab = 'trailers';
            if (this.trailers.length > 0) {
                this.selectVehicle(this.trailers[0].id);
            }
        };

        tabsContainer.appendChild(vehiclesTab);
        tabsContainer.appendChild(trailersTab);
        container.appendChild(tabsContainer);

        // Get items to display based on current tab
        const items = this.currentTab === 'vehicles' ? this.vehicles : this.trailers;

        items.forEach(item => {
            const button = document.createElement('button');
            button.className = 'vehicle-btn';
            if (item.id === this.currentVehicleId) {
                button.classList.add('active');
            }

            const statusColor = this.getStatusColor(item.status);
            const details = item.type === 'trailer'
                ? `${item.licensePlate} • ${item.capacity} lbs capacity`
                : `${item.licensePlate} • ${item.mileage.toLocaleString()} mi`;

            button.innerHTML = `
                <div class="vehicle-btn-title">${item.name}</div>
                <div class="vehicle-btn-details">
                    <i class="fas fa-circle" style="color: ${statusColor}; font-size: 8px; margin-right: 4px;"></i>
                    ${details}
                </div>
            `;

            button.onclick = () => this.selectVehicle(item.id);
            container.appendChild(button);
        });
    },

    // [DEPRECATED - moved to showAssetDetail]
    // Select a vehicle or trailer and display its details
    selectVehicle_old(vehicleId) {
        this.currentVehicleId = vehicleId;
        // First try to find in vehicles, then in trailers
        this.currentVehicle = this.vehicles.find(v => v.id === vehicleId) || this.trailers.find(t => t.id === vehicleId);

        if (!this.currentVehicle) return;

        // Update button active states
        this.renderVehicleButtons();

        // Render vehicle details
        this.renderVehicleDetail();
    },

    // [DEPRECATED - moved to showAssetDetail]
    // Render vehicle or trailer detail view
    renderVehicleDetail_old() {
        const container = document.getElementById('vehicleDetail');
        const vehicle = this.currentVehicle;

        if (!vehicle) {
            container.innerHTML = '<p>Select a vehicle or trailer to view details</p>';
            return;
        }

        const tracking = this.tracking[vehicle.id] || {};
        const statusClass = `status-${vehicle.status}`;
        const statusText = vehicle.status.replace('-', ' ').toUpperCase();
        const alerts = this.getVehicleAlerts(vehicle);
        const regStatus = this.isRegistrationExpiring(vehicle);

        let alertHTML = '';
        if (regStatus.expiring && regStatus.status !== 'valid') {
            const alertMsg = regStatus.status === 'expired'
                ? `Registration EXPIRED on ${vehicle.registrationExpiration}`
                : `Registration expires ${vehicle.registrationExpiration} (${regStatus.daysLeft} days)`;
            alertHTML = `
                <div class="alert-section">
                    <div class="alert-title"><i class="fas fa-exclamation-triangle"></i> ${alertMsg}</div>
                </div>
            `;
        }

        // Different info sections for trailers vs vehicles
        let infoSections = '';
        if (vehicle.type === 'trailer') {
            infoSections = `
                <div class="info-section">
                    <div class="section-title"><i class="fas fa-info-circle"></i> Trailer Information</div>
                    <div class="info-row">
                        <span class="info-label">License Plate:</span>
                        <span class="info-value">${vehicle.licensePlate}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">VIN:</span>
                        <span class="info-value" style="font-family: monospace; font-size: 12px;">${vehicle.vin}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Assigned To:</span>
                        <span class="info-value">${vehicle.assignedTo}</span>
                    </div>
                </div>

                <div class="info-section">
                    <div class="section-title"><i class="fas fa-weight"></i> Weight Specifications</div>
                    <div class="info-row">
                        <span class="info-label">Empty Weight:</span>
                        <span class="info-value">${vehicle.emptyWeight.toLocaleString()} lbs</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Capacity:</span>
                        <span class="info-value">${vehicle.capacity.toLocaleString()} lbs</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Gross Weight:</span>
                        <span class="info-value">${vehicle.grossWeight.toLocaleString()} lbs</span>
                    </div>
                </div>

                <div class="info-section">
                    <div class="section-title"><i class="fas fa-wrench"></i> Maintenance</div>
                    <div class="info-row">
                        <span class="info-label">Last Service:</span>
                        <span class="info-value">${vehicle.lastMaintenance}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Next Service:</span>
                        <span class="info-value">${vehicle.nextMaintenance}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Appletag ID:</span>
                        <span class="info-value" style="font-family: monospace; font-size: 12px;">${vehicle.appletag}</span>
                    </div>
                </div>

                <div class="info-section">
                    <div class="section-title"><i class="fas fa-shield-alt"></i> Insurance</div>
                    <div class="info-row">
                        <span class="info-label">Provider:</span>
                        <span class="info-value">${vehicle.insurance?.provider || 'N/A'}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Policy:</span>
                        <span class="info-value" style="font-family: monospace; font-size: 12px;">${vehicle.insurance?.policyNumber || 'N/A'}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Expires:</span>
                        <span class="info-value">${vehicle.insurance?.expirationDate || 'N/A'}</span>
                    </div>
                </div>

                <div class="info-section">
                    <div class="section-title"><i class="fas fa-file-contract"></i> Registration</div>
                    <div class="info-row">
                        <span class="info-label">Expires:</span>
                        <span class="info-value">${vehicle.registrationExpiration || 'TBD'}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Status:</span>
                        <span class="info-value" style="color: ${regStatus.expiring ? '#dc2626' : '#10b981'};">
                            ${regStatus.status === 'valid' ? 'Current' : regStatus.status === 'expired' ? 'EXPIRED' : 'Expiring Soon'}
                        </span>
                    </div>
                </div>
            `;
        } else {
            // Vehicle display
            infoSections = `
                <div class="info-section">
                    <div class="section-title"><i class="fas fa-info-circle"></i> Vehicle Information</div>
                    <div class="info-row">
                        <span class="info-label">License Plate:</span>
                        <span class="info-value">${vehicle.licensePlate}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">VIN:</span>
                        <span class="info-value" style="font-family: monospace; font-size: 12px;">${vehicle.vin}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Mileage:</span>
                        <span class="info-value">${vehicle.mileage.toLocaleString()} mi</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Assigned To:</span>
                        <span class="info-value">${vehicle.assignedTo}</span>
                    </div>
                </div>

                <div class="info-section">
                    <div class="section-title"><i class="fas fa-wrench"></i> Maintenance</div>
                    <div class="info-row">
                        <span class="info-label">Last Service:</span>
                        <span class="info-value">${vehicle.lastMaintenance}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Next Service:</span>
                        <span class="info-value">${vehicle.nextMaintenance}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Appletag ID:</span>
                        <span class="info-value" style="font-family: monospace; font-size: 12px;">${vehicle.appletag}</span>
                    </div>
                </div>

                <div class="info-section">
                    <div class="section-title"><i class="fas fa-shield-alt"></i> Insurance</div>
                    <div class="info-row">
                        <span class="info-label">Provider:</span>
                        <span class="info-value">${vehicle.insurance?.provider || 'N/A'}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Policy:</span>
                        <span class="info-value" style="font-family: monospace; font-size: 12px;">${vehicle.insurance?.policyNumber || 'N/A'}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Expires:</span>
                        <span class="info-value">${vehicle.insurance?.expirationDate || 'N/A'}</span>
                    </div>
                </div>

                <div class="info-section">
                    <div class="section-title"><i class="fas fa-file-contract"></i> Registration</div>
                    <div class="info-row">
                        <span class="info-label">Expires:</span>
                        <span class="info-value">${vehicle.registrationExpiration || 'TBD'}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Status:</span>
                        <span class="info-value" style="color: ${regStatus.expiring ? '#dc2626' : '#10b981'};">
                            ${regStatus.status === 'valid' ? 'Current' : regStatus.status === 'expired' ? 'EXPIRED' : 'Expiring Soon'}
                        </span>
                    </div>
                </div>
            `;
        }

        // Action buttons differ for trailers vs vehicles
        let actionButtons = '';
        if (vehicle.type === 'trailer') {
            actionButtons = `
                <div class="action-buttons">
                    <button class="btn btn-primary" onclick="app.openQRCodePage()">QR Code</button>
                    <button class="btn btn-secondary" onclick="app.openVehicleModal(app.currentVehicle)">More Details</button>
                </div>

                <div class="action-buttons" style="margin-top: 12px;">
                    <button class="btn btn-secondary" onclick="app.openEditVehicleModal()">Edit Info</button>
                    <button class="btn btn-secondary" onclick="app.openMaintenanceForm()">Log Maintenance</button>
                </div>
            `;
        } else {
            actionButtons = `
                <div class="action-buttons">
                    <button class="btn btn-primary" onclick="app.openUsageLogForm()">Log Usage</button>
                    <button class="btn btn-secondary" onclick="app.openQRCodePage()">QR Code</button>
                </div>

                <div class="action-buttons" style="margin-top: 12px;">
                    <button class="btn btn-secondary" onclick="app.openEditVehicleModal()">Edit Info</button>
                    <button class="btn btn-secondary" onclick="app.openVehicleModal(app.currentVehicle)">More Details</button>
                </div>
            `;
        }

        // Show usage history only for vehicles, not trailers
        let usageSection = '';
        if (vehicle.type === 'vehicle') {
            usageSection = `
                <div style="margin-top: 24px; padding-top: 20px; border-top: 2px solid #B8CCE4;">
                    <h3 style="color: #1F4E79; font-size: 16px; font-weight: 600; margin-bottom: 16px;">
                        <i class="fas fa-history"></i> Recent Usage Log
                    </h3>
                    <div id="usageHistory">${this.getUsageHistoryHTML(vehicle.id)}</div>
                </div>
            `;
        }

        container.innerHTML = `
            ${alertHTML}
            <div class="detail-header">
                <div class="detail-title">
                    <h2>${vehicle.name}</h2>
                    <p>${vehicle.model}</p>
                </div>
                <span class="status-badge ${statusClass}">${statusText}</span>
            </div>

            <div class="info-grid">
                ${infoSections}
            </div>

            ${actionButtons}

            ${usageSection}
        `;
    },
    
    // Load tracking data from Appletag for vehicles and trailers
    async loadTrackingData() {
        for (const vehicle of this.vehicles) {
            const tracking = await appletag.getTracking(vehicle.appletag);
            this.tracking[vehicle.id] = tracking;
        }
        for (const trailer of this.trailers) {
            const tracking = await appletag.getTracking(trailer.appletag);
            this.tracking[trailer.id] = tracking;
        }
    },

    // Set up periodic updates
    setupAutoUpdates() {
        setInterval(() => {
            this.loadTrackingData().then(() => {
                // Refresh fleet list if on fleet page
                const fleetPage = document.getElementById('fleetPage');
                if (fleetPage && fleetPage.classList.contains('active') && !this._userBusy()) {
                    this.renderFleetList();
                }
            });
        }, 30000); // Update every 30 seconds
    },


    // Open vehicle details modal
    async openVehicleModal(vehicle) {
        this.currentVehicle = vehicle;
        const modal = document.getElementById('vehicleModal');
        const title = document.getElementById('modalTitle');
        const body = document.getElementById('modalBody');
        const tracking = document.getElementById('trackingDetails');
        const appletag = document.getElementById('appletag');

        const trackingData = this.tracking[vehicle.id] || {};
        const statusColor = this.getStatusColor(vehicle.status);
        const statusText = vehicle.status.replace('-', ' ').toUpperCase();
        const batteryPercent = trackingData.battery || 0;

        title.textContent = `${vehicle.name} (${vehicle.licensePlate})`;

        body.innerHTML = `
            <div class="info-section">
                <div class="section-title"><i class="fas fa-exclamation-triangle"></i> Alerts & Recalls</div>
                ${this.getAlertsHTML(vehicle)}
            </div>

            <div class="info-section">
                <div class="section-title">Vehicle Information</div>
                <div class="info-row">
                    <span class="label">Model:</span>
                    <span class="value">${vehicle.model}</span>
                </div>
                <div class="info-row">
                    <span class="label">VIN:</span>
                    <span class="value">${vehicle.vin}</span>
                </div>
                <div class="info-row">
                    <span class="label">Assigned to:</span>
                    <span class="value">${vehicle.assignedTo}</span>
                </div>
                <div class="info-row">
                    <span class="label">Capacity:</span>
                    <span class="value">${vehicle.capacity}</span>
                </div>
                <div class="info-row">
                    <span class="label">Mileage:</span>
                    <span class="value">${vehicle.mileage.toLocaleString()} miles</span>
                </div>
            </div>

            <div class="info-section">
                <div class="section-title">Maintenance</div>
                <div class="info-row">
                    <span class="label">Last Service:</span>
                    <span class="value">${vehicle.lastMaintenance}</span>
                </div>
                <div class="info-row">
                    <span class="label">Next Service:</span>
                    <span class="value">${vehicle.nextMaintenance}</span>
                </div>
            </div>

            <div class="info-section">
                <div class="section-title">Status</div>
                <div class="info-row">
                    <span class="label">Vehicle Status:</span>
                    <span class="value" style="color: ${statusColor};">${statusText}</span>
                </div>
            </div>

            <div class="info-section">
                <div class="section-title">Insurance & Registration</div>
                <div class="info-row">
                    <span class="label">Insurance Provider:</span>
                    <span class="value">${vehicle.insurance?.provider || 'N/A'}</span>
                </div>
                <div class="info-row">
                    <span class="label">Policy Number:</span>
                    <span class="value">${vehicle.insurance?.policyNumber || 'N/A'}</span>
                </div>
                <div class="info-row">
                    <span class="label">Insurance Expires:</span>
                    <span class="value">${vehicle.insurance?.expirationDate || 'N/A'}</span>
                </div>
                <div class="info-row">
                    <span class="label">Insurance Agent:</span>
                    <span class="value">${vehicle.insurance?.agent || 'N/A'} (${vehicle.insurance?.phone || 'N/A'})</span>
                </div>
                <div class="info-row">
                    <span class="label">Registration Expires:</span>
                    <span class="value">${vehicle.registrationExpiration || 'TBD'}</span>
                </div>
            </div>
        `;

        tracking.innerHTML = `
            <h4><i class="fas fa-satellite"></i> Appletag Tracking (${vehicle.appletag})</h4>
            <div class="tracking-detail-row">
                <span>Location:</span>
                <strong>${trackingData.location || 'Unknown'}</strong>
            </div>
            <div class="tracking-detail-row">
                <span>Coordinates:</span>
                <strong>${trackingData.latitude?.toFixed(4) || 'N/A'}, ${trackingData.longitude?.toFixed(4) || 'N/A'}</strong>
            </div>
            <div class="tracking-detail-row">
                <span>Last Seen:</span>
                <strong>${trackingData.lastSeen || 'N/A'}</strong>
            </div>
            <div class="tracking-detail-row">
                <span>Battery:</span>
                <strong>${batteryPercent}%</strong>
            </div>
            <div class="tracking-detail-row">
                <span>Signal Strength:</span>
                <strong>${trackingData.signal || 'Unknown'}</strong>
            </div>
        `;

        appletag.textContent = vehicle.appletag;

        setTimeout(() => {
            const qrContainer = document.getElementById('qrcode');
            qrContainer.innerHTML = '';
            const qrUrl = this.assetLink(vehicle.id);
            new QRCode(qrContainer, {
                text: qrUrl,
                width: 200,
                height: 200,
                correctLevel: QRCode.CorrectLevel.H
            });
        }, 100);

        modal.classList.add('active');
    },

    // Close vehicle modal
    closeModal() {
        document.getElementById('vehicleModal').classList.remove('active');
    },

    // Open QR code page
    openQRCodePage() {
        if (!this.currentVehicle) return;

        const modal = document.getElementById('qrCodeModal');
        const title = document.getElementById('qrModalTitle');
        const qrContainer = document.getElementById('qrCodeDisplay');
        const appletag = document.getElementById('qrAppletagId');

        title.textContent = `${this.currentVehicle.name} - QR Code`;
        appletag.textContent = this.currentVehicle.appletag;

        // Generate QR code
        qrContainer.innerHTML = '';
        const qrUrl = this.assetLink(this.currentVehicle.id);
        new QRCode(qrContainer, {
            text: qrUrl,
            width: 300,
            height: 300,
            correctLevel: QRCode.CorrectLevel.H,
            colorDark: '#1F4E79',
            colorLight: '#ffffff'
        });

        modal.classList.add('active');
    },

    // Close QR code modal
    closeQRCodeModal() {
        document.getElementById('qrCodeModal').classList.remove('active');
    },

    // Download QR code
    downloadQRCode() {
        if (!this.currentVehicle) return;

        // Get canvas from QR code and download
        const canvas = document.querySelector('#qrCodeDisplay canvas');
        if (canvas) {
            const link = document.createElement('a');
            link.href = canvas.toDataURL('image/png');
            link.download = `${this.currentVehicle.name.replace(/\s+/g, '_')}_QRCode.png`;
            link.click();
        }
    },

    // Open edit vehicle/trailer modal
    openEditVehicleModal() {
        if (!this.currentVehicle) return;

        document.getElementById('editVehicleName').value = this.currentVehicle.name;
        document.getElementById('editVehicleModel').value = this.currentVehicle.model;
        document.getElementById('editVehiclePlate').value = this.currentVehicle.licensePlate;

        // Show/hide mileage field based on type
        const mileageGroup = document.getElementById('editVehicleMileageGroup');
        if (this.currentVehicle.type === 'trailer') {
            if (mileageGroup) mileageGroup.style.display = 'none';
        } else {
            if (mileageGroup) mileageGroup.style.display = 'block';
            document.getElementById('editVehicleMileage').value = this.currentVehicle.mileage;
        }

        document.getElementById('editVehicleStatus').value = this.currentVehicle.status;
        document.getElementById('editVehicleReg').value = this.currentVehicle.registrationExpiration;
        document.getElementById('editVehicleNextMaint').value = this.currentVehicle.nextMaintenance;

        document.getElementById('editVehicleModal').classList.add('active');
    },

    // Close edit vehicle modal
    closeEditVehicleModal() {
        document.getElementById('editVehicleModal').classList.remove('active');
    },

    // Submit vehicle/trailer edit
    submitEditVehicle(event) {
        event.preventDefault();

        let vehicleIndex = -1;
        let array = this.vehicles;

        if (this.currentVehicle.type === 'trailer') {
            vehicleIndex = this.trailers.findIndex(v => v.id === this.currentVehicle.id);
            array = this.trailers;
        } else {
            vehicleIndex = this.vehicles.findIndex(v => v.id === this.currentVehicle.id);
        }

        if (vehicleIndex < 0) return;

        // Update data
        array[vehicleIndex].name = document.getElementById('editVehicleName').value;
        array[vehicleIndex].model = document.getElementById('editVehicleModel').value;
        array[vehicleIndex].licensePlate = document.getElementById('editVehiclePlate').value;

        // Only update mileage if it's a vehicle, not a trailer
        if (array[vehicleIndex].type === 'vehicle') {
            array[vehicleIndex].mileage = parseInt(document.getElementById('editVehicleMileage').value);
        }

        array[vehicleIndex].status = document.getElementById('editVehicleStatus').value;
        array[vehicleIndex].registrationExpiration = document.getElementById('editVehicleReg').value;
        array[vehicleIndex].nextMaintenance = document.getElementById('editVehicleNextMaint').value;

        // Update current vehicle reference
        this.currentVehicle = array[vehicleIndex];

        this.saveData();
        alert('✓ Information updated');
        this.closeEditVehicleModal();

        // Refresh display
        this.renderVehicleButtons();
        this.renderVehicleDetail();
    },

    // Open booking form
    openBookingForm() {
        if (!this.currentVehicle) return;
        document.getElementById('bookingVehicle').value = this.currentVehicle.name;
        document.getElementById('bookingModal').classList.add('active');
    },

    // Close booking modal
    closeBookingModal() {
        document.getElementById('bookingModal').classList.remove('active');
    },

    // Submit booking
    async submitBooking(event) {
        event.preventDefault();

        const booking = {
            vehicle_id: this.currentVehicle.id,
            vehicle_name: document.getElementById('bookingVehicle').value,
            date: document.getElementById('bookingDate').value,
            time: document.getElementById('bookingTime').value,
            duration: parseInt(document.getElementById('bookingDuration').value),
            destination: document.getElementById('bookingDestination').value,
            purpose: document.getElementById('bookingPurpose').value
        };

        // Save booking to localStorage
        // (Cloud sync implemented for people, vehicles, trailers only)

        alert(`✓ Booking request submitted for ${booking.vehicle_name}\nYour manager will respond shortly.`);
        this.closeBookingModal();

        // Reset form
        event.target.reset();
    },

    // Open usage log form
    openUsageLogForm() {
        if (!this.currentVehicle) return;
        document.getElementById('usageVehicle').value = this.currentVehicle.name;
        document.getElementById('usageVehicleId').value = this.currentVehicle.id;
        document.getElementById('usageCurrentMileage').value = this.currentVehicle.mileage;
        document.getElementById('usageModal').classList.add('active');
    },

    // Close usage log modal
    closeUsageModal() {
        document.getElementById('usageModal').classList.remove('active');
    },

    // Submit usage log
    async submitUsageLog(event) {
        event.preventDefault();

        const usage = {
            id: 'usage-' + Date.now(),
            vehicle_id: this.currentVehicle.id,
            vehicle_name: document.getElementById('usageVehicle').value,
            driver_name: document.getElementById('usageDriver').value,
            date: document.getElementById('usageDate').value,
            start_time: document.getElementById('usageStartTime').value,
            end_time: document.getElementById('usageEndTime').value,
            starting_mileage: parseInt(document.getElementById('usageStartMileage').value),
            ending_mileage: parseInt(document.getElementById('usageEndMileage').value),
            fuel_added: parseFloat(document.getElementById('usageFuel').value),
            fuel_cost: parseFloat(document.getElementById('usageFuelCost').value),
            notes: document.getElementById('usageNotes').value,
            timestamp: new Date().toISOString()
        };

        // Calculate distance driven
        usage.distance_driven = usage.ending_mileage - usage.starting_mileage;

        // Initialize usage log for this vehicle if needed
        if (!this.usageLogs[this.currentVehicle.id]) {
            this.usageLogs[this.currentVehicle.id] = [];
        }

        // Add to usage log
        this.usageLogs[this.currentVehicle.id].push(usage);

        // Update vehicle mileage
        this.currentVehicle.mileage = usage.ending_mileage;
        const vehicleIndex = this.vehicles.findIndex(v => v.id === this.currentVehicle.id);
        if (vehicleIndex >= 0) {
            this.vehicles[vehicleIndex].mileage = usage.ending_mileage;
        }

        this.saveData();

        alert(`✓ Usage logged for ${usage.vehicle_name}\nDriver: ${usage.driver_name}\nDistance: ${usage.distance_driven} mi`);
        this.closeUsageModal();

        // Refresh vehicle display
        this.renderVehicleDetail();
        this.renderVehicleButtons();

        // Reset form
        event.target.reset();
    },

    // Get usage log for current vehicle
    getUsageLog(vehicleId) {
        return this.usageLogs[vehicleId] || [];
    },

    // Get recent usage entries (last 5)
    getRecentUsage(vehicleId, limit = 5) {
        const logs = this.getUsageLog(vehicleId);
        return logs.slice(-limit).reverse();
    },

    // Generate HTML for usage history display
    getUsageHistoryHTML(vehicleId) {
        const logs = this.getRecentUsage(vehicleId, 5);

        if (logs.length === 0) {
            return '<p style="color: #6b7280; text-align: center; padding: 20px;">No usage records yet</p>';
        }

        let html = '<table style="width: 100%; border-collapse: collapse; font-size: 13px;">';
        html += '<tr style="background: #f2f4f8; border-bottom: 1px solid #B8CCE4;">';
        html += '<th style="padding: 8px; text-align: left; color: #1F4E79; font-weight: 600;">Driver</th>';
        html += '<th style="padding: 8px; text-align: left; color: #1F4E79; font-weight: 600;">Date</th>';
        html += '<th style="padding: 8px; text-align: left; color: #1F4E79; font-weight: 600;">Distance</th>';
        html += '<th style="padding: 8px; text-align: left; color: #1F4E79; font-weight: 600;">Fuel Added</th>';
        html += '<th style="padding: 8px; text-align: center; color: #1F4E79; font-weight: 600;">Action</th>';
        html += '</tr>';

        logs.forEach(log => {
            html += '<tr style="border-bottom: 1px solid #d1d5db;">';
            html += `<td style="padding: 10px;">${log.driver_name}</td>`;
            html += `<td style="padding: 10px;">${log.date}</td>`;
            html += `<td style="padding: 10px; font-weight: 600;">${log.distance_driven} mi</td>`;
            html += `<td style="padding: 10px;">${log.fuel_added} gal</td>`;
            html += `<td style="padding: 10px; text-align: center;">
                <button class="btn btn-secondary" style="padding: 4px 8px; font-size: 11px;" onclick="app.openEditUsageLog('${log.id}')">Edit</button>
            </td>`;
            html += '</tr>';
        });

        html += '</table>';
        return html;
    },

    // Open edit usage log modal
    openEditUsageLog(logId) {
        if (!this.currentVehicle) return;

        const log = this.usageLogs[this.currentVehicle.id]?.find(l => l.id === logId);
        if (!log) return;

        document.getElementById('editUsageLogId').value = logId;
        document.getElementById('editUsageDriver').value = log.driver_name;
        document.getElementById('editUsageDate').value = log.date;
        document.getElementById('editUsageStartTime').value = log.start_time;
        document.getElementById('editUsageEndTime').value = log.end_time;
        document.getElementById('editUsageStartMileage').value = log.starting_mileage;
        document.getElementById('editUsageEndMileage').value = log.ending_mileage;
        document.getElementById('editUsageFuel').value = log.fuel_added;
        document.getElementById('editUsageFuelCost').value = log.fuel_cost;
        document.getElementById('editUsageNotes').value = log.notes;

        document.getElementById('editUsageModal').classList.add('active');
    },

    // Close edit usage log modal
    closeEditUsageModal() {
        document.getElementById('editUsageModal').classList.remove('active');
    },

    // Submit edit usage log
    submitEditUsageLog(event) {
        event.preventDefault();

        const logId = document.getElementById('editUsageLogId').value;
        const logs = this.usageLogs[this.currentVehicle.id];
        const logIndex = logs.findIndex(l => l.id === logId);

        if (logIndex < 0) return;

        // Update log data
        logs[logIndex].driver_name = document.getElementById('editUsageDriver').value;
        logs[logIndex].date = document.getElementById('editUsageDate').value;
        logs[logIndex].start_time = document.getElementById('editUsageStartTime').value;
        logs[logIndex].end_time = document.getElementById('editUsageEndTime').value;
        logs[logIndex].starting_mileage = parseInt(document.getElementById('editUsageStartMileage').value);
        logs[logIndex].ending_mileage = parseInt(document.getElementById('editUsageEndMileage').value);
        logs[logIndex].fuel_added = parseFloat(document.getElementById('editUsageFuel').value);
        logs[logIndex].fuel_cost = parseFloat(document.getElementById('editUsageFuelCost').value);
        logs[logIndex].notes = document.getElementById('editUsageNotes').value;
        logs[logIndex].distance_driven = logs[logIndex].ending_mileage - logs[logIndex].starting_mileage;

        this.saveData();
        alert('✓ Usage log updated');
        this.closeEditUsageModal();

        // Refresh display
        this.renderVehicleDetail();
    },

    // Open maintenance form
    openMaintenanceForm() {
        if (!this.currentVehicle) return;
        document.getElementById('maintenanceVehicle').value = this.currentVehicle.name;
        document.getElementById('maintenanceModal').classList.add('active');
    },

    // Close maintenance modal
    closeMaintenanceModal() {
        document.getElementById('maintenanceModal').classList.remove('active');
    },

    // Submit maintenance log
    async submitMaintenance(event) {
        event.preventDefault();

        const maintenance = {
            vehicle_id: this.currentVehicle.id,
            vehicle_name: document.getElementById('maintenanceVehicle').value,
            date: document.getElementById('maintenanceDate').value,
            type: document.getElementById('maintenanceType').value,
            description: document.getElementById('maintenanceDesc').value,
            mileage: parseInt(document.getElementById('maintenanceMileage').value),
            cost: parseFloat(document.getElementById('maintenanceCost').value)
        };

        // Keep it with the unit's history and update its service date / mileage
        if (!this.usageLogs[this.currentVehicle.id]) this.usageLogs[this.currentVehicle.id] = [];
        this.usageLogs[this.currentVehicle.id].push({ ...maintenance, type: 'maintenance', timestamp: new Date().toISOString() });
        if (maintenance.date) this.currentVehicle.lastMaintenance = maintenance.date;
        if (this.currentVehicle.type === 'vehicle' && maintenance.mileage > (this.currentVehicle.mileage || 0)) this.currentVehicle.mileage = maintenance.mileage;
        this.saveData();

        alert(`✓ Maintenance logged for ${maintenance.vehicle_name}\nType: ${maintenance.type}`);
        this.closeMaintenanceModal();

        // Reset form
        event.target.reset();
    },


    // Helper: Get status color
    getStatusColor(status) {
        const colors = {
            'available': '#4ade80',
            'in-use': '#facc15',
            'maintenance': '#f87171'
        };
        return colors[status] || '#999';
    },

    // Helper: Get battery color
    getBatteryColor(battery) {
        if (battery >= 60) return 'green';
        if (battery >= 30) return 'medium';
        return 'low';
    },

    // Helper: Get tracking status
    getTrackingStatus(vehicle) {
        const tracking = this.tracking[vehicle.id];
        if (!tracking) return `<span class="status-dot dot-unknown"></span>Unknown`;
        if (tracking.status === 'active') {
            return `<span class="status-dot dot-active"></span>Active`;
        } else {
            return `<span class="status-dot dot-inactive"></span>Inactive`;
        }
    },

    // Check if registration is expiring soon (within 30 days) or expired
    isRegistrationExpiring(vehicle) {
        if (vehicle.registrationExpiration === 'TBD' || !vehicle.registrationExpiration) {
            return { expiring: true, status: 'unknown', daysLeft: null };
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const expirationDate = new Date(vehicle.registrationExpiration);
        expirationDate.setHours(0, 0, 0, 0);

        const daysLeft = Math.ceil((expirationDate - today) / (1000 * 60 * 60 * 24));

        if (daysLeft < 0) {
            return { expiring: true, status: 'expired', daysLeft: 0 };
        } else if (daysLeft <= 30) {
            return { expiring: true, status: 'expiring-soon', daysLeft: daysLeft };
        }

        return { expiring: false, status: 'valid', daysLeft: daysLeft };
    },

    // Get alerts for a vehicle by VIN
    getVehicleAlerts(vehicle) {
        return this.alerts[vehicle.vin] || [];
    },

    // Generate HTML for alerts section
    getAlertsHTML(vehicle) {
        const alerts = this.getVehicleAlerts(vehicle);
        const regStatus = this.isRegistrationExpiring(vehicle);

        let html = '';

        // Registration expiration alert
        if (regStatus.expiring) {
            if (regStatus.status === 'expired') {
                html += `
                    <div style="background: #fee2e2; border-left: 4px solid #dc2626; padding: 12px; margin-bottom: 12px; border-radius: 4px;">
                        <div style="color: #dc2626; font-weight: bold; margin-bottom: 4px;">
                            <i class="fas fa-exclamation-circle"></i> Registration EXPIRED
                        </div>
                        <div style="color: #991b1b; font-size: 0.9em;">
                            Registration expired on ${vehicle.registrationExpiration}. Immediate action required.
                        </div>
                    </div>
                `;
            } else if (regStatus.status === 'expiring-soon') {
                html += `
                    <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 12px; margin-bottom: 12px; border-radius: 4px;">
                        <div style="color: #d97706; font-weight: bold; margin-bottom: 4px;">
                            <i class="fas fa-clock"></i> Registration Expiring Soon
                        </div>
                        <div style="color: #92400e; font-size: 0.9em;">
                            Expires ${vehicle.registrationExpiration} (${regStatus.daysLeft} days remaining)
                        </div>
                    </div>
                `;
            }
        } else if (regStatus.status === 'unknown') {
            html += `
                <div style="background: #e0e7ff; border-left: 4px solid #6366f1; padding: 12px; margin-bottom: 12px; border-radius: 4px;">
                    <div style="color: #4f46e5; font-weight: bold; margin-bottom: 4px;">
                        <i class="fas fa-info-circle"></i> Registration Status Unknown
                    </div>
                    <div style="color: #312e81; font-size: 0.9em;">
                        Expiration date needs to be updated.
                    </div>
                </div>
            `;
        }

        // Recalls/Alerts
        if (alerts.length > 0) {
            html += `<div style="margin-bottom: 12px;"><strong style="color: #333;">Active Recalls/Alerts (${alerts.length})</strong></div>`;
            alerts.forEach(alert => {
                const severityColor = alert.severity === 'high' ? '#dc2626' : alert.severity === 'medium' ? '#f59e0b' : '#10b981';
                const severityBg = alert.severity === 'high' ? '#fee2e2' : alert.severity === 'medium' ? '#fef3c7' : '#ecfdf5';

                html += `
                    <div style="background: ${severityBg}; border-left: 4px solid ${severityColor}; padding: 12px; margin-bottom: 8px; border-radius: 4px;">
                        <div style="color: ${severityColor}; font-weight: bold; margin-bottom: 4px;">
                            ${alert.title}
                            <span style="font-size: 0.8em; text-transform: uppercase; margin-left: 8px;">${alert.severity}</span>
                        </div>
                        <div style="color: #333; font-size: 0.9em; margin-bottom: 4px;">${alert.description}</div>
                        <div style="color: #666; font-size: 0.85em;">
                            <i class="fas fa-calendar"></i> ${alert.date}
                        </div>
                    </div>
                `;
            });
        } else if (!regStatus.expiring) {
            html += '<div style="color: #10b981; padding: 12px; text-align: center;"><i class="fas fa-check-circle"></i> No active alerts</div>';
        }

        return html;
    },

    // ============ USER PROFILE METHODS ============
    openUserProfileModal() {
        const user = this.currentUser;
        const userInitial = user.name.charAt(0).toUpperCase();

        document.getElementById('profileAvatar').textContent = userInitial;
        document.getElementById('userAvatar').textContent = userInitial;
        document.getElementById('profileName').textContent = user.name;
        document.getElementById('profileRole').textContent = user.isAdmin ? 'Administrator' : 'Technician';

        // Find the actual user object from people array
        const userObj = this.people.find(p => p.name === user.name);
        if (userObj) {
            document.getElementById('profileEmail').textContent = userObj.email;

            // Render permissions
            const permissionLabels = {
                'viewVehicles': 'View Vehicles',
                'editVehicles': 'Edit Vehicles',
                'viewTrailers': 'View Trailers',
                'editTrailers': 'Edit Trailers',
                'logUsage': 'Log Usage',
                'logMaintenance': 'Log Maintenance',
                'managePeople': 'Manage People',
                'manageAlerts': 'Manage Alerts'
            };

            let permissionsHTML = '';
            Object.entries(userObj.permissions).forEach(([key, value]) => {
                if (value) {
                    permissionsHTML += `
                        <div style="display: flex; align-items: center; gap: 6px;">
                            <span style="color: #10b981; font-weight: bold;">✓</span>
                            <span style="color: #1f2937;">${permissionLabels[key]}</span>
                        </div>
                    `;
                }
            });

            document.getElementById('profilePermissions').innerHTML = permissionsHTML || '<div style="color: #6b7280;">No permissions</div>';
        }

        document.getElementById('userProfileModal').classList.add('active');
    },

    closeUserProfileModal() {
        document.getElementById('userProfileModal').classList.remove('active');
    },

    // ============ EDIT ASSET METHODS ============
    showEditAssetModal() {
        if (!this.currentVehicle) return;

        const asset = this.currentVehicle;
        const isVehicle = asset.type === 'vehicle';

        let fields = `
            <div class="form-group">
                <label class="form-label">Asset Name</label>
                <input type="text" name="name" class="form-input" value="${asset.name}" required>
            </div>
            <div class="form-group">
                <label class="form-label">Model</label>
                <input type="text" name="model" class="form-input" value="${asset.model}" required>
            </div>
            <div class="form-group">
                <label class="form-label">License Plate</label>
                <input type="text" name="licensePlate" class="form-input" value="${asset.licensePlate}" required>
            </div>
            <div class="form-group">
                <label class="form-label">VIN</label>
                <input type="text" name="vin" class="form-input" value="${asset.vin}" required>
            </div>
            <div class="form-group">
                <label class="form-label">Assigned To</label>
                <input type="text" name="assignedTo" class="form-input" value="${asset.assignedTo}" required>
            </div>
        `;

        if (isVehicle) {
            fields += `
                <div class="form-group">
                    <label class="form-label">Mileage</label>
                    <input type="number" name="mileage" class="form-input" value="${asset.mileage}" required>
                </div>
            `;
        } else {
            fields += `
                <div class="form-group">
                    <label class="form-label">Empty Weight (lbs)</label>
                    <input type="number" name="emptyWeight" class="form-input" value="${asset.emptyWeight}" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Capacity (lbs)</label>
                    <input type="number" name="capacity" class="form-input" value="${asset.capacity}" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Gross Weight (lbs)</label>
                    <input type="number" name="grossWeight" class="form-input" value="${asset.grossWeight}" required>
                </div>
            `;
        }

        fields += `
            <div class="form-group">
                <label class="form-label">Status</label>
                <select name="status" class="form-input" required>
                    <option value="available" ${asset.status === 'available' ? 'selected' : ''}>Available</option>
                    <option value="in-use" ${asset.status === 'in-use' ? 'selected' : ''}>In Use</option>
                    <option value="maintenance" ${asset.status === 'maintenance' ? 'selected' : ''}>Maintenance</option>
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">Last Maintenance</label>
                <input type="date" name="lastMaintenance" class="form-input" value="${asset.lastMaintenance}" required>
            </div>
            <div class="form-group">
                <label class="form-label">Next Maintenance</label>
                <input type="date" name="nextMaintenance" class="form-input" value="${asset.nextMaintenance}" required>
            </div>
            <div class="form-group">
                <label class="form-label">Registration Expires</label>
                <input type="date" name="registrationExpiration" class="form-input" value="${asset.registrationExpiration || ''}">
            </div>
        `;

        document.getElementById('editAssetFields').innerHTML = fields;
        this._editVinBefore = asset.vin;
        document.getElementById('editAssetForm').dataset.assetId = asset.id;
        document.getElementById('editAssetModal').classList.add('active');
    },

    closeEditAssetModal() {
        document.getElementById('editAssetModal').classList.remove('active');
    },

    submitAssetEdit(event) {
        event.preventDefault();

        const formData = new FormData(document.getElementById('editAssetForm'));
        const assetId = document.getElementById('editAssetForm').dataset.assetId;

        // Find and update the asset
        let asset = this.vehicles.find(v => v.id === assetId) || this.trailers.find(t => t.id === assetId);
        if (!asset) return;

        // Update asset properties
        asset.name = formData.get('name');
        asset.model = formData.get('model');
        asset.licensePlate = formData.get('licensePlate');
        asset.vin = formData.get('vin');
        asset.assignedTo = formData.get('assignedTo');
        asset.status = formData.get('status');
        asset.lastMaintenance = formData.get('lastMaintenance');
        asset.nextMaintenance = formData.get('nextMaintenance');
        if (formData.has('registrationExpiration')) asset.registrationExpiration = formData.get('registrationExpiration');
        if (formData.get('vin') !== this._editVinBefore) delete this._recallMem[asset.id];

        if (asset.type === 'vehicle') {
            asset.mileage = parseInt(formData.get('mileage'));
        } else {
            asset.emptyWeight = parseInt(formData.get('emptyWeight'));
            asset.capacity = parseInt(formData.get('capacity'));
            asset.grossWeight = parseInt(formData.get('grossWeight'));
        }

        this.saveData();

        // Update UI
        this.showAssetDetail(assetId);
        this.renderFleetList();
        this.closeEditAssetModal();
        alert('✓ Asset updated successfully');
    },

    // ============ PEOPLE MANAGEMENT METHODS ============
    renderPeopleList() {
        const settingsContent = document.getElementById('settingsContent');

        let html = `
            <div class="settings-section">
                <div class="settings-section-title">Team Members</div>
        `;

        this.people.forEach(person => {
            const permissions = person.permissions;
            const permCount = Object.values(permissions).filter(p => p).length;

            html += `
                <div class="person-card">
                    <div class="person-header">
                        <div>
                            <div class="person-name">${person.name}</div>
                            <div class="person-role">${person.role}</div>
                        </div>
                        <div class="person-actions">
                            ${this.currentUser.isAdmin ? `
                                <button class="person-action-btn edit" onclick="app.openEditPersonModal('${person.id}')">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="person-action-btn delete" onclick="app.deletePerson('${person.id}')">
                                    <i class="fas fa-trash"></i>
                                </button>
                            ` : ''}
                        </div>
                    </div>
                    <div class="person-contact">
                        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
                            <i class="fas fa-envelope" style="color: #6b7280; font-size: 14px;"></i>
                            <span style="font-size: 14px; color: #1f2937;">${person.email}</span>
                        </div>
                        ${person.phone ? `
                        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
                            <i class="fas fa-phone" style="color: #6b7280; font-size: 14px;"></i>
                            <span style="font-size: 14px; color: #1f2937;">${person.phone}</span>
                        </div>
                        ` : ''}
                        ${person.address ? `
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <i class="fas fa-map-marker-alt" style="color: #6b7280; font-size: 14px;"></i>
                            <span style="font-size: 14px; color: #1f2937;">${person.address}</span>
                        </div>
                        ` : ''}
                    </div>
                    <div class="permissions-grid">
                        <div class="permission-item">
                            ${permissions.viewVehicles ? '<span class="permission-check">✓</span>' : '<span class="permission-cross">✗</span>'}
                            View Vehicles
                        </div>
                        <div class="permission-item">
                            ${permissions.editVehicles ? '<span class="permission-check">✓</span>' : '<span class="permission-cross">✗</span>'}
                            Edit Vehicles
                        </div>
                        <div class="permission-item">
                            ${permissions.viewTrailers ? '<span class="permission-check">✓</span>' : '<span class="permission-cross">✗</span>'}
                            View Trailers
                        </div>
                        <div class="permission-item">
                            ${permissions.editTrailers ? '<span class="permission-check">✓</span>' : '<span class="permission-cross">✗</span>'}
                            Edit Trailers
                        </div>
                        <div class="permission-item">
                            ${permissions.logUsage ? '<span class="permission-check">✓</span>' : '<span class="permission-cross">✗</span>'}
                            Log Usage
                        </div>
                        <div class="permission-item">
                            ${permissions.logMaintenance ? '<span class="permission-check">✓</span>' : '<span class="permission-cross">✗</span>'}
                            Log Maintenance
                        </div>
                    </div>
                </div>
            `;
        });

        html += `</div>`;

        if (this.currentUser.isAdmin) {
            html += `<button class="add-person-btn" onclick="app.openEditPersonModal('new')">
                <i class="fas fa-plus"></i> Add Team Member
            </button>`;
        }

        settingsContent.innerHTML = html;
    },

    openEditPersonModal(personId) {
        const title = document.getElementById('editPersonTitle');
        let person = personId === 'new' ? null : this.people.find(p => p.id === personId);

        if (personId === 'new') {
            title.textContent = 'Add Team Member';
            document.getElementById('personName').value = '';
            document.getElementById('personEmail').value = '';
            document.getElementById('personPhone').value = '';
            document.getElementById('personAddress').value = '';
            document.getElementById('personRole').value = 'Technician';
        } else {
            title.textContent = 'Edit Team Member';
            document.getElementById('personName').value = person.name;
            document.getElementById('personEmail').value = person.email;
            document.getElementById('personPhone').value = person.phone || '';
            document.getElementById('personAddress').value = person.address || '';
            document.getElementById('personRole').value = person.role;
        }

        // Generate permission checkboxes
        const permissionsCheckboxes = document.getElementById('permissionsCheckboxes');
        const permissionKeys = ['viewVehicles', 'editVehicles', 'viewTrailers', 'editTrailers', 'logUsage', 'logMaintenance', 'managePeople', 'manageAlerts'];
        const permissionLabels = {
            'viewVehicles': 'View Vehicles',
            'editVehicles': 'Edit Vehicles',
            'viewTrailers': 'View Trailers',
            'editTrailers': 'Edit Trailers',
            'logUsage': 'Log Usage',
            'logMaintenance': 'Log Maintenance',
            'managePeople': 'Manage People',
            'manageAlerts': 'Manage Alerts'
        };

        let checkboxHTML = '<div class="form-checkbox-group">';
        permissionKeys.forEach(key => {
            const isChecked = person && person.permissions[key] ? 'checked' : '';
            checkboxHTML += `
                <div class="form-checkbox-item">
                    <input type="checkbox" id="perm-${key}" name="permissions" value="${key}" ${isChecked}>
                    <label for="perm-${key}">${permissionLabels[key]}</label>
                </div>
            `;
        });
        checkboxHTML += '</div>';

        permissionsCheckboxes.innerHTML = checkboxHTML;

        document.getElementById('editPersonForm').dataset.personId = personId;
        document.getElementById('editPersonModal').classList.add('active');
    },

    closeEditPersonModal() {
        document.getElementById('editPersonModal').classList.remove('active');
    },

    submitPersonEdit(event) {
        event.preventDefault();

        const formData = new FormData(document.getElementById('editPersonForm'));
        const personId = document.getElementById('editPersonForm').dataset.personId;
        const name = formData.get('name');
        const email = formData.get('email');
        const phone = formData.get('phone');
        const address = formData.get('address');
        const role = formData.get('role');

        console.log('✎ Submitting person form:', { personId, name, email, phone, address, role });

        // Get selected permissions
        const permissionsList = document.querySelectorAll('input[name="permissions"]:checked');
        const permissions = {
            viewVehicles: false,
            editVehicles: false,
            viewTrailers: false,
            editTrailers: false,
            logUsage: false,
            logMaintenance: false,
            managePeople: false,
            manageAlerts: false
        };

        permissionsList.forEach(checkbox => {
            permissions[checkbox.value] = true;
        });

        if (personId === 'new') {
            // Add new person
            const newId = `person-${this.people.length + 1}`;
            this.people.push({
                id: newId,
                name: name,
                email: email,
                phone: phone,
                address: address,
                role: role,
                permissions: permissions
            });
            console.log('✓ New person added:', { id: newId, name, email, phone, address, role });
            alert('✓ Team member added successfully');
        } else {
            // Update existing person
            const person = this.people.find(p => p.id === personId);
            if (person) {
                person.name = name;
                person.email = email;
                person.phone = phone;
                person.address = address;
                person.role = role;
                person.permissions = permissions;
                console.log('✓ Person updated:', { id: personId, name, email, phone, address, role });
                alert('✓ Team member updated successfully');
            }
        }

        console.log('→ Calling saveToLocalStorage()');
        this.saveToLocalStorage();
        this.closeEditPersonModal();
        this.renderSettingsPage();
    },

    deletePerson(personId) {
        if (confirm(`Are you sure you want to delete this team member?`)) {
            this.people = this.people.filter(p => p.id !== personId);
            this.saveToLocalStorage();
            alert('✓ Team member deleted');
            this.renderSettingsPage();
        }
    },

    // ============ SETTINGS PAGE METHODS ============
    switchSettingsTab(tab) {
        document.querySelectorAll('.settings-tab').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-tab="${tab}"]`).classList.add('active');

        if (tab === 'people') {
            this.renderPeopleList();
        } else if (tab === 'app') {
            this.renderAppSettings();
        }
    },

    debugLocalStorage() {
        const cloud = this._cloudReady ? '✓ Synced with the cloud' : '… Cloud sync not confirmed yet (data is saved on this device)';
        return `
            <div style="background: #f0f0f0; padding: 16px; border-radius: 8px; margin: 16px 0; font-family: monospace; font-size: 12px;">
                <div style="color: #333; margin-bottom: 8px;"><strong>📦 Saved data</strong></div>
                <div style="color: #666;">✓ ${this.people.length} team members</div>
                <div style="color: #666;">✓ ${this.vehicles.length} vehicles</div>
                <div style="color: #666;">✓ ${this.trailers.length} trailers</div>
                <div style="color: #999; margin-top: 8px; font-size: 11px;">${cloud}</div>
            </div>
        `;
    },

    renderAppSettings() {
        const settingsContent = document.getElementById('settingsContent');

        const html = `
            ${this.debugLocalStorage()}
            <div class="settings-section">
                <div class="settings-section-title">About</div>
                <div style="font-size: 14px; color: #6b7280; line-height: 1.6;">
                    <div style="margin-bottom: 16px;">
                        <strong style="color: #1f2937;">PDR Fleet Tracker</strong><br>
                        Version 1.0.0<br>
                        Vehicle & Trailer Management System
                    </div>
                    <div style="margin-bottom: 16px;">
                        <strong style="color: #1f2937;">Current User</strong><br>
                        ${this.currentUser.name}<br>
                        ${this.currentUser.isAdmin ? 'Administrator' : 'Technician'}
                    </div>
                </div>
            </div>

            <div class="settings-section">
                <div class="settings-section-title">QR Codes</div>
                <div style="font-size: 13px; color: #6b7280; margin-bottom: 10px;">Every vehicle and trailer has its own QR code. Scanning a label opens that unit's page.</div>
                <button onclick="app.showQRLabels()" style="width: 100%; padding: 12px; background: #2E75B6; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">
                    <i class="fas fa-print"></i> Print QR labels
                </button>
            </div>

            <div class="settings-section">
                <div class="settings-section-title">Quick Stats</div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                    <div style="background: #D9E1F2; padding: 12px; border-radius: 8px; text-align: center;">
                        <div style="font-size: 24px; font-weight: 700; color: #1F4E79;">${this.vehicles.length}</div>
                        <div style="font-size: 12px; color: #6b7280; margin-top: 4px;">Vehicles</div>
                    </div>
                    <div style="background: #D9E1F2; padding: 12px; border-radius: 8px; text-align: center;">
                        <div style="font-size: 24px; font-weight: 700; color: #1F4E79;">${this.trailers.length}</div>
                        <div style="font-size: 12px; color: #6b7280; margin-top: 4px;">Trailers</div>
                    </div>
                    <div style="background: #D9E1F2; padding: 12px; border-radius: 8px; text-align: center;">
                        <div style="font-size: 24px; font-weight: 700; color: #1F4E79;">${this.people.length}</div>
                        <div style="font-size: 12px; color: #6b7280; margin-top: 4px;">Team Members</div>
                    </div>
                    <div style="background: #D9E1F2; padding: 12px; border-radius: 8px; text-align: center;">
                        <div style="font-size: 24px; font-weight: 700; color: #1F4E79;">${this.vehicles.filter(v => v.status === 'available').length}</div>
                        <div style="font-size: 12px; color: #6b7280; margin-top: 4px;">Available</div>
                    </div>
                </div>
            </div>
        `;

        settingsContent.innerHTML = html;
    },

    renderSettingsPage() {
        this.showPage('settingsPage');
        this.setActiveNav('settings');
        this.renderPeopleList();
    }
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});

// Expose app globally for HTML onclick handlers
window.app = app;