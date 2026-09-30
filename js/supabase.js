// Supabase Integration
// Initialize Supabase client with your credentials from environment variables

const supabaseConfig = {
    url: import.meta.env?.VITE_SUPABASE_URL || window.ENV?.SUPABASE_URL || '',
    key: import.meta.env?.VITE_SUPABASE_ANON_KEY || window.ENV?.SUPABASE_ANON_KEY || ''
};

class SupabaseClient {
    constructor(url, key) {
        this.url = url;
        this.key = key;
        this.initialized = !!(url && key);
    }

    async request(endpoint, method = 'GET', body = null) {
        if (!this.initialized) {
            console.warn('Supabase not initialized. Using local storage.');
            return null;
        }

        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
                'apikey': this.key,
                'Authorization': `Bearer ${this.key}`
            }
        };

        if (body) {
            options.body = JSON.stringify(body);
        }

        try {
            const response = await fetch(`${this.url}/rest/v1${endpoint}`, options);
            return await response.json();
        } catch (error) {
            console.error('Supabase request failed:', error);
            return null;
        }
    }

    async getBookings(vehicleId) {
        return this.request(`/bookings?vehicle_id=eq.${vehicleId}&order=created_at.desc`);
    }

    async createBooking(booking) {
        return this.request('/bookings', 'POST', booking);
    }

    async getMaintenance(vehicleId) {
        return this.request(`/maintenance?vehicle_id=eq.${vehicleId}&order=date.desc`);
    }

    async createMaintenance(maintenance) {
        return this.request('/maintenance', 'POST', maintenance);
    }

    // Fallback: Use localStorage when Supabase is not available
    async saveBookingLocal(booking) {
        const bookings = JSON.parse(localStorage.getItem('pdr_bookings') || '[]');
        bookings.push({ ...booking, id: Date.now(), created_at: new Date().toISOString() });
        localStorage.setItem('pdr_bookings', JSON.stringify(bookings));
        return booking;
    }

    async getBookingsLocal(vehicleId) {
        const bookings = JSON.parse(localStorage.getItem('pdr_bookings') || '[]');
        return bookings.filter(b => b.vehicle_id === vehicleId);
    }

    async saveMaintenanceLocal(maintenance) {
        const records = JSON.parse(localStorage.getItem('pdr_maintenance') || '[]');
        records.push({ ...maintenance, id: Date.now() });
        localStorage.setItem('pdr_maintenance', JSON.stringify(records));
        return maintenance;
    }

    async getMaintenanceLocal(vehicleId) {
        const records = JSON.parse(localStorage.getItem('pdr_maintenance') || '[]');
        return records.filter(m => m.vehicle_id === vehicleId);
    }
}

// Initialize Supabase client
const supabase = new SupabaseClient(supabaseConfig.url, supabaseConfig.key);

// Export for use in other modules
window.supabase = supabase;