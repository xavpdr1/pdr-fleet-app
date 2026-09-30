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
            registrationExpiration: '2027-06-30'
        }
    ],

    currentVehicle: null,
    currentVehicleId: null,
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
        await this.loadTrackingData();
        this.renderVehicleButtons();
        if (this.vehicles.length > 0) {
            this.selectVehicle(this.vehicles[0].id);
        }
        this.setupAutoUpdates();
    },

    // Render vehicle selector buttons
    renderVehicleButtons() {
        const container = document.getElementById('vehicleButtons');
        container.innerHTML = '';
        this.vehicles.forEach(vehicle => {
            const button = document.createElement('button');
            button.className = 'vehicle-btn';
            if (vehicle.id === this.currentVehicleId) {
                button.classList.add('active');
            }
            const statusColor = this.getStatusColor(vehicle.status);
            button.innerHTML = `
                <div class="vehicle-btn-title">${vehicle.name}</div>
                <div class="vehicle-btn-details">
                    <i class="fas fa-circle" style="color: ${statusColor}; font-size: 8px; margin-right: 4px;"></i>
                    ${vehicle.licensePlate} • ${vehicle.mileage.toLocaleString()} mi
                </div>
            `;
            button.onclick = () => this.selectVehicle(vehicle.id);
            container.appendChild(button);
        });
    },

    // Select a vehicle and display its details
    selectVehicle(vehicleId) {
        this.currentVehicleId = vehicleId;
        this.currentVehicle = this.vehicles.find(v => v.id === vehicleId);
        if (!this.currentVehicle) return;
        this.renderVehicleButtons();
        this.renderVehicleDetail();
    },

    // Render vehicle detail view
    renderVehicleDetail() {
        const container = document.getElementById('vehicleDetail');
        const vehicle = this.currentVehicle;
        if (!vehicle) {
            container.innerHTML = '<p>Select a vehicle to view details</p>';
            return;
        }
        const tracking = this.tracking[vehicle.id] || {};
        const statusClass = `status-${vehicle.status}`;
        const statusText = vehicle.status.replace('-', ' ').toUpperCase();
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
            </div>
            <div class="action-buttons">
                <button class="btn btn-primary" onclick="app.openBookingForm()">Request Usage</button>
                <button class="btn btn-secondary" onclick="app.openVehicleModal(app.currentVehicle)">View All Details</button>
            </div>
        `;
    },
    
    async loadTrackingData() {
        for (const vehicle of this.vehicles) {
            const tracking = await appletag.getTracking(vehicle.appletag);
            this.tracking[vehicle.id] = tracking;
        }
    },

    setupAutoUpdates() {
        setInterval(() => {
            this.loadTrackingData().then(() => {
                if (this.currentView !== 'qronly') {
                    this.renderVehicles();
                }
            });
        }, 30000);
    },

    async openVehicleModal(vehicle) {
        this.currentVehicle = vehicle;
        const modal = document.getElementById('vehicleModal');
        const title = document.getElementById('modalTitle');
        const body = document.getElementById('modalBody');
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
                <div class="info-row"><span class="label">Model:</span><span class="value">${vehicle.model}</span></div>
                <div class="info-row"><span class="label">VIN:</span><span class="value">${vehicle.vin}</span></div>
                <div class="info-row"><span class="label">Assigned to:</span><span class="value">${vehicle.assignedTo}</span></div>
                <div class="info-row"><span class="label">Capacity:</span><span class="value">${vehicle.capacity}</span></div>
                <div class="info-row"><span class="label">Mileage:</span><span class="value">${vehicle.mileage.toLocaleString()} miles</span></div>
            </div>
            <div class="info-section">
                <div class="section-title">Maintenance</div>
                <div class="info-row"><span class="label">Last Service:</span><span class="value">${vehicle.lastMaintenance}</span></div>
                <div class="info-row"><span class="label">Next Service:</span><span class="value">${vehicle.nextMaintenance}</span></div>
            </div>
            <div class="info-section">
                <div class="section-title">Status</div>
                <div class="info-row"><span class="label">Vehicle Status:</span><span class="value" style="color: ${statusColor};">${statusText}</span></div>
            </div>
            <div class="info-section">
                <div class="section-title">Insurance & Registration</div>
                <div class="info-row"><span class="label">Insurance Provider:</span><span class="value">${vehicle.insurance?.provider || 'N/A'}</span></div>
                <div class="info-row"><span class="label">Policy Number:</span><span class="value">${vehicle.insurance?.policyNumber || 'N/A'}</span></div>
                <div class="info-row"><span class="label">Insurance Expires:</span><span class="value">${vehicle.insurance?.expirationDate || 'N/A'}</span></div>
                <div class="info-row"><span class="label">Insurance Agent:</span><span class="value">${vehicle.insurance?.agent || 'N/A'} (${vehicle.insurance?.phone || 'N/A'})</span></div>
                <div class="info-row"><span class="label">Registration Expires:</span><span class="value">${vehicle.registrationExpiration || 'TBD'}</span></div>
            </div>
        `;
        document.getElementById('appletag').textContent = vehicle.appletag;
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

    closeModal() {
        document.getElementById('vehicleModal').classList.remove('active');
    },

    openBookingForm() {
        if (!this.currentVehicle) return;
        document.getElementById('bookingVehicle').value = this.currentVehicle.name;
        document.getElementById('bookingModal').classList.add('active');
    },

    closeBookingModal() {
        document.getElementById('bookingModal').classList.remove('active');
    },

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
        if (supabase.initialized) {
            await supabase.createBooking(booking);
        } else {
            await supabase.saveBookingLocal(booking);
        }
        alert(`✓ Booking request submitted for ${booking.vehicle_name}\nYour manager will respond shortly.`);
        this.closeBookingModal();
        event.target.reset();
    },

    openMaintenanceForm() {
        if (!this.currentVehicle) return;
        document.getElementById('maintenanceVehicle').value = this.currentVehicle.name;
        document.getElementById('maintenanceModal').classList.add('active');
    },

    closeMaintenanceModal() {
        document.getElementById('maintenanceModal').classList.remove('active');
    },

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
        if (supabase.initialized) {
            await supabase.createMaintenance(maintenance);
        } else {
            await supabase.saveMaintenanceLocal(maintenance);
        }
        alert(`✓ Maintenance logged for ${maintenance.vehicle_name}\nType: ${maintenance.type}`);
        this.closeMaintenanceModal();
        event.target.reset();
    },

    getStatusColor(status) {
        const colors = {
            'available': '#4ade80',
            'in-use': '#facc15',
            'maintenance': '#f87171'
        };
        return colors[status] || '#999';
    },

    getBatteryColor(battery) {
        if (battery >= 60) return 'green';
        if (battery >= 30) return 'medium';
        return 'low';
    },

    getTrackingStatus(vehicle) {
        const tracking = this.tracking[vehicle.id];
        if (!tracking) return `<span class="status-dot dot-unknown"></span>Unknown`;
        if (tracking.status === 'active') {
            return `<span class="status-dot dot-active"></span>Active`;
        } else {
            return `<span class="status-dot dot-inactive"></span>Inactive`;
        }
    },

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

    getVehicleAlerts(vehicle) {
        return this.alerts[vehicle.vin] || [];
    },

    getAlertsHTML(vehicle) {
        const alerts = this.getVehicleAlerts(vehicle);
        const regStatus = this.isRegistrationExpiring(vehicle);
        let html = '';
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

document.addEventListener('DOMContentLoaded', () => {
    app.init();
});

window.app = app;