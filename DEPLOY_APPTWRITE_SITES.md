# Deploy appmass to Appwrite Sites

Appwrite has a built-in **Sites** service to host web apps. Since appmass is built with Expo (supports web), you can deploy the web version directly on Appwrite — no Vercel or Netlify needed.

---

## Option 1: Deploy via CLI (Recommended — 1 Command)

### Prerequisites

```bash
npm install -g appwrite-cli
appwrite login
```

### Deploy

```bash
cd C:\Users\student\Documents\appmass
node scripts\deploy-appwrite-sites.js
```

This will:
1. Build the web version (`npx expo export:web`)
2. Create an Appwrite Site named `appmass`
3. Upload the build folder
4. Activate the deployment

### Your site will be live at:

```
https://appmass.appwrite.site
```

---

## Option 2: Deploy via Console (Manual — No CLI)

1. **Build the app:**
   ```bash
   cd C:\Users\student\Documents\appmass
   npx expo export:web
   ```
   This creates a `web-build/` folder.

2. **Go to Appwrite Console:**
   - Open [cloud.appwrite.io](https://cloud.appwrite.io)
   - Select your project (`appmass`)
   - Click **"Sites"** in left sidebar
   - Click **"Create Site"**

3. **Configure:**
   | Setting | Value |
   |---------|-------|
   | Name | `appmass` |
   | Framework | `Static` (or `Expo`) |
   | Install command | `npm install` |
   | Build command | `npx expo export:web` |
   | Output directory | `web-build` |
   | Fallback file | `index.html` |

4. **Upload:** Upload the entire `web-build/` folder

5. **Deploy:** Click **"Deploy"**

---

## Option 3: Deploy via Git (Auto-deploy on push)

1. Push your code to GitHub
2. In Appwrite Console → Sites → appmass → **Connect Repository**
3. Select your GitHub repo
4. Set build settings:
   - Build command: `npx expo export:web`
   - Output directory: `web-build`
5. Every push to `main` auto-deploys

---

## After Deployment

### Custom Domain (Optional)
1. Console → Sites → appmass → **Domains**
2. Click **"Add Domain"**
3. Enter your domain (e.g., `appmass.com`)
4. Update your DNS records as instructed
5. SSL is automatically provisioned

### Verify
Open your site URL and check the browser console for:
```
[appmass] Appwrite connected successfully
```

### Environment Variables on Appwrite Sites
Go to Console → Sites → appmass → **Variables** and add:

| Variable | Value |
|----------|-------|
| `EXPO_PUBLIC_APPWRITE_ENDPOINT` | `https://sgp.cloud.appwrite.io/v1` |
| `EXPO_PUBLIC_APPWRITE_PROJECT_ID` | `6a574108002067b4d857` |
| `EXPO_PUBLIC_APP_NAME` | `appmass` |

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| `web-build` folder missing | Run `npx expo export:web` first |
| Blank white page on load | Ensure `fallback: index.html` is set (SPA routing) |
| API calls failing (CORS) | Add your site URL to Appwrite Console → Project → Settings → **Allowed Web Domains** |
| 404 on page refresh | Add rewrite rule: `/* → /index.html` |
| SSL errors | Automatic — wait 1-2 min for provisioning |
