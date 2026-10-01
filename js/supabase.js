// Supabase Integration for PDR Fleet Management
// This file handles all cloud data persistence

const SUPABASE_URL = 'https://jedolnkjmlrruipkgqyd.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImplZG9sbmtqbWxycnVpcGtncXlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA3ODk1ODQsImV4cCI6MjEwNjM2NTU4NH0.h3W7vimHuA_KPGmOjGN8HhM24k9apRta44l9D8xtF-Y';

window.supabase = {
    client: null,
    initialized: false,
    
    async init() {
        if (this.initialized) return;
        
        try {
            // Dynamically import Supabase
            const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm');
            this.client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            this.initialized = true;
            console.log('✓ Supabase connected:', SUPABASE_URL);
        } catch (err) {
            console.error('✗ Failed to initialize Supabase:', err);
            this.client = null;
        }
    },
    
    // ===== fleet_records: one JSON row per item (person / vehicle / trailer / photo) =====
    // Storing each item as JSON means new fields never break uploads (the old
    // vehicles/trailers tables had lowercase columns, so every upload failed).

    // All non-photo rows, or null if the table is missing / offline (caller must then keep local data)
    async loadRecords() {
        if (!this.client) return null;
        const { data, error } = await this.client
            .from('fleet_records')
            .select('kind,id,data,deleted,updated_at')
            .neq('kind', 'photo');
        if (error) { console.error('✗ fleet_records load failed:', error.message); return null; }
        return data || [];
    },

    // rows: [{ kind, id, data, deleted }]  → true on success
    async saveRecords(rows) {
        if (!this.client) return false;
        if (!rows.length) return true;
        const stamp = new Date().toISOString();
        const { error } = await this.client
            .from('fleet_records')
            .upsert(rows.map(r => ({ ...r, updated_at: stamp })), { onConflict: 'kind,id' });
        if (error) { console.error('✗ fleet_records save failed:', error.message); return false; }
        console.log('✓ Uploaded', rows.length, 'fleet record(s)');
        return true;
    },

    async photoIdsInCloud() {
        if (!this.client) return null;
        const { data, error } = await this.client.from('fleet_records').select('id').eq('kind', 'photo').eq('deleted', false);
        if (error) return null;
        return new Set((data || []).map(r => r.id));
    },

    async savePhotoCloud(assetId, photo) {
        return this.saveRecords([{ kind: 'photo', id: assetId, data: { photo }, deleted: false }]);
    },

    async loadPhotoCloud(assetId) {
        if (!this.client) return null;
        const { data, error } = await this.client.from('fleet_records')
            .select('data').eq('kind', 'photo').eq('id', assetId).eq('deleted', false).maybeSingle();
        if (error || !data) return null;
        return data.data && data.data.photo || null;
    },

    // Save people to Supabase
    async savePeople(people) {
        if (!this.client) return false;
        try {
            // Upsert all people
            for (const person of people) {
                await this.client
                    .from('people')
                    .upsert(person, { onConflict: 'id' });
            }
            console.log('✓ Synced', people.length, 'people to Supabase');
            return true;
        } catch (err) {
            console.error('✗ Error saving people:', err);
            return false;
        }
    },
    
    // Load people from Supabase
    async loadPeople() {
        if (!this.client) return [];
        try {
            const { data, error } = await this.client
                .from('people')
                .select('*');
            
            if (error) throw error;
            console.log('✓ Loaded', data?.length || 0, 'people from Supabase');
            return data || [];
        } catch (err) {
            console.error('✗ Error loading people:', err);
            return [];
        }
    },
    
    // Save vehicles to Supabase
    async saveVehicles(vehicles) {
        if (!this.client) return false;
        try {
            for (const vehicle of vehicles) {
                // Don't store photos in cloud (too large)
                const vehicleData = { ...vehicle };
                delete vehicleData.photo;
                
                await this.client
                    .from('vehicles')
                    .upsert(vehicleData, { onConflict: 'id' });
            }
            console.log('✓ Synced', vehicles.length, 'vehicles to Supabase');
            return true;
        } catch (err) {
            console.error('✗ Error saving vehicles:', err);
            return false;
        }
    },
    
    // Load vehicles from Supabase
    async loadVehicles() {
        if (!this.client) return [];
        try {
            const { data, error } = await this.client
                .from('vehicles')
                .select('*');
            
            if (error) throw error;
            console.log('✓ Loaded', data?.length || 0, 'vehicles from Supabase');
            return data || [];
        } catch (err) {
            console.error('✗ Error loading vehicles:', err);
            return [];
        }
    },
    
    // Save trailers to Supabase
    async saveTrailers(trailers) {
        if (!this.client) return false;
        try {
            for (const trailer of trailers) {
                await this.client
                    .from('trailers')
                    .upsert(trailer, { onConflict: 'id' });
            }
            console.log('✓ Synced', trailers.length, 'trailers to Supabase');
            return true;
        } catch (err) {
            console.error('✗ Error saving trailers:', err);
            return false;
        }
    },
    
    // Load trailers from Supabase
    async loadTrailers() {
        if (!this.client) return [];
        try {
            const { data, error } = await this.client
                .from('trailers')
                .select('*');
            
            if (error) throw error;
            console.log('✓ Loaded', data?.length || 0, 'trailers from Supabase');
            return data || [];
        } catch (err) {
            console.error('✗ Error loading trailers:', err);
            return [];
        }
    },
    
    // Sync all data to cloud
    async syncToCloud(appData) {
        if (!this.client) return false;
        
        try {
            await Promise.all([
                this.savePeople(appData.people || []),
                this.saveVehicles(appData.vehicles || []),
                this.saveTrailers(appData.trailers || [])
            ]);
            
            console.log('✓ All data synced to Supabase');
            return true;
        } catch (err) {
            console.error('✗ Cloud sync failed:', err);
            return false;
        }
    },
    
    // Load all data from cloud
    async loadFromCloud() {
        if (!this.client) return null;
        
        try {
            const [people, vehicles, trailers] = await Promise.all([
                this.loadPeople(),
                this.loadVehicles(),
                this.loadTrailers()
            ]);
            
            console.log('✓ All data loaded from Supabase');
            return { people, vehicles, trailers };
        } catch (err) {
            console.error('✗ Error loading from cloud:', err);
            return null;
        }
    }
};

export default window.supabase;
