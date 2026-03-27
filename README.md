# Timeline DD Hub — Deployment Guide

## What this is
A full React + Node.js web app version of the Timeline DD Hub.
The Node server handles SerpAPI calls so web search actually works (no CORS issues).

---

## Step 1 — Create a GitHub account
Go to https://github.com and sign up for a free account.

## Step 2 — Create a new repository
1. Click the + icon → New repository
2. Name it: timeline-dd-hub
3. Set to Private
4. Click Create repository

## Step 3 — Upload these files
1. On the repository page, click "uploading an existing file"
2. Drag and drop ALL files and folders from this zip:
   - index.html
   - vite.config.js
   - package.json
   - render.yaml
   - src/ (folder with main.jsx and App.jsx)
   - api/ (folder with server.js)
3. Click "Commit changes"

## Step 4 — Create a Render account
Go to https://render.com and sign up free (use your GitHub to sign in — easiest).

## Step 5 — Deploy on Render
1. Click New → Web Service
2. Connect your GitHub account if prompted
3. Select your timeline-dd-hub repository
4. Render will auto-detect the render.yaml settings
5. Click Create Web Service

## Step 6 — Add your SerpAPI key
1. In Render, go to your service → Environment
2. Add environment variable:
   - Key: SERP_API_KEY
   - Value: (paste your SerpAPI key)
3. Click Save — Render redeploys automatically

## Step 7 — Open your app
Render gives you a URL like: https://timeline-dd-hub.onrender.com
Open it in your browser — your full DD Hub with working web search!

## Step 8 — Test web search
1. Go to Settings → Test connection
2. Should show green "Connected" — web searches now work properly
3. Go to Board Report → generate a report and watch it search live

---

## Your SerpAPI key
Get one free at https://serpapi.com (100 searches/month, no card needed)

## Notes
- Free Render tier: app sleeps after 15 min inactivity, wakes in ~30 seconds
- Upgrade to Render paid ($7/mo) to keep it always-on if needed
- Your data is still stored in the browser — consider adding Supabase later for persistence
