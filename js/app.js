// PDR Fleet Management - Driver Logs, Maintenance & Recalls

const app = {

    authorizedReps: [
        { name: 'Xavier Fernandez', role: 'Fleet Manager' },
        { name: 'Curtis Wall', role: 'Authorized User' }
    ],

    vehicles: [
        {
            id: 'truck-1',
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
            appletag: 'APT-001-TRK1',
            registrationExpiration: '2025-06-30'
        },
        {
            id: 'truck-2',
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
            appletag: 'APT-002-TRK2',
            registrationExpiration: '2026-10-15'
        },
        {
            id: 'bmw-x5',
            name: 'BMW X5',
            model: '2020 BMW X5',
            licensePlate: 'TBD',
            vin: '5UXCR6C00L9D57150',
            assignedTo: 'Admin/Operations',
            capacity: '5 seats',
            primaryUse: 'Executive transport, client meetings',
            mileage: 0,
            status: 'available',
            lastMaintenance: 'TBD',
            appletag: 'APT-003-BMW',
            registrationExpiration: 'TBD'
        }
    ],

    // Driver logs: mileage/hours, routes, fuel, trip notes
    driverLogs: [
        {
            id: 'log-001',
            vehicleId: 'truck-1',
            date: '2026-09-28',
            driver: 'Paulo Ribeiro',
            mileage: { start: 48450, end: 48500, total: 50 },
            route: 'Lewisville to Plano - Site visits',
            fuelUsed: 2.5,
            notes: 'Completed PDR inspections at 3 sites. Vehicle running smoothly.'
        },
        {
            id: 'log-002',
            vehicleId: 'truck-2',
            date: '2026-09-27',
            driver: 'Paulo Ribeiro',
            mileage: { start: 41100, end: 41200, total: 100 },
            route: 'Dallas to Arlington - Equipment transport',
            fuelUsed: 4.2,
            notes: 'Transported repair equipment. Minor dent on rear door - logged for repair.'
        }
    ],

    // Maintenance logs
    maintenanceLogs: [
        {
            id: 'maint-001',
            vehicleId: 'truck-1',
            date: '2026-09-20',
            type: 'oil-change',
            description: 'Regular oil change and filter replacement',
            mileage: 48400,
            cost: 65.00
        },
        {
            id: 'maint-002',
            vehicleId: 'truck-2',
            date: '2026-09-18',
            type: 'tire-rotation',
            description: 'Tire rotation and balance check',
            mileage: 40950,
            cost: 85.00
        }
    ],

    // Recalls and alerts
    recalls: {
        '1FTFW1ED9MFB41842': [
            { id: 'recall-001', type: 'recall', title: 'Brake Pad Inspection', description: 'Regular inspection recommended by manufacturer', date: '2026-09-25', severity: 'medium' }
        ],
        '1FT8W2BT9MEC05393': [
            { id: 'recall-002', type: 'recall', title: 'Tire Pressure Monitoring', description: 'Sensor calibration needed', date: '2026-10-01', severity: 'low' }
        ]
    },

    currentVehicle: null,
    currentView: 'all',
    statusFilter: '',

    // Initialize the app
    async init() {
        console.log('Initializing PDR Fleet Management...');

        // Check for single-vehicle mode from URL parameters
        const params = new URLSearchParams(window.location.search);
        const vehicleParam = params.get('vehicle') || params.get('name');
        if (vehicleParam) {
            this.singleVehicleMode = true;
            this.singleVehicleId = vehicleParam;
        }

        // Render initial view
        this.renderVehicles();
        this.renderAuthorizedUsers();
    },

    // Render authorized users
    renderAuthorizedUsers() {
        const container = document.getElementById('authorizedUsersList');
        if (!container) return;

        container.innerHTML = '';

        this.authorizedReps.forEach(rep => {
            const card = document.createElement('div');
            card.className = 'auth-user-card';

            // Get initials for avatar
            const initials = rep.name
                .split(' ')
                .map(n => n[0])
                .join('')
                .toUpperCase();

            card.innerHTML = `
                <div class="user-avatar">${initials}</div>
                <div class="user-info">
                    <div class="user-name">${rep.name}</div>
                    <div class="user-role">${rep.role}</div>
                </div>
            `;

            container.appendChild(card);
        });
    },

    // Render all vehicles
    renderVehicles() {
        const grid = document.getElementById('vehiclesGrid');
        grid.innerHTML = '';

        let filtered = this.vehicles.filter(v => {
            if (this.statusFilter && v.status !== this.statusFilter) return false;
            if (this.currentView === 'active') return v.status === 'in-use';
            if (this.currentView === 'qronly') return true;
            return true;
        });

        // Filter to single vehicle if in single-vehicle mode
        if (this.singleVehicleMode && this.singleVehicleId) {
            filtered = filtered.filter(v =>
                v.id === this.singleVehicleId ||
                v.name === this.singleVehicleId
            );
            // Hide controls in single-vehicle mode
            const controls = document.querySelector('.controls');
            if (controls) controls.style.display = 'none';
        }

        if (filtered.length === 0) {
            grid.innerHTML = '<div class="empty-state" style="grid-column: 1/-1;"><i class="fas fa-inbox"></i><p>No vehicles found</p></div>';
            return;
        }

        filtered.forEach(vehicle => {
            if (this.currentView === 'qronly') {
                this.renderQRCard(vehicle);
            } else {
                this.renderVehicleCard(vehicle);
            }
        });
    },

    // Render a single vehicle card (focused on driver logs)
    renderVehicleCard(vehicle) {
        const grid = document.getElementById('vehiclesGrid');
        const card = document.createElement('div');
        card.className = 'vehicle-card';
        card.onclick = () => this.openVehicleModal(vehicle);

        const statusColor = this.getStatusColor(vehicle.status);
        const statusText = vehicle.status.replace('-', ' ').toUpperCase();

        // Get recent driver log
        const recentLog = this.driverLogs.find(log => log.vehicleId === vehicle.id);
        const lastLogDate = recentLog ? recentLog.date : 'No logs yet';
        const lastMileage = recentLog ? recentLog.mileage.end : vehicle.mileage;

        // Check for recalls
        const vehicleRecalls = this.recalls[vehicle.vin] || [];
        const regStatus = this.isRegistrationExpiring(vehicle);
        let alertBadgeHTML = '';

        if (vehicleRecalls.length > 0 || regStatus.expiring) {
            alertBadgeHTML = '<div style="margin-top: 8px; display: flex; gap: 6px; flex-wrap: wrap;">';
            if (vehicleRecalls.length > 0) {
                alertBadgeHTML += `<span style="background: #fee2e2; color: #dc2626; padding: 4px 8px; border-radius: 3px; font-size: 0.8em; font-weight: 500;"><i class="fas fa-exclamation-circle"></i> ${vehicleRecalls.length} Recall${vehicleRecalls.length > 1 ? 's' : ''}</span>`;
            }
            if (regStatus.expiring) {
                const badgeColor = regStatus.status === 'expired' ? '#fee2e2' : '#fef3c7';
                const badgeTextColor = regStatus.status === 'expired' ? '#dc2626' : '#d97706';
                const badgeText = regStatus.status === 'expired' ? 'Reg. EXPIRED' : `Reg. in ${regStatus.daysLeft}d`;
                alertBadgeHTML += `<span style="background: ${badgeColor}; color: ${badgeTextColor}; padding: 4px 8px; border-radius: 3px; font-size: 0.8em; font-weight: 500;"><i class="fas fa-clock"></i> ${badgeText}</span>`;
            }
            alertBadgeHTML += '</div>';
        }

        card.innerHTML = `
            <div class="card-header">
                <div>
                    <div class="vehicle-name">${vehicle.name}</div>
                    <div class="vehicle-model">${vehicle.model}</div>
                </div>
                <div class="status-badge">${statusText}</div>
            </div>
            ${alertBadgeHTML}
            <div class="card-body">
                <div class="info-section">
                    <div class="section-title">Vehicle Info</div>
                    <div class="info-row">
                        <span class="label">License Plate:</span>
                        <span class="value">${vehicle.licensePlate}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Appletag ID:</span>
                        <span class="value" style="color: #667eea; font-family: monospace;">${vehicle.appletag}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Current Mileage:</span>
                        <span class="value">${lastMileage.toLocaleString()} mi</span>
                    </div>
                </div>

                <div class="info-section">
                    <div class="section-title">Driver Log</div>
                    <div class="info-row">
                        <span class="label">Last Log:</span>
                        <span class="value">${lastLogDate}</span>
                    </div>
                    ${recentLog ? `
                    <div class="info-row">
                        <span class="label">Driver:</span>
                        <span class="value">${recentLog.driver}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Route:</span>
                        <span class="value">${recentLog.route}</span>
                    </div>
                    ` : '<div class="info-row"><span style="color: #999;">No driver logs yet</span></div>'}
                </div>

                <div class="info-section">
                    <div class="section-title">Maintenance</div>
                    <div class="info-row">
                        <span class="label">Last Service:</span>
                        <span class="value">${vehicle.lastMaintenance}</span>
                    </div>
                </div>
            </div>
            <div style="padding: 0 24px 24px;">
                <div class="card-actions">
                    <button class="btn btn-primary" onclick="event.stopPropagation(); app.openVehicleModal(app.vehicles.find(v => v.id === '${vehicle.id}'))">View Details</button>
                    <button class="btn btn-secondary" onclick="event.stopPropagation()">Scan QR</button>
                </div>
            </div>
        `;

        grid.appendChild(card);
    },

    // Render QR code card
    renderQRCard(vehicle) {
        const grid = document.getElementById('vehiclesGrid');
        const card = document.createElement('div');
        card.className = 'vehicle-card';
        card.style.cursor = 'auto';

        card.innerHTML = `
            <div class="card-header">
                <div>
                    <div class="vehicle-name">${vehicle.name}</div>
                    <div class="vehicle-model">${vehicle.licensePlate}</div>
                </div>
            </div>
            <div class="card-body" style="text-align: center;">
                <div id="qr-${vehicle.id}" style="display: flex; justify-content: center; margin: 16px 0;"></div>
                <div style="font-size: 0.9em; color: #999; margin-top: 12px;">
                    <div><strong>Appletag:</strong> ${vehicle.appletag}</div>
                    <div style="margin-top: 8px; font-size: 0.85em;">Scan to access driver logs & maintenance</div>
                </div>
            </div>
        `;

        grid.appendChild(card);

        setTimeout(() => {
            const qrUrl = `${window.location.href.split('?')[0]}?vehicle=${vehicle.id}`;
            new QRCode(document.getElementById(`qr-${vehicle.id}`), {
                text: qrUrl,
                width: 150,
                height: 150,
                correctLevel: QRCode.CorrectLevel.H
            });
        }, 100);
    },

    // Open vehicle details modal
    async openVehicleModal(vehicle) {
        this.currentVehicle = vehicle;
        const modal = document.getElementById('vehicleModal');
        const title = document.getElementById('modalTitle');
        const body = document.getElementById('modalBody');

        title.textContent = `${vehicle.name} (${vehicle.licensePlate})`;

        // Get driver logs for this vehicle
        const vehicleLogs = this.driverLogs.filter(log => log.vehicleId === vehicle.id);
        const vehicleMaintenance = this.maintenanceLogs.filter(log => log.vehicleId === vehicle.id);

        body.innerHTML = `
            <div class="info-section">
                <div class="section-title"><i class="fas fa-exclamation-triangle"></i> Recalls & Alerts</div>
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
                    <span class="label">License Plate:</span>
                    <span class="value">${vehicle.licensePlate}</span>
                </div>
                <div class="info-row">
                    <span class="label">Current Mileage:</span>
                    <span class="value">${vehicle.mileage.toLocaleString()} miles</span>
                </div>
            </div>

            <div class="info-section">
                <div class="section-title"><i class="fas fa-log"></i> Driver Logs</div>
                ${vehicleLogs.length > 0 ? `
                    <div style="max-height: 300px; overflow-y: auto;">
                        ${vehicleLogs.map(log => `
                            <div style="background: #f9fafb; padding: 12px; margin-bottom: 8px; border-radius: 6px; border-left: 3px solid #667eea;">
                                <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                                    <strong>${log.date}</strong>
                                    <span style="font-size: 0.9em; color: #666;">${log.driver}</span>
                                </div>
                                <div style="font-size: 0.9em; color: #333; margin-bottom: 4px;"><strong>Route:</strong> ${log.route}</div>
                                <div style="font-size: 0.9em; color: #666; margin-bottom: 4px;">Mileage: ${log.mileage.start} → ${log.mileage.end} (${log.mileage.total} mi)</div>
                                <div style="font-size: 0.9em; color: #666;">Fuel used: ${log.fuelUsed} gal</div>
                                ${log.notes ? `<div style="font-size: 0.85em; color: #999; margin-top: 6px; font-style: italic;">"${log.notes}"</div>` : ''}
                            </div>
                        `).join('')}
                    </div>
                ` : '<div style="color: #999; padding: 12px;">No driver logs yet</div>'}
                <button class="btn btn-secondary" style="width: 100%; margin-top: 12px;" onclick="app.openDriverLogForm()">
                    <i class="fas fa-plus"></i> Add Driver Log
                </button>
            </div>

            <div class="info-section">
                <div class="section-title"><i class="fas fa-wrench"></i> Maintenance History</div>
                ${vehicleMaintenance.length > 0 ? `
                    <div style="max-height: 300px; overflow-y: auto;">
                        ${vehicleMaintenance.map(maint => `
                            <div style="background: #f9fafb; padding: 12px; margin-bottom: 8px; border-radius: 6px; border-left: 3px solid #10b981;">
                                <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                                    <strong>${maint.date}</strong>
                                    <span style="font-size: 0.9em; color: #666;">$${maint.cost.toFixed(2)}</span>
                                </div>
                                <div style="font-size: 0.9em; color: #333; margin-bottom: 4px;"><strong>${maint.type.replace('-', ' ').toUpperCase()}:</strong> ${maint.description}</div>
                                <div style="font-size: 0.9em; color: #666;">Mileage: ${maint.mileage.toLocaleString()} mi</div>
                            </div>
                        `).join('')}
                    </div>
                ` : '<div style="color: #999; padding: 12px;">No maintenance records yet</div>'}
                <button class="btn btn-secondary" style="width: 100%; margin-top: 12px;" onclick="app.openMaintenanceForm()">
                    <i class="fas fa-plus"></i> Log Maintenance
                </button>
            </div>
        `;

        setTimeout(() => {
            const qrContainer = document.getElementById('qrcode');
            if (qrContainer) {
                qrContainer.innerHTML = '';
                const qrUrl = `${window.location.href.split('?')[0]}?vehicle=${vehicle.id}`;
                new QRCode(qrContainer, {
                    text: qrUrl,
                    width: 200,
                    height: 200,
                    correctLevel: QRCode.CorrectLevel.H
                });
            }
        }, 100);

        modal.classList.add('active');
    },

    // Close vehicle modal
    closeModal() {
        document.getElementById('vehicleModal').classList.remove('active');
    },

    // Open driver log form
    openDriverLogForm() {
        if (!this.currentVehicle) return;
        document.getElementById('driverLogVehicle').value = this.currentVehicle.name;
        document.getElementById('driverLogModal').classList.add('active');
    },

    // Close driver log modal
    closeDriverLogModal() {
        document.getElementById('driverLogModal').classList.remove('active');
    },

    // Submit driver log
    async submitDriverLog(event) {
        event.preventDefault();

        const log = {
            id: `log-${Date.now()}`,
            vehicleId: this.currentVehicle.id,
            date: document.getElementById('driverLogDate').value,
            driver: document.getElementById('driverLogDriver').value,
            mileage: {
                start: parseInt(document.getElementById('driverLogStartMiles').value),
                end: parseInt(document.getElementById('driverLogEndMiles').value),
                total: parseInt(document.getElementById('driverLogEndMiles').value) - parseInt(document.getElementById('driverLogStartMiles').value)
            },
            route: document.getElementById('driverLogRoute').value,
            fuelUsed: parseFloat(document.getElementById('driverLogFuel').value),
            notes: document.getElementById('driverLogNotes').value
        };

        this.driverLogs.push(log);
        alert(`✓ Driver log added for ${this.currentVehicle.name}`);
        this.closeDriverLogModal();
        this.openVehicleModal(this.currentVehicle);
        event.target.reset();
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
            id: `maint-${Date.now()}`,
            vehicleId: this.currentVehicle.id,
            date: document.getElementById('maintenanceDate').value,
            type: document.getElementById('maintenanceType').value,
            description: document.getElementById('maintenanceDesc').value,
            mileage: parseInt(document.getElementById('maintenanceMileage').value),
            cost: parseFloat(document.getElementById('maintenanceCost').value)
        };

        this.maintenanceLogs.push(maintenance);
        alert(`✓ Maintenance logged for ${this.currentVehicle.name}`);
        this.closeMaintenanceModal();
        this.openVehicleModal(this.currentVehicle);
        event.target.reset();
    },

    // Switch view
    switchView(view) {
        this.currentView = view;
        const buttons = document.querySelectorAll('.control-group button');
        buttons.forEach(btn => btn.classList.remove('active'));
        event.target.closest('button').classList.add('active');
        this.renderVehicles();
    },

    // Filter by status
    filterByStatus(status) {
        this.statusFilter = status;
        this.renderVehicles();
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

    // Get recalls for a vehicle by VIN
    getVehicleRecalls(vehicle) {
        return this.recalls[vehicle.vin] || [];
    },

    // Generate HTML for alerts section
    getAlertsHTML(vehicle) {
        const recalls = this.getVehicleRecalls(vehicle);
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

        // Recalls
        if (recalls.length > 0) {
            html += `<div style="margin-bottom: 12px;"><strong style="color: #333;">Active Recalls (${recalls.length})</strong></div>`;
            recalls.forEach(recall => {
                const severityColor = recall.severity === 'high' ? '#dc2626' : recall.severity === 'medium' ? '#f59e0b' : '#10b981';
                const severityBg = recall.severity === 'high' ? '#fee2e2' : recall.severity === 'medium' ? '#fef3c7' : '#ecfdf5';

                html += `
                    <div style="background: ${severityBg}; border-left: 4px solid ${severityColor}; padding: 12px; margin-bottom: 8px; border-radius: 4px;">
                        <div style="color: ${severityColor}; font-weight: bold; margin-bottom: 4px;">
                            ${recall.title}
                            <span style="font-size: 0.8em; text-transform: uppercase; margin-left: 8px;">${recall.severity}</span>
                        </div>
                        <div style="color: #333; font-size: 0.9em; margin-bottom: 4px;">${recall.description}</div>
                        <div style="color: #666; font-size: 0.85em;">
                            <i class="fas fa-calendar"></i> ${recall.date}
                        </div>
                    </div>
                `;
            });
        } else if (!regStatus.expiring) {
            html += '<div style="color: #10b981; padding: 12px; text-align: center;"><i class="fas fa-check-circle"></i> No active alerts or recalls</div>';
        }

        return html;
    }
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});

// Expose app globally for HTML onclick handlers
window.app = app;
