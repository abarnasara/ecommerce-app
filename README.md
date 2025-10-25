# React E-commerce Dashboard

This is a React-based e-commerce application with Firebase authentication and admin support. Users can browse products, add items to their cart or wishlist, and place orders. Admins can manage orders and update order statuses.

## Features

### User

- Login with **Google** or **Email/Password** (admin login)
- Browse products with **search** and **sorting** (price low → high, high → low)
- Add products to **wishlist** and **cart**
- Move items from **wishlist to cart**
- Place **orders** with delivery address
- Track **order history**
- Dynamic **stock management** based on orders

### Admin

- Login with **admin email/password**
- View all orders with user information
- Update **order status** (On Process → Shipped → Delivered)
- Admin access restricted to a specific email

## Tech Stack

- **Frontend:** React, React Router, Tailwind CSS
- **Authentication:** Firebase (Google login & email/password)
- **Data Storage:** LocalStorage (cart, wishlist, orders, products)
- **Backend API:** Fake API (`http://localhost:5000/products`)

## Getting Started

### Prerequisites

- Node.js & npm installed
- Firebase project created with Authentication enabled

### Installation

1. Clone the repository:

- git clone < repo-url >
- cd < repo-folder >

2. Install dependencies:

npm install

3. Configure Firebase:

- Create a .env or firebase.js file with your Firebase config
- Enable Google and Email/Password authentication in Firebase console

4. Run fake API server:

json-server --watch db.json --port 5000

5. Start the development server:

npm start

## Default Admin Credentials

- Email: admin@gmail.com
- Password: password

Admin email must be registered in Firebase Authentication to login.
