# Security Implementation

## API Key Protection

### Problem
The Gemini API key was exposed in the frontend code, visible in browser network requests. This is a critical security vulnerability that allows anyone to:
- See your API key in the browser DevTools
- Use your API key for their own requests
- Exhaust your API quota

### Solution: Serverless Functions

We've implemented a serverless function proxy that keeps the API key secure on the server side.

## How It Works

### Development (Local)
```bash
# Install dependencies
npm install

# Run with Netlify Dev (recommended - tests serverless functions locally)
npm run dev:netlify

# Or run regular Vite dev server (uses direct API calls - less secure)
npm run dev
```

### Production (Deployed)
When deployed to Netlify, the app automatically uses the serverless function at `/.netlify/functions/gemini-proxy`, which:
1. Receives requests from the frontend (without API key)
2. Adds the API key from environment variables (server-side)
3. Makes the request to Gemini API
4. Returns the response to the frontend

## Environment Variables

### Local Development (.env)
```env
VITE_GEMINI_API_KEY=your_api_key_here
VITE_USE_PROXY=false  # Set to true to test proxy locally
```

### Production (Netlify Dashboard)
1. Go to Site Settings → Environment Variables
2. Add: `VITE_GEMINI_API_KEY` = your_api_key_here
3. The key is never exposed to the browser

## Deployment

### Netlify (Recommended)
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod
```

Or connect your GitHub repo to Netlify for automatic deployments.

### Vercel
Create `vercel.json`:
```json
{
  "functions": {
    "api/gemini-proxy.ts": {
      "memory": 1024,
      "maxDuration": 10
    }
  }
}
```

Then move `netlify/functions/gemini-proxy.ts` to `api/gemini-proxy.ts`.

## Security Checklist

- [x] API key stored in environment variables
- [x] API key never committed to git (.env in .gitignore)
- [x] Serverless function proxy implemented
- [x] CORS headers configured
- [x] Rate limiting with caching (10-minute cache)
- [x] Error handling with fallback data
- [ ] Consider adding request authentication
- [ ] Consider adding rate limiting per IP
- [ ] Consider adding request logging

## Testing Security

### Check if API key is exposed:
1. Open browser DevTools (F12)
2. Go to Network tab
3. Click a city to trigger API call
4. Look at the request URL
5. ✅ Good: URL is `/.netlify/functions/gemini-proxy` (no API key visible)
6. ❌ Bad: URL contains `?key=AIza...` (API key exposed)

### Test the proxy:
```bash
# Start Netlify Dev
npm run dev:netlify

# In another terminal, test the function
curl -X POST http://localhost:8888/.netlify/functions/gemini-proxy \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Hello","config":{"temperature":0.8}}'
```

## Additional Security Measures

### 1. API Key Restrictions (Google Cloud Console)
- Restrict API key to specific domains (your Netlify domain)
- Set usage quotas
- Enable API key rotation

### 2. Request Authentication (Optional)
Add a simple token to verify requests come from your app:
```typescript
// In serverless function
const AUTH_TOKEN = process.env.AUTH_TOKEN;
if (event.headers['x-auth-token'] !== AUTH_TOKEN) {
  return { statusCode: 401, body: 'Unauthorized' };
}
```

### 3. Rate Limiting (Optional)
Implement per-IP rate limiting in the serverless function.

## Troubleshooting

### "API key exposed" warning
- Make sure you're using `npm run dev:netlify` or deployed to Netlify
- Check that `USE_PROXY` is true in production
- Verify environment variables are set correctly

### 429 Rate Limit errors
- Check if caching is working (should see "Using cached data" in console)
- Increase `CACHE_DURATION` in gemini.ts
- Consider implementing request queuing

### Function not found
- Verify `netlify.toml` is in project root
- Check function path: `netlify/functions/gemini-proxy.ts`
- Run `netlify dev` to test locally

## Migration Guide

If you're migrating from the old direct API approach:

1. Install dependencies: `npm install`
2. Update environment variables (same as before)
3. Test locally: `npm run dev:netlify`
4. Deploy to Netlify
5. Verify API key is not visible in browser network requests
6. Regenerate your API key in Google Cloud Console (old one was exposed)

## Support

If you encounter security issues, please:
1. Do NOT post API keys in issues
2. Regenerate compromised keys immediately
3. Report security vulnerabilities privately
