---
description: How to deploy the Pinky Name Picker app to Firebase Hosting
---

# Deploy using Firebase Hosting

Since this is a **Next.js** application, we will use Firebase's Web Frameworks support for the best experience.

## 1. Install Firebase Tools
If you haven't already, install the Firebase CLI globally:

```powershell
npm install -g firebase-tools
```

## 2. Login to Firebase
Authenticate with your Google account:

```powershell
// turbo
firebase login
```

## 3. Enable Web Frameworks
This feature automatically detects Next.js settings for a seamless build.

```powershell
// turbo
firebase experiments:enable webframeworks
```

## 4. Initialize the Project
Run the initialization command. 
- Select **Hosting: Configure files for Firebase Hosting...**
- Choose **"Use an existing project"** (if you created one in the Firebase Console) or **"Create a new project"**.
- When asked about "detected an existing Next.js codebase", answer **Yes**.
- For "GitHub Action deploys", answer **No** (unless you want to set that up).

```powershell
firebase init hosting
```

## 5. Deploy
Finally, build and deploy your application to the live URL.

```powershell
firebase deploy
```

---
**Note**: If you see any build errors, try running `npm run build` locally first to ensure your code is error-free.
