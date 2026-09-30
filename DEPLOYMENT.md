# PDR-Team Fleet Tracker - Deployment Guide

## Complete Deployment Workflow

### Step 1: Prepare Your GitHub Repository

#### If you haven't initialized Git yet:

```bash
cd pdr-fleet-app

# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: PDR-Team Fleet Tracker with Appletag integration and Supabase backend

- Real-time vehicle tracking dashboard
- QR code generation for vehicles
- Booking request system
- Maintenance logging
- PDR-Team branded UI with responsive design
- Mock data fallback for development"

# Add your GitHub remote (replace YOUR_USERNAME and YOUR_REPO)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# Push to GitHub (main branch)
git branch -M main
git push -u origin main
```

### Step 2: Configure Environment Variables in Netlify

1. Go to [Netlify Dashboard](https://app.netlify.com)
2. Click **Add new site** → **Import an existing project**
3. Select **GitHub** as your git provider
4. Authorize Netlify to access your GitHub account
5. Select your `pdr-fleet-app` repository

#### During the Netlify setup:

1. **Build Command:** Leave as default or enter: `npm run build`
2. **Publish Directory:** `dist`
3. **Environment Variables:** Before deploying, click **Environment** and add:

```
VITE_SUPABASE_URL = https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY = your-anon-key-here
VITE_APPLETAG_API_URL = https://api.appletag.com
VITE_APPLETAG_API_KEY = your-appletag-api-key-here
VITE_PRIMARY_COLOR = #1F4E79
VITE_SECONDARY_COLOR = #2E75B6
VITE_ACCENT_COLOR = #2D3847
VITE_LIGHT_COLOR = #F2F4F8
```

### Step 3: Deploy to Netlify

1. Click **Deploy site** in Netlify
2. Wait for the build to complete (usually 1-2 minutes)
3. Your app will be live at `https://your-site-name.netlify.app`

### Step 4: Verify Deployment

After deployment:

1. **Check the live site:**
   - Visit your Netlify URL
   - Verify the PDR-Team logo appears in the header
   - Test the vehicle grid loads with mock data
   - Try switching between views (All Vehicles, Active, Tracked, QR Codes)

2. **Check the browser console for errors:**
   - Open DevTools (F12)
   - Look for any red errors in the Console tab
   - Most errors should be safe (CORS for Appletag/Supabase without credentials)

### Step 5: Connect Appletag API

1. **Get your Appletag credentials:**
   - Log into your Appletag dashboard
   - Find your API URL and API Key
   - Copy these values

2. **Add to Netlify environment variables:**
   - In Netlify dashboard, go to Site settings → Build & deploy → Environment
   - Update `VITE_APPLETAG_API_URL` and `VITE_APPLETAG_API_KEY`
   - Click **Deploy site** to redeploy with new credentials

3. **Test Appletag integration:**
   - Open the live site
   - Click on a vehicle card to view details
   - You should see real tracking data (location, battery, signal) in the modal

### Step 6: Configure Supabase (Optional for Production)

1. **Log into Supabase:**
   - Go to [supabase.com](https://supabase.com)
   - Open your project

2. **Create required tables:**

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

3. **Set up Row Level Security (RLS):**
   - Go to Authentication → Policies
   - Enable RLS for both tables
   - Add policy: `Enable INSERT for all users`
   - Add policy: `Enable SELECT for all users`

4. **Copy Supabase credentials:**
   - Project Settings → API
   - Copy `Project URL` → `VITE_SUPABASE_URL`
   - Copy `anon` key → `VITE_SUPABASE_ANON_KEY`
   - Add to Netlify environment variables

5. **Redeploy:**
   - Trigger a new deploy in Netlify
   - Test booking requests and maintenance logging

### Step 7: Enable Automatic Deployments

With Netlify connected to GitHub:
- Every push to `main` branch automatically deploys
- View deployment logs in Netlify dashboard → Deploys
- Rollback to previous deploys if needed

### Step 8: Custom Domain (Optional)

1. In Netlify dashboard, go to **Domain settings**
2. Click **Add custom domain**
3. Follow the DNS setup instructions
4. SSL certificate is automatically provisioned

---

## Troubleshooting Deployment

### Build fails with "Cannot find module"
- Ensure all dependencies in `package.json` are installed
- Run `npm install` locally and commit `package-lock.json`

### Environment variables not working
- Variables must start with `VITE_` to be accessible in frontend
- Redeploy after adding variables (Netlify doesn't pick up changes automatically for existing deploys)

### Appletag or Supabase data not loading
- Check browser DevTools Network tab to see API requests
- Verify credentials are correct in Netlify environment variables
- Check Appletag/Supabase dashboard to ensure credentials have proper permissions

### CORS errors
- This is expected if APIs don't have proper CORS headers
- App has fallback to mock data
- Contact Appletag support to enable CORS for your Netlify domain

### QR codes not scanning
- Ensure QR code library is loaded from CDN (check in HTML head)
- QR codes encode the vehicle ID - test with a QR code scanner app
- QR codes link to vehicle details modal when scanned in-app

---

## Monitoring & Maintenance

1. **View deployment logs:**
   - Netlify dashboard → Deploys → Click a deploy
   - See build output and any errors

2. **Monitor uptime:**
   - Netlify dashboard → Analytics → Shows uptime & bandwidth

3. **View error logs:**
   - Netlify dashboard → Functions (if using serverless functions)
   - Browser DevTools Console (for frontend errors)

4. **Update code:**
   ```bash
   # Make changes locally
   git add .
   git commit -m "Update: Description of changes"
   git push origin main
   
   # Netlify automatically deploys!
   ```

---

## Production Checklist

- [ ] GitHub repository created and all code pushed
- [ ] Netlify site created and connected to GitHub
- [ ] Environment variables configured in Netlify
- [ ] Supabase credentials added and tested
- [ ] Appletag API credentials added and tested
- [ ] Custom domain configured (if desired)
- [ ] HTTPS enabled (automatic with Netlify)
- [ ] Live site tested on mobile and desktop
- [ ] QR code functionality verified
- [ ] Booking and maintenance forms tested
- [ ] Team members have access to Netlify and GitHub

---

## Next Steps

1. **Customize vehicles list** - Update vehicle data in `js/app.js`
2. **Add user authentication** - Integrate auth via Supabase Auth
3. **Real-time updates** - Add Supabase realtime subscriptions
4. **Mobile app** - Convert to React Native or Flutter
5. **Analytics** - Add Netlify Analytics or Google Analytics

For questions or issues, contact the PDR-Team development team.
