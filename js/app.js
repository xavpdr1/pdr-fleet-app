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
            registrationExpiration: '2027-05-31'
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
    usageLogs: {}, // Track usage history by vehicle ID

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

        // Load tracking data for all vehicles
        await this.loadTrackingData();

        // Render vehicle buttons
        this.renderVehicleButtons();

        // Select the first vehicle by default
        if (this.vehicles.length > 0) {
            this.selectVehicle(this.vehicles[0].id);
        }

        // Set up real-time updates
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

        // Update button active states
        this.renderVehicleButtons();

        // Render vehicle details
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
                <button class="btn btn-primary" onclick="app.openUsageLogForm()">Log Usage</button>
                <button class="btn btn-secondary" onclick="app.openVehicleModal(app.currentVehicle)">View All Details</button>
            </div>

            <div style="margin-top: 24px; padding-top: 20px; border-top: 2px solid #B8CCE4;">
                <h3 style="color: #1F4E79; font-size: 16px; font-weight: 600; margin-bottom: 16px;">
                    <i class="fas fa-history"></i> Recent Usage Log
                </h3>
                <div id="usageHistory">${this.getUsageHistoryHTML(vehicle.id)}</div>
            </div>
        `;
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
        html += '</tr>';

        logs.forEach(log => {
            html += '<tr style="border-bottom: 1px solid #d1d5db;">';
            html += `<td style="padding: 10px;">${log.driver_name}</td>`;
            html += `<td style="padding: 10px;">${log.date}</td>`;
            html += `<td style="padding: 10px; font-weight: 600;">${log.distance_driven} mi</td>`;
            html += `<td style="padding: 10px;">${log.fuel_added} gal</td>`;
            html += '</tr>';
        });

        html += '</table>';
        return html;
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
    }
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});

// Expose app globally for HTML onclick handlers
window.app = app;