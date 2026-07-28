[![Deployed on Render](https://img.shields.io/badge/Deployed-Render-blueviolet)](https://filipmilutinovic-ecommerce.onrender.com)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-green)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)](https://www.mongodb.com/cloud/atlas)

# Ecommerce Platform
Full-stack e-commerce solution with guest checkout, JWT authentication, and admin dashboard. Built with vanilla JavaScript (SPA) and Express.js.

## Key Features

### User Features
+ **Guest Checkout** – Order without registration (track via guestId that is generated on the backend and saved inside user's localStorage)
+ **User Accounts** – Register, login, order history, persistent cart (upon registration, guest orders containing the same email address will link to the created account)
+ **Product Browsing** – Search, filter by category/price, sort, pagination
+ **Shopping Cart** – Add/remove items, update quantities, persistent across sessions (if user is logged in, cart is stored in the database, else localStorage is used)
+ **Order Management** – View order history, track status, cancel pending orders

### Admin Features
+ **Product Management** – Full CRUD with image upload (Multer)
+ **Category Management** – CRUD operations
+ **Order Management** – View all orders
+ **Shipping Options** – Manage shipping methods
+ **Dashboard** – Overview of store data

### Security
+ **JWT Authentication** – Access + Refresh token system
+ **HTTP-only Cookies** – Protected against XSS attacks
+ **Refresh Token Rotation** – New JWT access token on each refresh, detects inactive refresh token reuse
+ **Role-Based Access** – Guest, Client, Admin roles
+ **Rate Limiting** – limited requests based on the environment variable (1000 on deployed live server) per 15 minutes (5 for login)
+ **Helmet.js** – Secure HTTP headers
+ **XSS Protection** – Input sanitization
+ **CSRF Protection** – SameSite cookies

### Technical Highlights
+ **SPA Architecture** – Custom frontend router (no frameworks)
+ **Vanilla JavaScript** – Pure ES modules, no libraries
+ **File Upload** – Multer with image validation
+ **Guest Cart** – Stored in localStorage (no server load)
+ **Order Progress Tracking** – Automatic status updates based on delivery date
+ **Toast Notifications** – Custom notification system
+ **Skeleton Loading** – Improved UX during data fetching

## Tech Stack

### Backend
| Technology | Purpose |
| ---------- | ------- |
| **Node.js + Express** | REST API Server |
| **MongoDB + Mongoose** | Database & ODM |
| **JWT** | Authentication |
| **Multer** | File upload |
| **Cookie Parser** | HTTP-only cookies |
| **Helmet** | Security headers |
| **Express rate limit** | Rate limiting |
| **Xss** | Input sanitization |

### Frontend
| Technology | Purpose |
| ---------- | ------- |
| **Vanila JavaScript** | ES Modules, SPA router |
| **CSS3** | Custom styling |
| **HTML5** | Semantic markup |

### Development & Deployment
| Technology | Purpose |
| ---------- | ------- |
| **Git** | Version control |
| **Render** | Backend deployment |
| **MongoDB Atlas** | Database hosting |
| **cron-job.org** | Scheduled tasks |

## Download Locally

### Prerequisites
> node.js
> MongoDB (local or Atlas)
> npm

### Installation
1. **Clone the repository**
```bash
git clone https://github.com/Filip000151/fullstack-ecommerce
cd fullstack-ecommerce
```
2. **Install backend dependencies**
```bash
npm install
```
3. **Set up environment variables**
```bash
#mac
cp .env.example .env
#windows
copy .env.example .env
#edit .env with your own values
```
4. **Seed the database**
```bash
npm run seed
```
5. **Start development server**
```bash
npm run dev
```
6. **Open your browser**
```text
http://localhost:3000
```

## Project Structure

```text
fullstack-ecommerce/
├───public
│   ├───images
│   │   ├───icons
│   │   ├───seeded
│   │   └───uploads
│   ├───scripts
│   │   ├───api
│   │   ├───components
│   │   ├───pages
│   │   ├───router
│   │   ├───utils
│   │   └───app.js
│   ├───styles
│   │   ├───components
│   │   └───main.css
│   └───index.html
└───src
    ├───controllers
    ├───db
    ├───errors
    ├───middleware
    ├───models
    ├───routes
    ├───seeder
    ├───services
    └───app.js
```

## Cron Jobs

| Job | Schedule | Purpose |
| --- | -------- | ------- |
| **Ping** | Every 10 minutes | Keep Render server awake |
| **Update Order Status** | Every two hours | Auto-update order statuses based on delivery date |
