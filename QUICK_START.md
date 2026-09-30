# PDR-Team Fleet Tracker - Quick Start Guide

## What You've Built

A production-ready web application for managing PDR-Team's vehicle fleet with:

✅ **Real-time Tracking** - Appletag GPS integration  
✅ **QR Codes** - Quick access to vehicle details  
✅ **Booking System** - Request vehicle usage  
✅ **Maintenance Logs** - Track service history  
✅ **PDR-Team Branding** - Official colors and logo  
✅ **Mobile Responsive** - Works on all devices  
✅ **Fallback Data** - Works without API credentials  

---

## 5-Minute Setup

### 1. Install Dependencies
```bash
cd pdr-fleet-app
npm install
```

### 2. Create Environment File
```bash
cp .env.example .env.local
```

### 3. Start Development Server
```bash
npm run dev
```

Visit: `http://localhost:5173`

You'll see 5 sample vehicles with mock tracking data.

---

## What Each View Does

### 📊 All Vehicles
Shows every vehicle in the fleet with:
- Current status (Available, In Use, Maintenance)
- Battery level
- Last known location
- Quick action buttons

### 🟢 Active
Only vehicles currently in use or on active tracking

### 📡 Tracked
Vehicles with active Appletag GPS tracking

### 📱 QR Codes
All vehicle QR codes for quick access

---

## Key Features to Test

### 1. View Vehicle Details
- Click any vehicle card
- See live Appletag tracking data
- View QR code for the vehicle

### 2. Request to Use a Vehicle
- Click a vehicle card
- Click "Request Usage"
- Fill in date, time, destination, purpose
- Submit (saves to Supabase or localStorage)

### 3. Log Maintenance
- Click a vehicle card
- Click "Log Maintenance"
- Record service details and cost
- Submit (saves to Supabase or localStorage)

### 4. Filter by Status
- Use the dropdown to filter: Available, In Use, Maintenance
- View only specific vehicle statuses

### 5. Switch Views
- Toggle between All/Active/Tracked/QR Codes
- See vehicles filtered by connectivity and status

---

## Mock Data for Development

The app comes with 5 sample vehicles:
1. **Truck 1** - Cargo truck, GPS tracked
2. **Truck 2** - Cargo truck, GPS tracked
3. **Van** - Commercial van, GPS tracked
4. **Sedan 1** - Passenger vehicle, battery tracked
5. **Sedan 2** - Passenger vehicle, battery tracked

Each has:
- Unique Appletag ID
- GPS location (mock)
- Battery level (mock)
- Signal strength (mock)
- Status (Available, In Use, or Maintenance)

---

## Environment Variables

When you're ready to go live, update `.env.local` with real credentials:

```env
# Your Supabase project
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Your Appletag API
VITE_APPLETAG_API_URL=https://api.appletag.com
VITE_APPLETAG_API_KEY=your-appletag-api-key-here

# Brand colors (already set to PDR-Team)
VITE_PRIMARY_COLOR=#1F4E79
VITE_SECONDARY_COLOR=#2E75B6
VITE_ACCENT_COLOR=#2D3847
VITE_LIGHT_COLOR=#F2F4F8
```

---

## File Structure

```
pdr-fleet-app/
├── index.html              # Main page
├── styles/
│   └── main.css            # Styling with PDR-Team brand colors
├── js/
│   ├── app.js              # Main application logic
│   ├── appletag.js         # Appletag API integration
│   └── supabase.js         # Database integration
├── .env.example            # Environment variables template
├── .env.local              # (Create this - git ignored)
├── package.json            # Dependencies
├── vite.config.js          # Build configuration
├── README.md               # Full documentation
├── DEPLOYMENT.md           # GitHub & Netlify setup
└── QUICK_START.md         # This file
```

---

## Development Commands

```bash
# Start dev server (with hot reload)
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
```

---

## Deployment (When Ready)

### To GitHub:
```bash
git init
git add .
git commit -m "Initial commit: PDR-Team Fleet Tracker"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### To Netlify:
1. Connect your GitHub repo to Netlify
2. Add environment variables to Netlify
3. Click Deploy

**See DEPLOYMENT.md for detailed steps.**

---

## Common Tasks

### Add a New Vehicle
Edit `js/app.js` and add to the `vehicles` array:
```javascript
{
    id: 'truck-3',
    name: 'Truck 3',
    model: '2023 Freightliner',
    licensePlate: 'PDR-2023-03',
    appletag: 'APT-789-xyz',
    status: 'available',
    category: 'truck',
    // ... other fields
}
```

### Change Brand Colors
Edit `.env.local`:
```env
VITE_PRIMARY_COLOR=#YOUR_COLOR
VITE_SECONDARY_COLOR=#YOUR_COLOR
```

Then restart dev server.

### Connect Real Appletag
1. Get API credentials from Appletag dashboard
2. Add to `.env.local`
3. Restart dev server
4. Data will load from Appletag instead of mock data

### Connect Real Supabase
1. Create tables in Supabase (see README.md)
2. Add Supabase URL and key to `.env.local`
3. Restart dev server
4. Booking/maintenance data saves to Supabase

---

## Troubleshooting

### "Cannot find module" error
```bash
npm install
```

### App won't start
- Check if port 5173 is in use
- Kill other npm processes and try again

### Mock data not showing
- Check browser console (F12) for errors
- Make sure `js/appletag.js` is loading

### Styling looks wrong
- Restart dev server after changing `.env.local`
- Clear browser cache (Ctrl+Shift+Delete)

---

## Next Steps

1. **Test locally** - Run `npm run dev` and try all features
2. **Add real vehicles** - Update vehicle list in `js/app.js`
3. **Connect APIs** - Add Supabase and Appletag credentials
4. **Deploy to Netlify** - Follow DEPLOYMENT.md
5. **Share with team** - Give them the Netlify URL

---

## Questions?

- See README.md for full documentation
- See DEPLOYMENT.md for deployment steps
- Check browser console (F12) for any errors
- Review js/app.js, js/appletag.js, js/supabase.js for code

**Ready to go! 🚀**
