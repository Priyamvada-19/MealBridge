# MealBridge - Smart Food Redistribution Platform

## Overview

MealBridge is a full-stack food redistribution platform designed to reduce food waste and improve food accessibility by connecting food donors, NGOs, and volunteers through a centralized system.

The platform enables donors to create food donations, NGOs to claim available food, and volunteers to manage pickup and delivery operations, ensuring that surplus food reaches people in need efficiently.

---

## Key Features

### Authentication & Authorization

* JWT-based secure authentication
* Google OAuth login integration
* Role-based access control
* Dynamic role selection for new users

### Donor Module

* Create food donations in real time
* View donation history
* Track donation status
* Donation impact dashboard

### NGO Module

* View available food donations
* Claim food donations
* Live donation updates
* Impact analytics and claim tracking

### Volunteer Module

* View available delivery requests
* Accept pickup and delivery tasks
* Track assigned deliveries
* Delivery status management

### Dashboard Analytics

* Total donations
* Active donations
* Claimed donations
* Meals served estimation
* Impact score calculation

---

## Technology Stack

### Frontend

* React.js
* React Router
* Axios
* Bootstrap
* CSS3

### Backend

* FastAPI
* Python
* SQLAlchemy
* Pydantic
* JWT Authentication

### Database

* SQLite

### Authentication

* JWT Tokens
* Google OAuth

---

## Project Structure

```text
MealBridge/
│
├── foodshare-backend/
│   ├── app/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── schemas/
│   │   ├── utils/
│   │   └── database.py
│   │
│   └── main.py
│
├── foodshare-frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── assets/
│   │   └── components/
│   │
│   └── public/
│
├── screenshots/
│
└── README.md
```

---

## Current Workflow

1. User registers or logs in.
2. User selects a role (Donor, NGO, Volunteer).
3. Donor creates food donations.
4. NGO claims available donations.
5. Volunteer picks up and delivers food.
6. Dashboard metrics update automatically.

---

## Future Enhancements

* Real-time notifications using WebSockets
* Geo-location based volunteer matching
* Interactive maps for pickups and deliveries
* Email and SMS notifications
* Donation verification system
* AI-based food priority prediction
* Admin analytics dashboard
* Mobile application support

---

## Learning Outcomes

* Full-stack application development
* REST API design
* JWT authentication and authorization
* Role-based system architecture
* Frontend-backend integration
* Database modeling with SQLAlchemy
* Real-world problem solving through technology

```
```
## Author
Priyamvada Kumar
