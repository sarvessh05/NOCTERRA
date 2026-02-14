# AERIS Deployment Guide

## 🚀 Quick Deployment Options

### Option 1: Vercel (Recommended)

**Why Vercel?**
- Zero configuration for Vite projects
- Automatic deployments from GitHub
- Free SSL certificates
- Global CDN
- Preview deployments for PRs

**Steps:**
1. Push your code to GitHub (see PUSH_INSTRUCTIONS.md)
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your GitHub repository
5. Vercel auto-detects Vite configuration
6. Click "Deploy"

**Custom Domain:**
```bash
# After deployment, add custom domain in Vercel dashboard
# Settings > Domains > Add Domain
```

### Option 2: Netlify

**Steps:**
1. Go to [netlify.com](https://netlify.com)
2. Click "Add new site" > "Import an existing project"
3. Connect to GitHub
4. Select AERIS repository
5. Build settings (auto-detected):
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Click "Deploy site"

**netlify.toml** (optional):
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Option 3: GitHub Pages

**Steps:**
1. Install gh-pages:
```bash
npm install --save-dev gh-pages
```

2. Update `package.json`:
```json
{
  "homepage": "https://ghotekarsarvesh05-stack.github.io/AERIS",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

3. Update `vite.config.ts`:
```typescript
export default defineConfig({
  base: '/AERIS/',
  // ... rest of config
});
```

4. Deploy:
```bash
npm run deploy
```

5. Enable GitHub Pages in repository settings:
   - Settings > Pages > Source: gh-pages branch

### Option 4: Cloudflare Pages

**Steps:**
1. Go to [pages.cloudflare.com](https://pages.cloudflare.com)
2. Click "Create a project"
3. Connect to GitHub
4. Select AERIS repository
5. Build settings:
   - Framework preset: Vite
   - Build command: `npm run build`
   - Build output directory: `dist`
6. Click "Save and Deploy"

### Option 5: AWS Amplify

**Steps:**
1. Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify)
2. Click "New app" > "Host web app"
3. Connect to GitHub
4. Select AERIS repository
5. Build settings (auto-detected)
6. Click "Save and deploy"

### Option 6: Railway

**Steps:**
1. Go to [railway.app](https://railway.app)
2. Click "New Project" > "Deploy from GitHub repo"
3. Select AERIS repository
4. Railway auto-detects and deploys
5. Get your deployment URL

## 🔧 Build Optimization

### Production Build
```bash
npm run build
```

### Analyze Bundle Size
```bash
npm install --save-dev rollup-plugin-visualizer

# Add to vite.config.ts
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    visualizer({ open: true })
  ]
});
```

### Environment Variables

Create `.env.production`:
```env
VITE_API_KEY=your_api_key_here
VITE_API_URL=https://api.example.com
```

Access in code:
```typescript
const apiKey = import.meta.env.VITE_API_KEY;
```

## 🌐 Custom Domain Setup

### Vercel
1. Dashboard > Settings > Domains
2. Add your domain
3. Update DNS records as instructed

### Netlify
1. Site settings > Domain management
2. Add custom domain
3. Configure DNS

### Cloudflare Pages
1. Custom domains tab
2. Add domain
3. Automatic SSL

## 📊 Performance Optimization

### 1. Enable Compression
Most platforms enable this by default, but verify:
- Gzip compression
- Brotli compression

### 2. Caching Headers
```javascript
// netlify.toml
[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

### 3. Image Optimization
```bash
# Install image optimization
npm install --save-dev vite-plugin-imagemin

# Add to vite.config.ts
import viteImagemin from 'vite-plugin-imagemin';

export default defineConfig({
  plugins: [
    viteImagemin({
      gifsicle: { optimizationLevel: 7 },
      optipng: { optimizationLevel: 7 },
      mozjpeg: { quality: 80 },
      pngquant: { quality: [0.8, 0.9] },
      svgo: { plugins: [{ name: 'removeViewBox' }] }
    })
  ]
});
```

## 🔐 Security Headers

### Netlify (_headers file)
```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  X-XSS-Protection: 1; mode=block
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: geolocation=(), microphone=(), camera=()
```

### Vercel (vercel.json)
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        }
      ]
    }
  ]
}
```

## 📱 PWA Setup (Optional)

```bash
npm install vite-plugin-pwa -D

# vite.config.ts
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'AERIS',
        short_name: 'AERIS',
        description: 'Air Quality Visualization Platform',
        theme_color: '#4dd0e1',
        icons: [
          {
            src: 'icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
});
```

## 🔍 SEO Optimization

### robots.txt (already exists)
```
User-agent: *
Allow: /
```

### sitemap.xml
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://your-domain.com/</loc>
    <lastmod>2024-02-14</lastmod>
    <priority>1.0</priority>
  </url>
</urlset>
```

## 📈 Analytics Setup

### Google Analytics
```html
<!-- Add to index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Plausible (Privacy-friendly)
```html
<script defer data-domain="yourdomain.com" src="https://plausible.io/js/script.js"></script>
```

## 🚨 Monitoring

### Sentry Error Tracking
```bash
npm install @sentry/react

# src/main.tsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: import.meta.env.MODE,
});
```

## ✅ Pre-Deployment Checklist

- [ ] All Lovable references removed
- [ ] Environment variables configured
- [ ] Build succeeds locally (`npm run build`)
- [ ] No console errors in production build
- [ ] Images optimized
- [ ] Meta tags updated
- [ ] Favicon added
- [ ] robots.txt configured
- [ ] 404 page works
- [ ] Mobile responsive
- [ ] Performance tested (Lighthouse)
- [ ] Security headers configured
- [ ] Analytics setup
- [ ] Error tracking configured

## 🎯 Post-Deployment

1. **Test the deployment**:
   - Check all pages load
   - Test city selection
   - Verify 3D globe renders
   - Test on mobile devices

2. **Monitor performance**:
   - Run Lighthouse audit
   - Check Core Web Vitals
   - Monitor error rates

3. **Share your project**:
   - Update GitHub repository description
   - Add topics/tags
   - Share on social media
   - Submit to showcase sites

## 🔗 Useful Links

- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com/)
- [Web.dev Performance](https://web.dev/performance/)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)

---

**Recommended**: Start with Vercel for the easiest deployment experience!
