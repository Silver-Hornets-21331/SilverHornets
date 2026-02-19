# Firebase Database Setup Guide

## Problem: Data Not Showing in Database

Your website code is working correctly, but Firebase needs to be configured. Follow these steps:

---

## Step 1: Initialize Firestore Database

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project: **ftc213312026db**
3. In the left menu, click **"Firestore Database"**
4. Click **"Create database"** button
5. Choose **"Start in test mode"** (we'll add security rules next)
6. Select your preferred location (e.g., us-central)
7. Click **"Enable"**

---

## Step 2: Enable Email/Password Authentication

1. In Firebase Console (same project), click **"Authentication"** in left menu
2. Click **"Get started"** if not already enabled
3. Go to **"Sign-in method"** tab
4. Click on **"Email/Password"**
5. Toggle **"Enable"** to ON
6. Click **"Save"**

---

## Step 3: Set Up Security Rules

1. Go back to **"Firestore Database"**
2. Click the **"Rules"** tab
3. **Delete ALL existing text** in the editor
4. **Copy the entire contents** of `FIRESTORE_RULES.txt` file
5. **Paste** into the Firebase rules editor
6. Click **"Publish"**

The rules allow:
- ✅ Authenticated users to create/read/update their own hours
- ✅ Admins to approve all entries
- ❌ Unauthenticated access (blocked)

---

## Step 4: Test the System

1. Go to your website: [login.html](login.html)
2. Create a new account using invite code: `SILVERHORNET2026`
3. Sign in with your new account
4. Go to hours logging page
5. Add a test entry

---

## Step 5: Verify Data in Firebase

1. In Firebase Console, go to **"Firestore Database"**
2. Click **"Data"** tab
3. You should see two collections:
   - **members** (user profiles)
   - **hours** (time entries)
4. Click to expand and view the data

---

## Troubleshooting

### If you still don't see data:

1. **Open browser Developer Console** (F12)
   - Look for red error messages
   - Share any Firebase-related errors

2. **Check Authentication Status**
   - In Firebase Console → Authentication → Users
   - Verify your account appears in the list

3. **Verify Rules Are Published**
   - Firestore Database → Rules
   - Check that rules match `FIRESTORE_RULES.txt`
   - Look for "Published" status with recent timestamp

4. **Common Issues:**
   - ❌ Test mode expired (rules automatically deny after 30 days)
   - ❌ Email/Password auth not enabled
   - ❌ Firestore database not created
   - ❌ Browser blocking third-party cookies

---

## Admin Access

The email `ftc.team.boulan@gmail.com` is configured as admin and will:
- See the admin panel on hours page
- Auto-approve their own hours
- Can approve/reject all member entries
- Can export CSV reports

To add more admins, edit the `ADMIN_EMAILS` array in `js/hours.js`.

---

## Security Notes

✅ Your credentials are protected (see `.gitignore`)  
✅ Only authenticated users can access data  
✅ Users can only see/edit their own entries  
✅ Admins have full access for management  

**Do not use "test mode" rules in production!** The rules in `FIRESTORE_RULES.txt` provide proper security.
