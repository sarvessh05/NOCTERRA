# Git Push Guide

## Issue

You're getting a 403 error because Git is using the wrong GitHub account (`sarvessh05` instead of `ghotekarsarvesh05-stack`).

## Solution Options

### Option 1: Use GitHub Desktop (Easiest)

1. Open GitHub Desktop
2. It should show your uncommitted changes
3. Click "Push origin" button
4. Done!

### Option 2: Update Git Credentials (Windows)

1. Open **Credential Manager**:
   - Press `Win + R`
   - Type `control /name Microsoft.CredentialManager`
   - Press Enter

2. Click **Windows Credentials**

3. Find entries for `git:https://github.com`

4. Remove all GitHub credentials

5. Try pushing again:
   ```bash
   git push -u origin main
   ```

6. Git will prompt for credentials - enter:
   - Username: `ghotekarsarvesh05-stack`
   - Password: Your GitHub Personal Access Token (not your password!)

### Option 3: Use Personal Access Token

1. Create a Personal Access Token:
   - Go to https://github.com/settings/tokens
   - Click "Generate new token (classic)"
   - Select scopes: `repo` (full control)
   - Generate and copy the token

2. Update remote URL with token:
   ```bash
   git remote set-url origin https://YOUR_TOKEN@github.com/ghotekarsarvesh05-stack/AERIS.git
   ```

3. Push:
   ```bash
   git push -u origin main
   ```

### Option 4: Use SSH (Recommended for Long-term)

1. Generate SSH key (if you don't have one):
   ```bash
   ssh-keygen -t ed25519 -C "your_email@example.com"
   ```

2. Add SSH key to GitHub:
   - Copy your public key:
     ```bash
     cat ~/.ssh/id_ed25519.pub
     ```
   - Go to https://github.com/settings/keys
   - Click "New SSH key"
   - Paste and save

3. Update remote to use SSH:
   ```bash
   git remote set-url origin git@github.com:ghotekarsarvesh05-stack/AERIS.git
   ```

4. Push:
   ```bash
   git push -u origin main
   ```

## What's Been Committed

All changes are committed locally:

```
commit 6968b36 - docs: update README, add CHANGELOG and FEATURES documentation
commit 6c3515a - feat: implement daily city rotation with Nashik permanent
commit 4291422 - feat: add scroll-aware UI, expand cities to 30+ with continents
commit 8b8ec36 - feat: upgrade globe with cinematic emissive lighting
```

Once you fix authentication, just run:
```bash
git push -u origin main
```

## Files Ready to Push

- ✅ Updated README.md with v2.0 features
- ✅ CHANGELOG.md - Complete version history
- ✅ FEATURES.md - Comprehensive feature list
- ✅ DAILY_CITY_ROTATION.md - City rotation system
- ✅ GLOBE_UPGRADE.md - Globe rendering details
- ✅ SCROLL_AND_REALTIME_UPDATE.md - Scroll-aware UI
- ✅ FIXES_APPLIED.md - Bug fixes log
- ✅ All source code changes

## Quick Test

After fixing credentials, verify with:
```bash
git remote -v
git push -u origin main
```

You should see:
```
Enumerating objects: X, done.
Counting objects: 100% (X/X), done.
...
To https://github.com/ghotekarsarvesh05-stack/AERIS.git
   xxxxx..xxxxx  main -> main
Branch 'main' set up to track remote branch 'main' from 'origin'.
```
