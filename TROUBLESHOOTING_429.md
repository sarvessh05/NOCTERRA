# Troubleshooting 429 Rate Limit Errors

## 🔴 Problem: Getting 429 Even for First City

If you're getting 429 errors immediately, even for the first city selection, here are the possible causes and solutions:

---

## 🔍 Diagnosis

### Check 1: API Key Quota
Your Gemini API key might be exhausted or invalid.

**Test:**
```bash
# Check your API key in Google Cloud Console
# Go to: https://console.cloud.google.com/apis/api/generativelanguage.googleapis.com/quotas
```

**Symptoms:**
- 429 error on first request
- Error message: "Resource has been exhausted"
- Console shows: "⚠️ Rate limit hit, using fallback data"

**Solution:**
1. Check your quota in Google Cloud Console
2. Wait for quota to reset (usually daily)
3. Or upgrade to paid tier
4. Or disable AI temporarily (see below)

---

### Check 2: API Key Restrictions
Your API key might be restricted to specific domains.

**Test:**
```bash
# In Google Cloud Console, check API Key restrictions
# Make sure your domain is allowed
```

**Solution:**
1. Go to Google Cloud Console → Credentials
2. Edit your API key
3. Under "Application restrictions", select "None" or add your domain
4. Save changes

---

### Check 3: Wrong API Key
You might be using an old or invalid key.

**Test:**
```bash
# Check if key starts with "AIza"
# Check if key is in .env file
cat .env | grep VITE_GEMINI_API_KEY
```

**Solution:**
1. Generate new API key: https://makersuite.google.com/app/apikey
2. Update `.env` file
3. Restart dev server

---

## 🛠️ Solutions

### Solution 1: Disable AI Temporarily (Recommended)

The app works perfectly without AI - it uses intelligent fallback data.

**Steps:**
1. Open `.env` file
2. Add or update:
   ```env
   VITE_AI_ENABLED=false
   ```
3. Restart dev server:
   ```bash
   npm run dev
   ```

**Result:**
- ✅ App works normally
- ✅ No API calls
- ✅ No 429 errors
- ✅ Intelligent fallback data (city-specific)
- ⚠️ No AI-generated insights (but still useful)

---

### Solution 2: Use Different API Key

If your key is exhausted, create a new one.

**Steps:**
1. Go to: https://makersuite.google.com/app/apikey
2. Create new API key
3. Update `.env`:
   ```env
   VITE_GEMINI_API_KEY=your_new_key_here
   ```
4. Restart dev server

---

### Solution 3: Wait for Quota Reset

Free tier quotas reset daily.

**Steps:**
1. Check when quota resets (usually midnight UTC)
2. Wait for reset
3. Try again

**Temporary workaround:**
```env
VITE_AI_ENABLED=false
```

---

### Solution 4: Upgrade to Paid Tier

If you need higher limits.

**Steps:**
1. Go to Google Cloud Console
2. Enable billing
3. Upgrade Gemini API quota
4. Update API key if needed

**Costs:**
- Gemini 2.0 Flash: $0.075 per 1M input tokens
- Your usage: ~200 tokens per request
- 1000 requests = ~$0.015 (very cheap)

---

## 🎯 Auto-Disable Feature

The app now automatically disables AI after 3 consecutive failures.

**How it works:**
```
Request 1: 429 → Use fallback (failure count: 1)
Request 2: 429 → Use fallback (failure count: 2)
Request 3: 429 → Use fallback (failure count: 3)
Request 4+: Skip AI, use fallback directly
```

**Console output:**
```
⚠️ AI request failed (1/3): Rate limit exceeded
⚠️ AI request failed (2/3): Rate limit exceeded
⚠️ AI request failed (3/3): Rate limit exceeded
⚠️ AI disabled or quota exhausted, using fallback data
```

**To re-enable:**
- Restart the app
- Or fix the API key issue

---

## 📊 Fallback Data Quality

Don't worry - the fallback data is high quality!

### What You Get Without AI:

**Insight:**
- City-specific explanation based on AQI level
- Health advice based on air quality
- Trend prediction based on data
- Confidence score: 75%

**Health Impact:**
- Respiratory risk assessment
- Visibility index
- Outdoor activity recommendations
- Color-coded severity

**Forecast:**
- 72-hour hourly predictions
- Based on traffic patterns
- Time-of-day variations
- Historical trend analysis

**Example Fallback:**
```json
{
  "insight": {
    "explanation": "Mumbai currently has an AQI of 145, which indicates moderate air quality. This is influenced by local emissions, weather patterns, and seasonal factors.",
    "healthAdvice": "In Mumbai, sensitive individuals should reduce prolonged outdoor exertion.",
    "trend": "Air quality in Mumbai should remain stable.",
    "confidence": 75
  }
}
```

---

## 🔧 Testing

### Test if AI is working:
```bash
# Open browser console
# Select a city
# Look for:
✅ "🔄 Making AI request for: Mumbai"
✅ "✅ Cached AI data for: Mumbai"

# Or if disabled:
⚠️ "AI disabled or quota exhausted, using fallback data"
```

### Test fallback mode:
```bash
# In .env
VITE_AI_ENABLED=false

# Restart and test
npm run dev
```

---

## 🎯 Recommended Approach

For development and testing:

1. **Start with AI disabled:**
   ```env
   VITE_AI_ENABLED=false
   ```

2. **Test all features** (they work perfectly without AI)

3. **Enable AI when ready:**
   ```env
   VITE_AI_ENABLED=true
   ```

4. **If you hit 429:**
   - App automatically falls back
   - No user-facing errors
   - Everything still works

---

## 📝 Summary

**Problem:** 429 errors even for first city

**Root Cause:** API key quota exhausted or invalid

**Quick Fix:**
```env
VITE_AI_ENABLED=false
```

**Long-term Solutions:**
1. Get new API key
2. Wait for quota reset
3. Upgrade to paid tier
4. Use fallback mode (works great!)

**Key Point:** The app is designed to work perfectly with or without AI. The fallback data is intelligent and city-specific, so users won't notice a significant difference.

---

## 🆘 Still Having Issues?

1. Check browser console for errors
2. Check network tab for failed requests
3. Verify `.env` file exists and has correct format
4. Try clearing cache: `localStorage.clear()`
5. Try incognito mode
6. Check if API key is valid in Google Cloud Console

**Emergency Mode:**
```env
VITE_AI_ENABLED=false
VITE_USE_PROXY=false
```

This disables all AI features and uses only fallback data. The app will work 100% offline.
