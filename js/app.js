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
                if (data.people) this.people = data.people;
                if (data.vehicles) this.vehicles = data.vehicles;
                if (data.trailers) this.trailers = data.trailers;
                if (data.currentUsage) this.currentUsage = data.currentUsage;
                console.log('✓ Loaded data from localStorage');
            }
        } catch (e) {
            console.error('Error loading from localStorage:', e);
        }
    },

    // Save data to localStorage
    saveToLocalStorage() {
        try {
            const data = {
                people: this.people,
                vehicles: this.vehicles,
                trailers: this.trailers,
                currentUsage: this.currentUsage,
                lastSaved: new Date().toISOString()
            };
            localStorage.setItem('pdrFleetAppData', JSON.stringify(data));
            console.log('✓ Saved data to localStorage');
        } catch (e) {
            console.error('Error saving to localStorage:', e);
        }
    },

    // Initialize the app
    async init() {
        console.log('Initializing PDR Fleet Tracker...');

        // Load any previously saved data from localStorage
        this.loadFromLocalStorage();

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

            const icon = this.currentTab === 'vehicles' ? '🚗' : '🚛';
            const secondaryInfo = item.type === 'trailer'
                ? `${item.licensePlate} • ${item.capacity} lbs`
                : `${item.licensePlate} • ${item.mileage.toLocaleString()} mi`;

            const statusColor = this.getStatusColor(item.status);
            const isInUse = this.currentUsage[item.id];
            const usageInfo = isInUse ? `<div style="font-size: 12px; color: #f59e0b; font-weight: 600; margin-top: 4px;">⚠️ In use by ${isInUse.userName}</div>` : '';

            card.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: flex-start; width: 100%;">
                    <div style="flex: 1;" onclick="app.showAssetDetail('${item.id}')">
                        <div class="asset-icon">${icon}</div>
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
                            <div id="dropdown-${item.id}" style="display: none; position: absolute; top: 100%; right: 0; background: white; border: 1px solid #e5e7eb; border-radius: 6px; min-width: 180px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); z-index: 1000; margin-top: 4px;">
                                <div style="padding: 8px 0;">
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

        // Mark asset as in use
        this.currentUsage[assetId] = {
            userName: personName,
            startTime: new Date()
        };

        // Log to usage logs
        if (!this.usageLogs[assetId]) {
            this.usageLogs[assetId] = [];
        }

        this.usageLogs[assetId].push({
            userName: personName,
            startTime: new Date().toISOString(),
            type: 'usage'
        });

        // Save data to localStorage
        this.saveToLocalStorage();

        // Refresh fleet list to show updated status
        this.renderFleetList();

        alert(`✓ ${asset.name} is now in use by ${personName}`);
    },

    showLogUsageModal(assetId) {
        const asset = this.vehicles.find(v => v.id === assetId) || this.trailers.find(t => t.id === assetId);
        if (!asset) return;

        const userName = prompt('Enter your name to log usage:');
        if (!userName || userName.trim() === '') return;

        // Mark asset as in use
        this.currentUsage[assetId] = {
            userName: userName.trim(),
            startTime: new Date()
        };

        // Log to usage logs
        if (!this.usageLogs[assetId]) {
            this.usageLogs[assetId] = [];
        }

        this.usageLogs[assetId].push({
            userName: userName.trim(),
            startTime: new Date().toISOString(),
            type: 'usage'
        });

        // Save data to localStorage
        this.saveToLocalStorage();

        // Refresh fleet list to show updated status
        this.renderFleetList();

        alert(`✓ ${asset.name} is now marked as in use by ${userName}`);
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
                if (fleetPage && fleetPage.classList.contains('active')) {
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
            const qrUrl = `${window.location.href}?vehicle=${vehicle.id}&appletag=${vehicle.appletag}`;
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
        const qrUrl = `${window.location.href}?vehicle=${this.currentVehicle.id}&appletag=${this.currentVehicle.appletag}`;
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

        // Try Supabase first, fallback to localStorage
        if (supabase.initialized) {
            await supabase.createBooking(booking);
        } else {
            await supabase.saveBookingLocal(booking);
        }

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

        // Try Supabase first, fallback to localStorage
        if (supabase.initialized) {
            await supabase.createUsageLog(usage);
        } else {
            await supabase.saveUsageLogLocal(usage);
        }

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

        // Try Supabase first, fallback to localStorage
        if (supabase.initialized) {
            await supabase.createMaintenance(maintenance);
        } else {
            await supabase.saveMaintenanceLocal(maintenance);
        }

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
        `;

        document.getElementById('editAssetFields').innerHTML = fields;
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

        if (asset.type === 'vehicle') {
            asset.mileage = parseInt(formData.get('mileage'));
        } else {
            asset.emptyWeight = parseInt(formData.get('emptyWeight'));
            asset.capacity = parseInt(formData.get('capacity'));
            asset.grossWeight = parseInt(formData.get('grossWeight'));
        }

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
                alert('✓ Team member updated successfully');
            }
        }

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

    renderAppSettings() {
        const settingsContent = document.getElementById('settingsContent');

        const html = `
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