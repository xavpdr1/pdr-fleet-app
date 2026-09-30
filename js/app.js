// PDR Fleet Tracker - Main Application

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
            nextMaintenance: '2026-10-20',
            appletag: 'APT-001-TRK1',
            insurance: {
                provider: 'State Farm',
                policyNumber: '0031891-SFX-43',
                expirationDate: '2026-12-16',
                agent: 'Kelsey DeLuca',
                phone: '214-295-9717'
            },
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
            nextMaintenance: '2026-10-18',
            appletag: 'APT-002-TRK2',
            insurance: {
                provider: 'State Farm',
                policyNumber: '0031891-SFX-43',
                expirationDate: '2026-12-16',
                agent: 'Kelsey DeLuca',
                phone: '214-295-9717'
            },
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
            nextMaintenance: 'TBD',
            appletag: 'APT-003-BMW',
            insurance: {
                provider: 'State Farm',
                policyNumber: 'TBD',
                expirationDate: '2025-12-31',
                agent: 'TBD',
                phone: 'TBD'
            },
            registrationExpiration: 'TBD'
        }
    ],

    currentVehicle: null,
    currentView: 'all',
    statusFilter: '',
    tracking: {},

    // Alerts/Recalls system mapped by VIN
    alerts: {
        '1FTFW1ED9MFB41842': [
            { id: 'recall-001', type: 'recall', title: 'Brake Pad Inspection', description: 'Regular inspection recommended by manufacturer', date: '2026-09-25', severity: 'medium' }
        ],
        '1FT8W2BT9MEC05393': [
            { id: 'recall-002', type: 'recall', title: 'Tire Pressure Monitoring', description: 'Sensor calibration needed', date: '2026-10-01', severity: 'low' }
        ]
    },

    // Initialize the app
    async init() {
        console.log('Initializing PDR Fleet Tracker...');
        // Set logo src
        const logoImg = document.querySelector("header .pdr-logo");
        const splashLogo = document.getElementById("splash-logo");
        if (logoImg) logoImg.src = "/logo.png";
        if (splashLogo) splashLogo.src = "/logo.png";
        // Check for single-vehicle mode from URL parameters
        const params = new URLSearchParams(window.location.search);
        const vehicleParam = params.get('vehicle') || params.get('name');
        if (vehicleParam) {
            this.singleVehicleMode = true;
            this.singleVehicleId = vehicleParam;
        }

        // Load tracking data for all vehicles
        await this.loadTrackingData();

        // Render initial view
        this.renderVehicles();
        this.renderAuthorizedUsers();

        // Set up real-time updates
        this.setupAutoUpdates();

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
    
    // Load tracking data from Appletag
    async loadTrackingData() {
        for (const vehicle of this.vehicles) {
            const tracking = await appletag.getTracking(vehicle.appletag);
            this.tracking[vehicle.id] = tracking;
        }
    },

    // Set up periodic updates
    setupAutoUpdates() {
        setInterval(() => {
            this.loadTrackingData().then(() => {
                if (this.currentView !== 'qronly') {
                    this.renderVehicles();
                }
            });
        }, 30000); // Update every 30 seconds
    },

    // Render all vehicles
    renderVehicles() {
        const grid = document.getElementById('vehiclesGrid');
        grid.innerHTML = '';

        let filtered = this.vehicles.filter(v => {
            if (this.statusFilter && v.status !== this.statusFilter) return false;
            if (this.currentView === 'active') return v.status === 'in-use';
            if (this.currentView === 'tracked') {
                const tracking = this.tracking[v.id];
                return tracking && tracking.status === 'active';
            }
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

    // Render a single vehicle card
    renderVehicleCard(vehicle) {
        const grid = document.getElementById('vehiclesGrid');
        const card = document.createElement('div');
        card.className = 'vehicle-card';
        card.onclick = () => this.openVehicleModal(vehicle);

        const tracking = this.tracking[vehicle.id] || {};
        const statusColor = this.getStatusColor(vehicle.status);
        const statusText = vehicle.status.replace('-', ' ').toUpperCase();
        const batteryPercent = tracking.battery || 0;
        const batteryColor = this.getBatteryColor(batteryPercent);
        const trackingStatus = this.getTrackingStatus(vehicle);

        // Check for alerts and expiring registration
        const alerts = this.getVehicleAlerts(vehicle);
        const regStatus = this.isRegistrationExpiring(vehicle);
        let alertBadgeHTML = '';

        if (alerts.length > 0 || regStatus.expiring) {
            alertBadgeHTML = '<div style="margin-top: 8px; display: flex; gap: 6px; flex-wrap: wrap;">';
            if (alerts.length > 0) {
                alertBadgeHTML += `<span style="background: #fee2e2; color: #dc2626; padding: 4px 8px; border-radius: 3px; font-size: 0.8em; font-weight: 500;"><i class="fas fa-exclamation-circle"></i> ${alerts.length} Alert${alerts.length > 1 ? 's' : ''}</span>`;
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
                <div class="status-badge">${trackingStatus}</div>
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
                        <span class="label">Mileage:</span>
                        <span class="value">${vehicle.mileage.toLocaleString()} mi</span>
                    </div>
                </div>

                <div class="info-section">
                    <div class="section-title">Status</div>
                    <div class="info-row">
                        <span class="label">Vehicle Status:</span>
                        <span class="value" style="color: ${statusColor};">${statusText}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Next Service:</span>
                        <span class="value">${vehicle.nextMaintenance}</span>
                    </div>
                </div>

                <div class="info-section">
                    <div class="section-title">Tracking</div>
                    <div class="tracking-info">
                        <div class="label">Current Location:</div>
                        <div class="value">${tracking.location || 'Unknown'}</div>
                        <div class="location-badge"><i class="fas fa-map-marker-alt"></i> ${tracking.latitude?.toFixed(4) || 'N/A'}, ${tracking.longitude?.toFixed(4) || 'N/A'}</div>
                    </div>
                    <div class="info-row">
                        <span class="label">Battery:</span>
                        <span class="value">
                            <div class="battery-indicator">
                                <div class="battery-bar">
                                    <div class="battery-fill ${batteryColor}" style="width: ${batteryPercent}%"></div>
                                </div>
                                ${batteryPercent}%
                            </div>
                        </span>
                    </div>
                </div>
            </div>
            <div style="padding: 0 24px 24px;">
                <div class="card-actions">
                    <button class="btn btn-primary" onclick="event.stopPropagation(); app.openVehicleModal(app.vehicles.find(v => v.id === '${vehicle.id}'))">View Details</button>
                    <button class="btn btn-secondary" onclick="event.stopPropagation()">Show QR</button>
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
                </div>
            </div>
        `;

        grid.appendChild(card);

        setTimeout(() => {
            const qrUrl = `${window.location.href}?vehicle=${vehicle.id}&appletag=${vehicle.appletag}`;
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
    }
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});