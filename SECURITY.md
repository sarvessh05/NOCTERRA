# Security Implementation

## API Key Protection

### Overview
NOCTERRA uses environment variables to protect sensitive API keys. All API keys are stored securely and never exposed in the client-side code or browser network requests.

## Environment Variables

### Local Development (.env)
```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
VITE_GROQ_API_KEY=your_groq_api_key_here
VITE_OPENAQ_API_KEY=your_openaq_api_key_here
VITE_AI_ENABLED=true
```

### Production Deployment

#### Vercel (Recommended)
1. Go to Project Settings → Environment Variables
2. Add the following variables:
   - `VITE_GEMINI_API_KEY` = your_gemini_api_key
   - `VITE_GROQ_API_KEY` = your_groq_api_key
   - `VITE_OPENAQ_API_KEY` = your_openaq_api_key
   - `VITE_AI_ENABLED` = true
3. Redeploy your application

#### Netlify
1. Go to Site Settings → Environment Variables
2. Add the same variables as above
3. Trigger a new deployment

## Security Features

### 1. Environment Variable Protection
- All API keys stored in `.env` file (gitignored)
- Keys loaded via `import.meta.env` at build time
- No keys hardcoded in source code

### 2. Request Caching
- 10-minute cache duration for API responses
- Reduces API calls and prevents quota exhaustion
- Request deduplication prevents parallel duplicate calls

### 3. Fallback Mechanisms
- Primary AI: Groq (fast and generous free tier)
- Fallback AI: Google Gemini
- Static fallback data when APIs unavailable
- Automatic provider switching on failures

### 4. Error Handling
- Silent error handling in production
- No sensitive data logged to console
- Graceful degradation when services fail

## API Key Management

### Getting API Keys

1. **Google Gemini API Key**
   - Visit: https://makersuite.google.com/app/apikey
   - Create a new API key
   - Restrict to your domain in Google Cloud Console

2. **Groq API Key**
   - Visit: https://console.groq.com/keys
   - Sign up and generate an API key
   - Free tier is generous for development

3. **OpenAQ API Key** (Optional)
   - Visit: https://openaq.org/
   - Register for an API key
   - Currently not actively used in production

### API Key Restrictions

For production, restrict your API keys:

**Google Cloud Console:**
- Set application restrictions to your domain
- Set API restrictions to Gemini API only
- Enable usage quotas and alerts

**Groq Console:**
- Monitor usage in dashboard
- Set up alerts for quota limits

## Deployment Guide

### Vercel Deployment

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

Or connect your GitHub repository to Vercel for automatic deployments.

### Netlify Deployment

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod
```

Or connect your GitHub repository to Netlify for automatic deployments.

## Security Checklist

- [x] API keys stored in environment variables
- [x] API keys never committed to git (.env in .gitignore)
- [x] No console logging in production
- [x] CORS headers configured properly
- [x] Rate limiting with caching (10-minute cache)
- [x] Error handling with fallback data
- [x] Request deduplication implemented
- [ ] Consider adding request authentication
- [ ] Consider adding rate limiting per IP
- [ ] Consider implementing API key rotation

## Testing Security

### Verify API Keys Are Protected

1. Build the production version:
```bash
npm run build
npm run preview
```

2. Open browser DevTools (F12)
3. Go to Network tab
4. Interact with the application
5. Check network requests - API keys should NOT be visible in:
   - Request URLs
   - Request headers
   - Request payloads

### Check Environment Variables

```bash
# Development
npm run dev

# Production build
npm run build
```

Ensure no API keys appear in:
- Browser console
- Network requests
- Built JavaScript files in `dist/`

## Best Practices

### 1. Never Commit API Keys
- Always use `.env` for local development
- Keep `.env` in `.gitignore`
- Use `.env.example` with placeholder values

### 2. Rotate Keys Regularly
- Generate new API keys periodically
- Update environment variables in deployment platform
- Revoke old keys after migration

### 3. Monitor Usage
- Check API usage in respective dashboards
- Set up quota alerts
- Monitor for unusual activity

### 4. Restrict API Keys
- Limit keys to specific domains
- Set usage quotas
- Enable only required APIs

## Troubleshooting

### Build Errors
If you see "API key not found" errors:
1. Check `.env` file exists in project root
2. Verify variable names match exactly (case-sensitive)
3. Restart development server after changing `.env`

### Production Issues
If APIs fail in production:
1. Verify environment variables are set in deployment platform
2. Check variable names match exactly
3. Ensure no typos in API keys
4. Check API key restrictions in provider console

### Rate Limiting
If you hit rate limits:
1. Verify caching is working (check network requests)
2. Increase `CACHE_DURATION` in `src/services/gemini.ts`
3. Consider implementing request queuing
4. Upgrade API plan if needed

## Reporting Security Issues

If you discover a security vulnerability:
1. Do NOT post it in public issues
2. Do NOT share API keys or sensitive data
3. Contact the maintainers privately
4. Allow time for the issue to be addressed

## Additional Resources

- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Vercel Environment Variables](https://vercel.com/docs/environment-variables)
- [Netlify Environment Variables](https://docs.netlify.com/environment-variables/overview/)
- [Google Cloud API Security](https://cloud.google.com/docs/security/api-security-best-practices)
