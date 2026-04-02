# 🎓 Admission Management System

## 📌 Overview

A backend system built using **Node.js, Express, and MongoDB** to manage college admissions with **quota-based seat allocation** and **role-based access control**.

---

## 🚀 Features

* Program & quota setup (intake validation)
* Applicant creation & management
* Seat allocation with **no overbooking**
* Admission confirmation after **fee payment**
* Unique **admission number generation**
* Basic dashboard (intake vs filled seats)

---

## 🔐 Roles

* **ADMIN** → Setup programs & quotas
* **OFFICER** → Handle applicants & admissions
* **MANAGEMENT** → View dashboard

---

## 📡 APIs

* `POST /applicant/create`
* `POST /allocate-seat`
* `POST /mark-fee-paid`
* `POST /confirm-admission`
* `GET /dashboard`

---

## ⚙️ Setup

```bash
npm install
```

Create `.env`:

```
MONGODB_URI=your_db_url
JWT_SECRET=your_secret
PORT=3000
```

Run:

```bash
node server.js
```

---

## 💯 Highlights

* Prevents **quota overflow**
* Uses **JWT + role-based middleware**
* Implements real-world **admission workflow**

---

## 🤖 AI Usage

Used AI tools for guidance and structuring. All logic implemented and understood manually.

---

👨‍💻 **Yash Saxena**
