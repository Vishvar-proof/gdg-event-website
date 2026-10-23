# Google Developer Groups (GDG) Event Website

A lightweight, modern, responsive single-page website for Google Developer Groups (GDG) events with an interactive registration form, client-side input validation, digital attendee ticket pass modal, and live countdown timer.

---

## 🚀 Quick Start (Run Commands)

You can run the project using any of the following commands from this directory (`d:\vishva laptop`):

### Option 1: One-Click Runner (Recommended)
In your terminal, simply run:
```powershell
.\run.bat
```
*(Or in PowerShell: `.\run.ps1`)*

This automatically starts a local web server and opens [http://localhost:8000](http://localhost:8000) directly in your browser.

---

### Option 2: Run Local Web Server with Python
Since Python (`py`) is installed on your system:
```powershell
py -m http.server 8000
```
Then visit: **[http://localhost:8000](http://localhost:8000)**

---

### Option 3: Open Directly in Browser
```powershell
Start-Process index.html
```

---

## ✏️ How to Edit Event Details (For Non-Experts)

All editable placeholders are marked with clear `[EDITABLE]` tags.

### 1. In `index.html`:
- **Event Title & Subtitle**: Search for `<!-- [EDITABLE]: Event Main Title -->` (around line 75).
- **Date, Time & Venue**: Search for `<!-- [EDITABLE]: Event Date & Time -->` and `<!-- [EDITABLE]: Event Location -->` (around lines 90–120).
- **Chapter / City Name**: Search for `[Your City Chapter]` in the navigation header and footer.
- **Speakers & Schedule**: Search for `<section id="schedule">` and `<section id="speakers">` to customize talk times, topics, and speaker names.

### 2. In `script.js`:
- Open `script.js` and edit the `EVENT_CONFIG` block at the top:
  ```javascript
  const EVENT_CONFIG = {
    targetDate: new Date('2026-11-14T09:30:00+05:30'), // Set to your event date & time
    title: 'Your GDG Event Name',
    location: 'Your Venue or Streaming Link',
    description: 'Event description for calendar export...'
  };
  ```

---

## 📬 Connecting the Registration Form to a Backend

By default, the form validates inputs in real-time in the browser and displays a confirmation pass ticket. To collect submitted registrations in real-time, choose any of the free options below:

### Option A: Free Google Sheets Integration (via Google Apps Script)
1. Open Google Sheets and create a new sheet with columns: `Full Name`, `Email`, `Organization`, `Role`, `Experience`, `Track`, `Attendance Mode`, `Accommodations`, `Submitted At`.
2. Click **Extensions > Apps Script** and paste:
   ```javascript
   function doPost(e) {
     var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
     var data = JSON.parse(e.postData.contents);
     sheet.appendRow([
       data.fullName, data.email, data.organization, data.role,
       data.experience, data.track, data.attendanceMode, data.accommodations, data.submittedAt
     ]);
     return ContentService.createTextOutput(JSON.stringify({result: "success"}))
       .setMimeType(ContentService.MimeType.JSON);
   }
   ```
3. Click **Deploy > New Deployment**, select type **Web App**, set access to **Anyone**, and copy the Web App URL.
4. In `script.js`, paste this URL into `backendEndpointUrl`:
   ```javascript
   backendEndpointUrl: 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec'
   ```

### Option B: Formspree (Instant Form Handling)
1. Sign up at [formspree.io](https://formspree.io) (free tier covers 50 submissions/month).
2. Create a form and paste your endpoint into `script.js` in `backendEndpointUrl: 'https://formspree.io/f/YOUR_ID'`.

---

## 🌐 How to Host for Free & Get Your Live URL

You can host this static website for free on any of the popular platforms below in less than 3 minutes:

### 1. GitHub Pages (Recommended)
1. Create a free account at [github.com](https://github.com).
2. Create a new public repository (for example named `gdg-devfest-2026`).
3. Upload the files (`index.html`, `styles.css`, `script.js`, `README.md`) using the GitHub website upload button or via git:
   ```bash
   git init
   git add .
   git commit -m "Initial GDG event site"
   git branch -M main
   git remote add origin https://github.com/<your-username>/gdg-devfest-2026.git
   git push -u origin main
   ```
4. On GitHub, go to your repository's **Settings > Pages**.
5. Under **Branch**, select `main` and `/ (root)`, then click **Save**.
6. **Your Resulting Live URL**:
   ```
   https://<your-username>.github.io/gdg-devfest-2026/
   ```

---

### 2. Netlify Drop (Zero-Command Drag-and-Drop)
1. Go to [app.netlify.com/drop](https://app.netlify.com/drop).
2. Drag and drop this folder (`d:\vishva laptop`) into the browser window.
3. Within 10 seconds, Netlify will generate a live HTTPS link.
4. Go to **Site Configuration > Change site name** to set a custom subdomain like `gdg-devfest-2026.netlify.app`.
5. **Your Resulting Live URL**:
   ```
   https://<your-site-name>.netlify.app
   ```

---

### 3. Vercel
1. Install Vercel CLI or visit [vercel.com](https://vercel.com).
2. In your terminal inside this folder:
   ```bash
   npx vercel
   ```
3. Follow the 3 prompts (hit Enter to accept defaults).
4. **Your Resulting Live URL**:
   ```
   https://<your-project-name>.vercel.app
   ```

---

## 🎨 Design Tokens & Branding
- **Google Blue**: `#1a73e8`
- **Google Red**: `#ea4335`
- **Google Yellow**: `#fbbc04`
- **Google Green**: `#34a853`
- **Typography**: Google Font `Plus Jakarta Sans` with fallback to system UI sans-serif.
