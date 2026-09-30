# PDR-Team Fleet Tracker

Real-time vehicle fleet tracking system with QR codes and Appletag integration.

## Features

- 🚗 Real-time vehicle tracking via Appletag API
- 📱 QR codes for quick vehicle access
- 📊 Vehicle status dashboard
- 📋 Booking requests with Supabase integration
- 🔧 Maintenance logging
- 🗺️ Location tracking and battery monitoring
- 📱 Mobile-responsive design

## Setup

### 1. Prerequisites

- Node.js 16+ (for local development)
- GitHub account (for version control)
- Netlify account (for deployment)
- Supabase account (for database)
- Appletag API credentials

### 2. Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Fill in your credentials:
   ```
   VITE_SUPABASE_URL=your-supabase-url
   VITE_SUPABASE_ANON_KEY=your-supabase-key
   VITE_APPLETAG_API_URL=your-appletag-api-url
   VITE_APPLETAG_API_KEY=your-appletag-api-key
   ```

### 3. Supabase Setup

Create two tables in your Supabase project:

**bookings table:**
```sql
create table bookings (
  id uuid default gen_random_uuid() primary key,
  vehicle_id text not null,
  vehicle_name text not null,
  date text not null,
  time text not null,
  duration integer not null,
  destination text not null,
  purpose text not null,
  created_at timestamp default now()
);
```

**maintenance table:**
```sql
create table maintenance (
  id uuid default gen_random_uuid() primary key,
  vehicle_id text not null,
  vehicle_name text not null,
  date text not null,
  type text not null,
  description text not null,
  mileage integer not null,
  cost float not null,
  created_at timestamp default now()
);
```

### 4. Appletag Integration

1. Get your API URL and key from Appletag dashboard
2. Add to `.env.local`:
   ```
   VITE_APPLETAG_API_URL=https://api.appletag.com
   VITE_APPLETAG_API_KEY=your-key-here
   ```

### 5. Local Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Visit http://localhost:5173
```

### 6. Deploy to Netlify

1. Push code to GitHub
2. Connect GitHub repo to Netlify
3. Set environment variables in Netlify dashboard
4. Deploy: `npm run deploy`

## Project Structure

```
pdr-fleet-app/
├── index.html           # Main HTML file
├── styles/
│   └── main.css        # Stylesheet
├── js/
│   ├── app.js          # Main app logic
│   ├── supabase.js     # Supabase integration
│   └── appletag.js     # Appletag API integration
├── .env.example        # Environment variables template
├── package.json        # Dependencies
└── README.md          # This file
```

## API Integration

### Appletag API

The app automatically fetches real-time tracking data from your Appletag API:
- Vehicle location
- Battery level
- Signal strength
- Last seen timestamp

Falls back to mock data if API is not configured.

### Supabase

Stores booking requests and maintenance logs:
- Vehicle booking requests
- Maintenance records
- Uses localStorage fallback if Supabase is not configured

## Customization

### Brand Colors

Edit `styles/main.css` to change the color scheme. Update the gradient background:

```css
body {
    background: linear-gradient(135deg, #YOUR_PRIMARY 0%, #YOUR_SECONDARY 100%);
}
```

### Vehicle Data

Add or update vehicles in `js/app.js`:

```javascript
const vehicles = [
    {
        id: 'vehicle-id',
        name: 'Vehicle Name',
        model: '2022 Model',
        licensePlate: 'ABC-1234',
        appletag: 'APT-xxx-xxx',
        // ... other fields
    }
];
```

## Troubleshooting

### QR Codes not showing?
- Ensure qrcode library is loaded from CDN
- Check browser console for errors

### Appletag data not loading?
- Verify API credentials in `.env.local`
- Check network tab in browser dev tools
- App uses mock data as fallback

### Supabase not saving data?
- Verify Supabase URL and key
- Check table permissions in Supabase dashboard
- App uses localStorage fallback

## Support

For issues or questions, contact the PDR-Team development team.

## License

MIT License - PDR-Team USA