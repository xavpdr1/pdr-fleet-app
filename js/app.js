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

    // Load data from localStorage
    loadFromLocalStorage() {
        try {
            const savedData = localStorage.getItem('pdrFleetAppData');
            if (savedData) {
                const data = JSON.parse(savedData);
                console.log('📦 Raw data from localStorage:', data);
                if (data.people) {
                    this.people = data.people;
                    console.log(`✓ Loaded ${data.people.length} people from localStorage`);
                }
                if (data.vehicles) {
                    this.vehicles = data.vehicles;
                    console.log(`✓ Loaded ${data.vehicles.length} vehicles from localStorage`);
                }
                if (data.trailers) {
                    this.trailers = data.trailers;
                    console.log(`✓ Loaded ${data.trailers.length} trailers from localStorage`);
                }
                if (data.currentUsage) this.currentUsage = data.currentUsage;
            } else {
                console.log('ℹ️ No saved data in localStorage, using defaults');
            }
        } catch (e) {
            console.error('❌ Error loading from localStorage:', e);
        }
    },

    // Save data to localStorage
    saveToLocalStorage() {
        try {
            // Create a copy of data without photos (to avoid storage quota issues)
            const dataToSave = {
                people: this.people,
                vehicles: this.vehicles.map(v => ({
                    ...v,
                    photo: null  // Don't store large base64 photos in localStorage
                })),
                trailers: this.trailers.map(t => ({
                    ...t,
                    photo: null  // Don't store large base64 photos in localStorage
                })),
                currentUsage: this.currentUsage,
                lastSaved: new Date().toISOString()
            };

            const jsonString = JSON.stringify(dataToSave);

            // Check size before saving (localStorage limit is usually 5-10MB)
            if (jsonString.length > 4000000) {
                console.warn('Data too large for localStorage, clearing old photos...');
                // If still too large, just save people and currentUsage
                const minimalData = {
                    people: this.people,
                    currentUsage: this.currentUsage,
                    lastSaved: new Date().toISOString()
                };
                localStorage.setItem('pdrFleetAppData', JSON.stringify(minimalData));
                console.log('✓ Saved minimal data to localStorage (photos excluded)');
            } else {
                localStorage.setItem('pdrFleetAppData', jsonString);
                console.log('✓ Saved data to localStorage');
            }
        } catch (e) {
            console.error('Error saving to localStorage:', e);
            // Try to clear space and retry
            try {
                const minimalData = {
                    people: this.people,
                    currentUsage: this.currentUsage,
                    lastSaved: new Date().toISOString()
                };
                localStorage.setItem('pdrFleetAppData', JSON.stringify(minimalData));
                console.log('✓ Saved minimal data after quota error');
            } catch (e2) {
                console.error('Failed to save even minimal data:', e2);
            }
        }

        // Also sync to Supabase cloud (non-blocking)
        this.syncToCloud();
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

        // Initialize Supabase cloud sync
        try {
            await window.supabase.init();
            console.log('✓ Supabase initialized for cloud sync');

            // Try to load from cloud first
            const cloudData = await window.supabase.loadFromCloud();
            if (cloudData && cloudData.people && cloudData.people.length > 0) {
                console.log('✓ Loading data from Supabase cloud...');
                this.people = cloudData.people;
                this.vehicles = cloudData.vehicles || [];
                this.trailers = cloudData.trailers || [];
                // Also save to localStorage as backup
                this.saveToLocalStorage();
            } else {
                // Fall back to localStorage if cloud is empty
                console.log('ℹ️ Cloud empty, loading from localStorage...');
                this.loadFromLocalStorage();
                // Sync localStorage data to cloud
                await this.syncToCloud();
            }
        } catch (err) {
            console.warn('⚠️ Cloud sync unavailable, using localStorage:', err);
            this.loadFromLocalStorage();
        }

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
        const navMap = { 'fleet': 0, 'qr': 1, 'settings': 2 };
        if (navMap[navId] !== undefined) {
            navItems[navMap[navId]].classList.add('active');
        }
    },

    // Render fleet list (vehicles and trailers)
    renderFleetList() {
        const assetList = document.getElementById('assetList');
        const items = this.currentTab === 'vehicles' ? this.vehicles : this.trailers;

        assetList.innerHTML = '';
        items.forEach(item => {
            const card = document.createElement('div');
            card.className = 'asset-card';

            const fallbackEmoji = this.currentTab === 'vehicles' ? '🚗' : '🚛';
            const iconDisplay = item.photo ?
                `<div style="width: 56px; height: 56px; flex-shrink: 0; overflow: hidden; border-radius: 8px; background: #e5e7eb; display: flex; align-items: center; justify-content: center;"><img src="${item.photo}" alt="${item.name}" style="width: 100%; height: 100%; object-fit: cover;"></div>`
                : `<div style="font-size: 28px; display: flex; align-items: center; justify-content: center; width: 56px; height: 56px; flex-shrink: 0; background: #e5e7eb; border-radius: 8px;">${fallbackEmoji}</div>`;
            const secondaryInfo = item.type === 'trailer'
                ? `${item.licensePlate} • ${item.capacity} lbs`
                : `${item.licensePlate} • ${item.mileage.toLocaleString()} mi`;

            const statusColor = this.getStatusColor(item.status);
            const isInUse = this.currentUsage[item.id];
            const usageInfo = isInUse ? `<div style="font-size: 12px; color: #f59e0b; font-weight: 600; margin-top: 4px;">⚠️ In use by ${isInUse.userName}${isInUse.location ? ` at ${isInUse.location}` : ''}</div>` : '';

            card.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: flex-start; width: 100%;">
                    <div style="flex: 1;" onclick="app.showAssetDetail('${item.id}')">
                        <div class="asset-icon">${iconDisplay}</div>
                        <div class="asset-info">
                            <div class="asset-name">${item.name}</div>
                            <div class="asset-details">
                                <span class="status-dot" style="background: ${statusColor};"></span>
                                ${secondaryInfo}
                            </div>
                            ${usageInfo}
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
                                        <div style="padding: 10px 12px; border-bottom: 1px solid #f3f4f6;">
                                            <input type="text" id="trailerLocation-${item.id}" placeholder="Location" style="width: 100%; padding: 6px 8px; border: 1px solid #d1d5db; border-radius: 4px; font-size: 12px;">
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
        });
    },

    // Switch between vehicles and trailers tabs
    switchFleetTab(tab) {
        this.currentTab = tab;
        document.querySelectorAll('.fleet-tab').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
        this.renderFleetList();
    },

    // Show asset detail page
    showAssetDetail(assetId) {
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

        detailContent.innerHTML = `
            <h2 style="color: #1F4E79; font-size: 24px; margin-bottom: 8px;">${asset.name}</h2>
            <p style="color: #6b7280; font-size: 14px; margin-bottom: 16px;">${asset.model}</p>

            <div style="background: #f3f4f6; padding: 8px 12px; border-radius: 6px; margin-bottom: 16px; display: inline-block;">
                <span style="font-size: 12px; font-weight: 600; color: #1F4E79;">${statusText}</span>
            </div>

            ${specs}

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
    },

    // Open QR code for current asset
    openAssetQR() {
        if (!this.currentVehicle) return;

        const qrContainer = document.getElementById('qrCodeDisplay');
        qrContainer.innerHTML = '';

        const qrUrl = `${window.location.href}?asset=${this.currentVehicle.id}`;
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
                // Store the base64 image in the asset
                asset.photo = event.target.result;
                this.saveToLocalStorage();
                this.renderFleetList();
                this.showAssetDetail(assetId);
                alert('✓ Photo uploaded successfully');
            };
            reader.readAsDataURL(file);
        };
        input.click();
    },

    // Log usage with person selection
    logUsageWithPerson(assetId, personName) {
        const asset = this.vehicles.find(v => v.id === assetId) || this.trailers.find(t => t.id === assetId);
        if (!asset) return;

        // Get location if it's a trailer (from input field if available)
        let location = '';
        if (asset.type === 'trailer') {
            const locationInput = document.getElementById(`trailerLocation-${assetId}`);
            location = locationInput ? locationInput.value.trim() : '';
        }

        // Mark asset as in use
        this.currentUsage[assetId] = {
            userName: personName,
            startTime: new Date(),
            location: location || null
        };

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

        // Save data to localStorage and cloud
        this.saveToLocalStorage();

        // Refresh fleet list
        this.renderFleetList();

        alert(`✓ ${asset.name} is now in use by ${personName}${location ? ' at ' + location : ''}`);
    },

    // Toggle usage dropdown
    toggleUsageDropdown(assetId) {
        const dropdown = document.getElementById(`dropdown-${assetId}`);
        if (dropdown) {
            dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
        }
    },

    // Show usage details
    showUsageDetails(assetId) {
        const asset = this.vehicles.find(v => v.id === assetId) || this.trailers.find(t => t.id === assetId);
        if (!asset || !this.currentUsage[assetId]) return;

        const usage = this.currentUsage[assetId];
        const startTime = new Date(usage.startTime);
        const duration = new Date() - startTime;
        const hours = Math.floor(duration / 3600000);
        const minutes = Math.floor((duration % 3600000) / 60000);

        alert(`\n${asset.name} is currently in use\n\nDriver: ${usage.userName}\nIn use since: ${startTime.toLocaleTimeString()}\nDuration: ${hours}h ${minutes}m\n\nClick OK to return to fleet view.`);
    },

    // End usage for an asset
    endUsage(assetId) {
        const asset = this.vehicles.find(v => v.id === assetId) || this.trailers.find(t => t.id === assetId);
        if (!asset || !this.currentUsage[assetId]) return;

        const usage = this.currentUsage[assetId];
        delete this.currentUsage[assetId];

        // Save to localStorage and cloud
        this.saveToLocalStorage();
        this.renderFleetList();

        alert(`✓ ${asset.name} usage ended for ${usage.userName}`);
    },

    // Get status color
    getStatusColor(status) {
        const colors = {
            'available': '#10b981',
            'in-use': '#f59e0b',
            'maintenance': '#ef4444',
            'retired': '#6b7280'
        };
        return colors[status] || '#6b7280';
    },

    // Load tracking data
    async loadTrackingData() {
        for (const vehicle of this.vehicles) {
            this.tracking[vehicle.id] = {
                location: 'Field',
                lastSeen: new Date().toLocaleTimeString(),
                battery: Math.floor(Math.random() * 40) + 60
            };
        }
        for (const trailer of this.trailers) {
            this.tracking[trailer.id] = {
                location: 'Yard',
                lastSeen: new Date().toLocaleTimeString(),
                battery: Math.floor(Math.random() * 40) + 60
            };
        }
    },

    // Setup auto updates
    setupAutoUpdates() {
        setInterval(() => {
            this.loadTrackingData().then(() => {
                const fleetPage = document.getElementById('fleetPage');
                if (fleetPage && fleetPage.classList.contains('active')) {
                    this.renderFleetList();
                }
            });
        }, 30000);
    }
};

// Initialize app when document is loaded
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});
