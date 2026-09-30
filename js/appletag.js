// Appletag API Integration
// Handles real-time vehicle tracking via Appletag

const appletag = {
    apiUrl: import.meta.env?.VITE_APPLETAG_API_URL || window.ENV?.APPLETAG_API_URL || '',
    apiKey: import.meta.env?.VITE_APPLETAG_API_KEY || window.ENV?.APPLETAG_API_KEY || '',
    initialized: false,

    init: function(apiUrl, apiKey) {
        this.apiUrl = apiUrl;
        this.apiKey = apiKey;
        this.initialized = !!(apiUrl && apiKey);
        console.log('Appletag initialized:', this.initialized);
    },

    async request(endpoint, method = 'GET', body = null) {
        if (!this.initialized) {
            console.warn('Appletag API not configured. Using mock data.');
            return null;
        }

        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`
            }
        };

        if (body) {
            options.body = JSON.stringify(body);
        }

        try {
            const response = await fetch(`${this.apiUrl}${endpoint}`, options);
            if (!response.ok) throw new Error(`API error: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('Appletag API request failed:', error);
            return null;
        }
    },

    // Get tracking data for a specific Appletag
    async getTracking(appletag) {
        if (!this.initialized) {
            return this.getMockTracking(appletag);
        }

        const data = await this.request(`/tags/${appletag}`);
        if (data) {
            return {
                status: data.active ? 'active' : 'inactive',
                lastSeen: data.lastSeen || new Date().toLocaleString(),
                location: data.location || 'Unknown',
                latitude: data.latitude || 0,
                longitude: data.longitude || 0,
                battery: data.battery || 0,
                signal: data.signal || 'unknown'
            };
        }
        return this.getMockTracking(appletag);
    },

    // Get all tags
    async getAllTags() {
        if (!this.initialized) {
            return null;
        }
        return this.request('/tags');
    },

    // Mock tracking data (for testing)
    getMockTracking(tagId) {
        const mockData = {
            'APT-001-TRK1': {
                status: 'active',
                lastSeen: new Date().toLocaleString(),
                location: 'Office Parking - Lot A',
                latitude: 32.9756,
                longitude: -96.8339,
                battery: 95,
                signal: 'strong'
            },
            'APT-002-TRK2': {
                status: 'active',
                lastSeen: new Date().toLocaleString(),
                location: 'Site Visit - Carrollton',
                latitude: 32.9149,
                longitude: -96.8064,
                battery: 88,
                signal: 'strong'
            },
            'APT-003-VAN': {
                status: 'active',
                lastSeen: new Date().toLocaleString(),
                location: 'Office Parking - Lot B',
                latitude: 32.9758,
                longitude: -96.8341,
                battery: 92,
                signal: 'strong'
            },
            'APT-004-SD1': {
                status: 'inactive',
                lastSeen: new Date(Date.now() - 6*60*60*1000).toLocaleString(),
                location: 'Office Parking - Lot A',
                latitude: 32.9756,
                longitude: -96.8339,
                battery: 45,
                signal: 'weak'
            },
            'APT-005-SD2': {
                status: 'inactive',
                lastSeen: new Date(Date.now() - 24*60*60*1000).toLocaleString(),
                location: 'Service Center - Bay 3',
                latitude: 32.9750,
                longitude: -96.8345,
                battery: 12,
                signal: 'unknown'
            }
        };

        return mockData[tagId] || {
            status: 'unknown',
            lastSeen: 'N/A',
            location: 'Unknown',
            latitude: 0,
            longitude: 0,
            battery: 0,
            signal: 'unknown'
        };
    }
};

// Export for use in other modules
window.appletag = appletag;