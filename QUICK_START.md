# NOCTERRA Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Clone and Install (2 minutes)

```bash
# Clone the repository
git clone https://github.com/sarvessh05/NOCTERRA.git
cd NOCTERRA

# Install dependencies
npm install
```

### Step 2: Set Up API Keys (1 minute)

```bash
# Copy the example environment file
cp .env.example .env
```

Edit `.env` and add your API keys:
```env
VITE_GEMINI_API_KEY=AIzaSyCHcLP9zmmIW-n0J6GCbVMZFGp6s9-3ZW4
VITE_OPENAQ_API_KEY=3d1313118da7ef818af58782905d1538ec272074
```

**Get API Keys:**
- Gemini: https://makersuite.google.com/app/apikey (Free, instant)
- OpenAQ: https://openaq.org/ (Optional, for real data)

### Step 3: Run the App (30 seconds)

```bash
npm run dev
```

Open http://localhost:8080 in your browser.

### Step 4: Test AI Features (1 minute)

1. **Click "Enter Live Atmosphere"**
2. **Click any city marker** (try Mumbai, Delhi, or Beijing)
3. **Click the sparkle icon** (✨) → Test AI Insights
4. **View the forecast panel** at bottom → See 72-hour predictions
5. **Click the comparison icon** (⚔️) → Compare two cities

---

## 🎯 Feature Showcase

### AI Insights Demo
```
1. Select "Delhi" on globe
2. Click sparkle icon (✨)
3. Click "Explain Today's Air"
4. Wait 2-3 seconds
5. See AI-generated explanation with confidence score
```

### 72-Hour Forecast Demo
```
1. Select any city
2. Forecast panel appears automatically at bottom
3. View animated chart with hourly predictions
4. Check "AI Confidence: XX%" badge
5. Hover over chart for detailed tooltips
```

### City Comparison Demo
```
1. Select "Mumbai"
2. Click comparison icon (⚔️)
3. Search for "Delhi"
4. Watch animated comparison bars
5. See winner badge and percentage difference
```

---

## 🎨 UI Tour

### Top Bar (After Entering)
- **NOCTERRA Logo** (left) - Brand identity with pulsing dot
- **Search Icon** - Find cities quickly
- **Sparkle Icon** ⚡ - AI Insights (only when city selected)
- **Comparison Icon** ⚡ - Compare cities (only when city selected)
- **Map Pin Icon** - Reset view

### Right Panel (When City Selected)
- **Prediction Panel** - 7-day forecast with AQI circle
- **AI Insight Panel** ⚡ - Appears when sparkle clicked

### Bottom Center (When City Selected)
- **72-Hour Forecast Panel** ⚡ - Animated chart with predictions

### Bottom Left
- **Simulation Controls** - Adjust pollution intensity

---

## 🔧 Troubleshooting

### API Key Issues
**Problem**: "Failed to get AI insight"
**Solution**: 
1. Check `.env` file exists
2. Verify API key is correct
3. Restart dev server (`Ctrl+C`, then `npm run dev`)

### Build Errors
**Problem**: Module not found
**Solution**:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Port Already in Use
**Problem**: Port 8080 is busy
**Solution**:
```bash
# Kill process on port 8080 (Windows)
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Or use different port
npm run dev -- --port 3000
```

---

## 📱 Browser Compatibility

### Recommended
- Chrome 90+
- Firefox 88+
- Edge 90+
- Safari 14+

### Required Features
- WebGL 2.0 (for 3D globe)
- ES6+ JavaScript
- CSS Grid & Flexbox

---

## 🎓 Learning Path

### Beginner (5 minutes)
1. Explore the 3D globe
2. Click different cities
3. View AQI levels and trends

### Intermediate (10 minutes)
1. Use AI Insights feature
2. Analyze 72-hour forecast
3. Compare two cities
4. Try simulation controls

### Advanced (20 minutes)
1. Read AI_FEATURES.md
2. Explore code in `src/services/`
3. Customize AI prompts
4. Add new cities to `src/data/cities.ts`

---

## 🎯 Demo Script (For Presentations)

### 1-Minute Demo
```
"NOCTERRA visualizes global air quality in 3D. 
Watch as I click Mumbai... 
Now I'll ask our AI to explain today's air quality...
[Click sparkle, then Explain]
See? Personalized insights with 87% confidence.
The 72-hour forecast shows AQI will rise tomorrow.
Let's compare Mumbai with Delhi...
[Click comparison]
Mumbai has 31% better air quality!"
```

### 3-Minute Demo
```
[Show landing page]
"NOCTERRA - The Earth That Breathes. Let's enter..."

[Click Enter, globe rotates]
"Here's our 3D globe with real-time city markers.
Each color represents air quality - green is good, red is hazardous."

[Click city]
"Let's explore Mumbai. Current AQI is 145 - unhealthy.
But what does that really mean?"

[Click AI Insights]
"Our AI, powered by Google Gemini, explains in plain English.
It considers traffic, weather, and local factors.
Plus, it gives health advice - 87% confidence."

[Scroll to forecast]
"The 72-hour forecast predicts hourly AQI.
Notice the trend arrow - air quality will worsen.
AI confidence: 84%."

[Click comparison]
"Now let's compare with Delhi...
Animated bars show Mumbai has 31% better air.
This helps people make informed decisions."

[Show simulation]
"We can even simulate future scenarios.
What if pollution increases 50%?
The globe shows the impact visually."
```

---

## 🚀 Next Steps

### For Users
1. ⭐ Star the repository
2. 🐛 Report bugs via GitHub Issues
3. 💡 Suggest features
4. 📢 Share with friends

### For Developers
1. 📖 Read IMPROVEMENTS.md for ideas
2. 🔧 Check DEPLOYMENT.md to deploy
3. 🤝 Submit pull requests
4. 📚 Read AI_FEATURES.md for technical details

### For Contributors
1. Fork the repository
2. Create feature branch
3. Make changes
4. Submit PR with description

---

## 📊 Performance Tips

### Faster Loading
```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

### Reduce API Calls
- AI responses are cached for 5 minutes
- Forecast updates every 6 hours
- Use fallback mode for testing

### Optimize 3D Performance
- Reduce particle count in `GlobeScene.tsx`
- Lower globe resolution for older devices
- Disable auto-rotate when city selected

---

## 🎉 Success Checklist

- [ ] App runs on localhost:8080
- [ ] 3D globe renders smoothly
- [ ] Can click and select cities
- [ ] AI Insights button works
- [ ] Forecast panel displays
- [ ] City comparison opens
- [ ] No console errors
- [ ] Animations are smooth

---

## 📞 Support

- **Documentation**: See README.md, AI_FEATURES.md
- **Issues**: https://github.com/sarvessh05/NOCTERRA/issues
- **Discussions**: GitHub Discussions (coming soon)

---

**Ready to explore? Run `npm run dev` and dive in!** 🌍✨
