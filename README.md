# Dream Home Generator — Deployment Guide

## What's in this folder

| File | Purpose |
|------|---------|
| `index.html` | The entire app (single file) |
| `netlify/functions/generate.js` | Serverless proxy — keeps your API key secret |
| `netlify.toml` | Netlify configuration |
| `brand_assets/` | Brand images |

---

## How to deploy on Netlify

### Option A — Drag & Drop (easiest, 2 minutes)

> ⚠️ This method works but requires one extra step for the API key.

1. Go to [app.netlify.com](https://app.netlify.com)
2. Click **"Add new site" → "Deploy manually"**
3. Drag this entire folder into the upload area
4. Once deployed, go to **Site configuration → Environment variables → Add a variable**:
   ```
   Key:   OPENAI_API_KEY
   Value: sk-...your OpenAI key...
   ```
5. Go to **Deploys → Trigger deploy → Deploy site**

---

### Option B — Connect GitHub (recommended, auto-deploys on every update)

1. Upload this folder to a new GitHub repository
2. Go to [app.netlify.com](https://app.netlify.com) → **"Add new site" → "Import an existing project"**
3. Connect GitHub and select the repository
4. Build settings are auto-detected from `netlify.toml` — no changes needed
5. Add environment variable:
   ```
   Key:   OPENAI_API_KEY
   Value: sk-...your OpenAI key...
   ```
6. Click **Deploy**

---

## Where to get your OpenAI API key

1. Go to [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Click **"Create new secret key"**
3. Copy the key and paste it into the Netlify environment variable above

---

## Need help?

Contact your developer for support.
