# Customer CRUD App (React + Express + SQLite)

This is a ready-made sample project demonstrating CRUD operations for Customers and Multiple Addresses.
It contains:

- `backend/` - Node.js + Express + SQLite (API server)
- `frontend/` - React app (React Router + Axios)

## What I included
- Seeded SQLite database with sample customers & addresses
- Customer CRUD endpoints and Address CRUD endpoints
- Search (city/state/pincode), pagination, sorting on the backend
- Frontend forms for creating/updating customers and addresses
- Simple client-side validation and basic UI

## Download & Upload to GitHub
You can download the project zip, extract it, and *upload to GitHub* using either:

### Option A — Upload via GitHub web UI (no Git installed)
1. Create a GitHub account at https://github.com if you don't have one.
2. Click **New repository** (the + icon → New repository).
3. Give it a name, e.g., `customer-crud-app`. Set Public or Private.
4. After repo is created, click **Add file → Upload files**.
5. Drag the extracted `customer-crud-app` folder contents (all files & folders) into the upload area.
6. Commit the changes (bottom of page). That's it — your project is now on GitHub.

### Option B — Using Git (recommended once comfortable)
1. Install Git: https://git-scm.com/downloads
2. Open terminal / Git Bash.
3. Extract the zip and `cd` into the extracted folder.
4. Run:
   ```
   git init
   git add .
   git commit -m "Initial commit - Customer CRUD App"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/customer-crud-app.git
   git push -u origin main
   ```
   Replace `YOUR_USERNAME` with your GitHub username.

## Run locally (after cloning or downloading)

### Backend
```
cd backend
npm install
node server.js
```
The server runs on http://localhost:5000 and auto-creates `customer.db` with seeded data.

### Frontend
```
cd frontend
npm install
npm start
```
The React app runs on http://localhost:3000 and talks to backend at http://localhost:5000.

## Notes
- If ports are different on your machine, update the `axios` base URLs in frontend files.
- The SQLite DB file `customer.db` is created when server starts. `.gitignore` excludes it.

Good luck! If you want, I can also walk you step-by-step while you're on the GitHub upload page.
