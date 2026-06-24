# 🌸 Little Memories — Get Your APK Online (Free)

## What you need
- A free GitHub account → https://github.com
- Your little-memories-source.zip file
- 15 minutes

---

## STEP 1 — Create a GitHub Account

Go to **https://github.com** → Sign Up (free)

---

## STEP 2 — Create a New Repository

1. Click the **+** icon (top right) → **New repository**
2. Repository name: `little-memories`
3. Set to **Private** (your memories app code)
4. Click **Create repository**

---

## STEP 3 — Upload the Project Files

### Option A — Using GitHub Website (easiest, no Git needed)

1. On your new repo page, click **uploading an existing file**
2. Unzip `little-memories-source.zip` on your computer
3. Drag the ENTIRE `little-memories/` folder contents into the upload area
4. Scroll down → click **Commit changes**

### Option B — Using Git (command line)

```bash
# Unzip
unzip little-memories-source.zip
cd little-memories

# Initialize git
git init
git add .
git commit -m "Initial commit - Little Memories app"

# Connect to your GitHub repo (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/little-memories.git
git branch -M main
git push -u origin main
```

---

## STEP 4 — Watch the APK Build Automatically

1. Go to your repo on GitHub
2. Click the **Actions** tab
3. You'll see **"Build Little Memories APK"** running ⏳
4. Wait ~10-15 minutes for it to finish ✅
5. Click on the completed workflow run
6. Scroll down to **Artifacts**
7. Click **little-memories-debug-apk** → Download ZIP

---

## STEP 5 — Install APK on Your Android Phone

1. Unzip the downloaded file → you get `app-debug.apk`
2. Transfer to your Android phone (WhatsApp, email, USB, Google Drive)
3. Open the APK file on your phone
4. If prompted: **Settings → Allow from this source → Install**
5. 🌸 Little Memories is installed!

---

## OPTIONAL — Trigger Build Manually Anytime

1. Go to **Actions** tab in your repo
2. Click **Build Little Memories APK**
3. Click **Run workflow** → **Run workflow**
4. New APK builds in ~10 minutes

---

## OPTIONAL — Create a Signed Release APK

For a cleaner install (no "unknown sources" warning):

### Generate a keystore on your computer:
```bash
keytool -genkey -v \
  -keystore little-memories-key.jks \
  -keyalg RSA -keysize 2048 \
  -validity 10000 \
  -alias little-memories
```

### Convert keystore to base64:
```bash
# Mac/Linux:
base64 -i little-memories-key.jks | pbcopy

# Windows PowerShell:
[Convert]::ToBase64String([IO.File]::ReadAllBytes("little-memories-key.jks")) | clip
```

### Add GitHub Secrets:
1. Go to repo → **Settings** → **Secrets and variables** → **Actions**
2. Add these 4 secrets:

| Secret Name | Value |
|---|---|
| `KEYSTORE_BASE64` | (paste the base64 output) |
| `KEYSTORE_PASSWORD` | your keystore password |
| `KEY_ALIAS` | `little-memories` |
| `KEY_PASSWORD` | your key password |

### Create a release:
```bash
git tag v1.0.0
git push origin v1.0.0
```
→ Signed APK appears under **Releases** on GitHub!

---

## Troubleshooting

| Problem | Fix |
|---|---|
| Actions tab not visible | Go to Settings → Actions → Allow all actions |
| Build fails at Gradle | Check Actions log, usually a dependency issue |
| APK won't install | Enable "Install unknown apps" for your file manager |
| "App not installed" error | Uninstall any previous version first |
| Build takes too long | GitHub free tier allows 2000 minutes/month — plenty |

---

## Summary of Files

```
.github/
└── workflows/
    ├── build-apk.yml      ← Builds debug APK on every push
    └── release-apk.yml    ← Builds signed APK on git tag
```

Both workflows run on **GitHub's free tier** (2000 minutes/month free).
