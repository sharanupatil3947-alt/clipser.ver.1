# Clipser - AI Video Repurposing & Viral Shorts Platform

> **Free, Open-Source ScaleReach Alternative with Zero Recurring Subscription Fees**

Clipser is a standalone, high-performance web platform that automatically converts long-form videos (YouTube, Twitch, Kick, Loom, Google Drive, or local MP4 files) into viral vertical shorts for **TikTok**, **Instagram Reels**, and **YouTube Shorts**.

Clipser provides **every single Pro feature** completely free forever for creators and businesses, with native low-latency backend synchronization and bi-directional CRM integration.

---

## ⚡ Core Capabilities

- **Automated AI Video Clipping**: Transcribes long-form audio with word-by-word precision to detect high-retention soundbites.
- **Smart Active-Speaker Face Tracking (16:9 to 9:16 Reframe)**: Keeps speakers centered with smooth dynamic pan coordinates.
- **Animated Karaoke Subtitles**: Burnt-in kinetic word-by-word highlighted captions with custom color palettes and glowing neon effects.
- **Virality Scoring & AI Hook Overlays**: Evaluates hook strength, pacing, and emotional curiosity (0–100 score).
- **Multi-Platform Scheduler**: Integrated auto-post queue for TikTok, Instagram Reels, YouTube Shorts, and LinkedIn.
- **Bi-Directional CRM Integration**: Native connectors for **HubSpot**, **Salesforce**, **Zoho CRM**, and custom **Webhooks** to push lead interaction touchpoints and campaign metrics.
- **Universal Browser Compatibility**: Fully responsive layout optimized for Desktop, Tablet, and Mobile Safari/Chrome.
- **Zero Recurring Costs**: Completely self-hostable with no enterprise tiers or credit-card gates.

---

## 🛠️ Architecture & Tech Stack

```
Clipser/
├── frontend/             # Next.js 14, Tailwind CSS, Lucide Icons, Context API
├── backend/              # FastAPI, SQLAlchemy, SQLite/PostgreSQL, WebSockets
│   ├── app/
│   │   ├── api/          # RESTful + WebSocket endpoints
│   │   ├── core/         # JWT Security, Config, Database sessions
│   │   ├── models/       # Users, Projects, Clips, Scheduler, CRM Models
│   │   ├── schemas/      # Pydantic v2 data contracts
│   │   └── services/     # Whisper, Mediapipe/OpenCV, FFmpeg, Virality Scorer
└── docker-compose.yml    # Single-command deployment
```

---

## 🚀 Quick Start Guide

### Option 1: Docker (Recommended)

```bash
# Clone the repository
git clone https://github.com/sharanupatil3947-alt/clipser.git
cd clipser

# Start frontend and backend
docker-compose up --build
```
Open **http://localhost:3000** in your browser.

---

### Option 2: Local Development Setup

#### 1. Backend (FastAPI)
```bash
cd backend
python -m venv venv
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
API Documentation will be live at: **http://localhost:8000/docs**

#### 2. Frontend (Next.js)
```bash
cd frontend
npm install
npm run dev
```
Clipser Dashboard will be live at: **http://localhost:3000**

---

## 🔐 Authentication Options
- **Email & Password**: Immediate local account creation with salted bcrypt password hashing and JWT sessions.
- **Google OAuth**: Instant 1-click authentication.
- **Free Pro Unlimited**: Every registered account is immediately assigned `pro_unlimited` with zero source minute limits.

---

## 🤝 CRM Synchronization & Webhooks
Clipser can push viewer retention metrics, lead attribution, and clip generation events directly to your CRM:
- **HubSpot**: Synchronizes marketing activities and contacts.
- **Salesforce**: Streams platform events for pipeline intelligence.
- **Zoho CRM**: Enriches deals with video engagement milestones.
- **Webhook**: Dispatches instant JSON payloads on clip render completions.

---

## 📄 License
MIT License. Free for personal, commercial, and enterprise usage.
