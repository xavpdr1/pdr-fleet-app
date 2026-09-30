// Mock Appletag module for vehicle tracking
window.appletag = {
    async getTracking(appletag_id) {
        // Return mock tracking data
        // In production, this would call the real Appletag API
        return {
            status: 'active',
            battery: 85,
            lastUpdate: new Date().toISOString(),
            coordinates: null // No real GPS for now
        };
    }
};

export default window.appletag;
