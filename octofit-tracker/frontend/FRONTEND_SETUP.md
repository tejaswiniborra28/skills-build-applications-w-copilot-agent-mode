# OctoFit Tracker Frontend Configuration Guide

## ✅ Updated React 19 Presentation Tier

React 19 frontend with Vite, React Router v6, Bootstrap 5, and environment-aware API configuration.

### Ports
- **Frontend:** 5173 (Vite dev server)
- **Backend API:** 8000

## Files Created/Updated

### New Components
1. **src/components/Users.jsx** - List all users from API
2. **src/components/Activities.jsx** - Display activities with calories burned
3. **src/components/Teams.jsx** - Team management with members
4. **src/components/Leaderboard.jsx** - Competitive rankings with medals
5. **src/components/Workouts.jsx** - Personalized workout plans

### Configuration
- **src/config/api.js** - API configuration with Codespaces detection
- **.env.local** - Environment variables documentation

### Updated Files
- **src/App.jsx** - React Router navigation and layout
- **src/main.jsx** - BrowserRouter setup
- **package.json** - Added `react-router-dom` and `bootstrap`

## Environment Configuration

### For GitHub Codespaces

1. **Get Codespace Name:**
   ```bash
   echo $CODESPACE_NAME
   # Output: effective-garbanzo-vq957jp9rrhp4w4
   ```

2. **Update .env.local:**
   ```bash
   # Frontend/.env.local
   VITE_CODESPACE_NAME=effective-garbanzo-vq957jp9rrhp4w4
   ```

3. **API Endpoint:**
   ```
   https://effective-garbanzo-vq957jp9rrhp4w4-8000.app.github.dev/api
   ```

### For Localhost Development

Keep `.env.local` unset or empty:
```bash
# VITE_CODESPACE_NAME=
```

Automatically uses: `http://localhost:8000/api`

## API Configuration Details

### src/config/api.js Features

✅ **Vite Environment Variable Support**
```javascript
import.meta.env.VITE_CODESPACE_NAME
```

✅ **Automatic URL Building**
- Detects Codespaces name
- Falls back to localhost
- No `undefined-8000...` URLs

✅ **Fetch Helper**
```javascript
const data = await apiFetch(apiEndpoint('users'));
```

✅ **Response Format Handling**
- Array responses: `[{...}, {...}]`
- Paginated responses: `{ users: [{...}] }`
- Both automatically normalized

✅ **Configuration Logging**
```javascript
logApiConfig(); // Shows current API setup in console
```

## API Endpoints

All components use endpoints with automatic base URL:

| Endpoint | Component | Data |
|----------|-----------|------|
| `/api/users` | Users | All user profiles |
| `/api/activities` | Activities | Workout logs |
| `/api/teams` | Teams | Team data with members |
| `/api/leaderboard` | Leaderboard | Rankings by calories |
| `/api/workouts` | Workouts | Training plans |

## React Router Navigation

```
/                  → Home (welcome)
/users            → Users component
/activities       → Activities component
/teams            → Teams component
/leaderboard      → Leaderboard component
/workouts         → Workouts component
```

Navigation bar with emoji indicators on every page.

## Bootstrap Styling

All components use Bootstrap 5 classes:
- **Navbar** - Dark theme with logo
- **Cards** - For displaying data
- **Tables** - For activities and leaderboard
- **Badges** - For difficulty levels
- **Alerts** - For error messages
- **Responsive Grid** - col-md-* for mobile

## Development Commands

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Testing the Setup

### 1. Verify Backend is Running
```bash
curl http://localhost:8000/api/health
# Should return: { "status": "OK", "message": "...", "baseUrl": "..." }
```

### 2. Check Frontend Dev Server
```bash
curl http://localhost:5173
# Should return HTML with React root div
```

### 3. Verify API Configuration
Open browser DevTools Console:
```javascript
// Should show current API setup
import { logApiConfig } from './config/api.js';
logApiConfig();

// Output:
// 🔧 OctoFit API Configuration:
//   Base URL: http://localhost:8000/api
//   Codespace: None (localhost mode)
```

### 4. Test Component API Calls
Navigate to http://localhost:5173/users - should load users from backend

## Troubleshooting

### Issue: "undefined-8000.app.github.dev" in URLs
**Solution:** Set `VITE_CODESPACE_NAME` in `.env.local`

### Issue: Cannot connect to API
**Checklist:**
1. Backend running: `curl http://localhost:8000/api/health`
2. Frontend dev server running on 5173
3. `.env.local` has correct Codespace name (if using Codespaces)
4. Check browser console for detailed errors

### Issue: Components showing "No data found"
**Check:**
1. Backend has seeded data: `npm run seed` from backend
2. API endpoints are accessible
3. No CORS errors in browser console

## Build Output

Production build in `dist/`:
- **index.html** - Entry point
- **assets/index-*.css** - ~4 KB minified CSS
- **assets/index-*.js** - ~223 KB JavaScript (70 KB gzipped)

## Key Technologies

| Tech | Version | Purpose |
|------|---------|---------|
| React | 19.2.7 | UI framework |
| Vite | 8.1.1 | Build tool |
| React Router | 6.28.0 | Client routing |
| Bootstrap | 5.3.3 | UI components |
| Oxlint | 1.71.0 | Code linting |

## Environment Variable Reference

| Variable | Purpose | Example |
|----------|---------|---------|
| `VITE_CODESPACE_NAME` | Codespaces deployment | `effective-garbanzo-vq957jp9rrhp4w4` |
| `VITE_API_URL` | Optional fallback API | `http://localhost:8000/api` |

## Next Steps

1. Set `VITE_CODESPACE_NAME` in `.env.local` if using Codespaces
2. Ensure backend is running on port 8000
3. Start frontend with `npm run dev`
4. Visit http://localhost:5173 in browser
5. Explore all components through navigation

---

**Backend Setup:** See `../backend/README.md`
