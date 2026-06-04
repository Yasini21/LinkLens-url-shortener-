# LinkLens - URL Shortener & Analytics Platform

## Overview

LinkLens is a full-stack MERN application that allows authenticated users to create short URLs, manage links through a dashboard, and track analytics such as click counts, recent visits, and overall performance.

---

## Problem Statement

The goal of this project is to provide a URL shortening platform with analytics capabilities. Users can generate unique short URLs, share them, and monitor their performance through a dedicated analytics dashboard.

---

## Features

### Authentication

* User Registration
* User Login
* JWT Authentication
* Protected Routes

### URL Management

* Generate Short URLs
* Unique Short Code Generation
* Delete URLs
* Copy Short URL

### Analytics

* Total Click Count
* Last Visited Time
* Recent Visit History
* Overall Analytics Dashboard
* Charts and Visualizations

### UI

* Responsive Design
* Loading States
* Error Handling
* Form Validation

---

## Architecture Diagram

![Architecture](./LinkLens%20\(system%20design\).png)

---

## AI Planning Process

### Phase 1: Requirement Analysis

Identified the core modules:

* Authentication
* URL Management
* Redirect Service
* Analytics

### Phase 2: Database Design

Designed separate collections for:

* Users
* URLs
* Analytics

### Phase 3: Backend Development

Implemented:

* REST APIs
* JWT Authentication
* URL Generation
* Redirect Handling
* Analytics Tracking

### Phase 4: Frontend Development

Built:

* Authentication Pages
* Dashboard
* URL Management Interface
* Analytics Dashboard

### Phase 5: Deployment

* Frontend deployed on Vercel
* Backend deployed on Render

---

## Assumptions

* Every shortened URL belongs to a single user.
* Users must be authenticated to manage URLs.
* Analytics are stored separately from URL metadata.
* Short codes are generated uniquely.
* URL validation is performed before storage.

---

## Tech Stack

### Frontend

* React.js
* React Router
* Axios
* Recharts

### Backend

* Node.js
* Express.js

### Database

* MongoDB
* Mongoose

### Authentication

* JWT
* bcrypt

---

## Setup Instructions

### Backend

```bash
cd Backend
npm install
npm start
```

### Frontend

```bash
cd Frontend
npm install
npm run dev
```

---

## Future Enhancements

* QR Code Generation
* Custom Aliases
* Device Analytics
* Team Workspaces
* Charts
* Live Demo

---

## Demo Video

[[Add your Loom or YouTube video link here.](https://www.loom.com/share/df4211422be44639963eafbc8fb407b6)]

---

## Live Demo

- Frontend: https://link-lens-url-shortener.vercel.app/
- Backend API: https://linklens-url-shortener-backend.onrender.com

---

## Author

Yasini V

---

This project is a part of a hackathon run by https://katomaran.com

