# 🎓 CampusMate — All-in-One Smart Campus Operations Platform

CampusMate is a centralized, role-based web application designed to streamline campus life for students and provide powerful real-time operational control for administrators. Built for hackathons and production-ready deployments, CampusMate bridges the communication gap between students and campus authorities.

---

## 🚀 Key Features

### 👤 Student Portal
* **Secure Authentication:** JWT-based login and registration with automated session management.
* **Live Dashboard:** Real-time metrics tracking upcoming events, facility queues, and lost items.
* **Smart Wait (Queue Tracking):** Live congestion monitoring for high-traffic facilities like the canteen and IT help desk.
* **Lost & Found + Secure Claims:** Browse lost items and submit verified claims tied securely to your student account credentials to prevent fraud.
* **Campus Events:** Stay up to date with workshops, hackathons, and campus activities.
* **Help Desk & Complaints:** Submit and categorize infrastructure, IT, or cleanliness issues directly to the administration.
* **Emergency SOS:** Instant emergency trigger that captures geolocation coordinates and broadcasts alerts directly to campus security.
* **Campus Assistant:** Interactive chat assistant ready to answer quick questions about campus facilities.

### 🛡️ Admin Command Center
* **Unified Dashboard:** Real-time oversight summarizing active emergencies, open tickets, and queue statuses.
* **SOS Command Grid:** Live emergency feed mapped directly to Google Maps coordinates for immediate response.
* **Resource Management:** Dedicated portals to publish events, post lost and found items, and manage facility updates.
* **Anti-Spoofing Security Log:** Review verified student claims tied to database user accounts to ensure safe item returns.

---

## 🛠️ Tech Stack

* **Frontend:** HTML5, CSS3 (Modern Flexbox & CSS Grid, Custom Dark/Light UI), JavaScript (ES6+).
* **Backend:** Node.js, Express.js.
* **Database:** SQLite3 with relational tables (Users, Lost & Found, Claims, Complaints, Queues, Events, SOS Alerts).
* **Security:** JSON Web Tokens (JWT), Role-Based Access Control (RBAC) middleware.

---

## 📁 Project Structure

```text
CampusMate/
│
├── server/
│   ├── config/          # Database configuration and auto-migration
│   ├── controllers/     # Business logic for auth, sos, events, lost-found, etc.
│   ├── middleware/      # JWT verification and admin privilege guards
│   ├── routes/          # API endpoint route definitions
│   └── server.js        # Main Express application entry point
│
├── public/
│   ├── pages/           # HTML views (Dashboard, Lost & Found, SOS, Admin Portals, etc.)
│   └── js/              # Frontend client scripts
│
└── package.json         # Project dependencies and metadata
