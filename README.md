# Finance Tracker

A full-featured full-stack web application that allows users to register, log in, and track their personal income, expenses, and savings goals.

## Features

- User registration and login (JWT-based authentication)
- Add, edit, and delete income and expense transactions
- Assign transactions to predefined categories
- Set savings goals and track monthly progress
- Real-time balance calculation
- Filters by title, transaction type, and category
- Conditional display of savings goals for "savings" expenses
- Flash messages for success and error feedback
- Secure routing with protected endpoints
- Fully functional front-end with HTML, CSS, JS (fetch)
- Deployed backend on Render

## Tech Stack

- **Backend**:
  - Node.js
  - Express
  - MongoDB (Mongoose)
  - JSON Web Token (JWT)
  - bcrypt for password hashing
  - express-validator
  - dotenv for environment variables
  - express-async-errors
  - helmet, cors, xss-clean, express-rate-limit (security)
  - connect-mongodb-session (session management)

- **Frontend**:
  - Vanilla JavaScript
  - HTML, CSS
  - Fetch API

## Folder Structure

finance-tracker/
│
├── controllers/ # Business logic (auth, transactions, goals)
├── middleware/ # Auth middleware, error handlers
├── models/ # Mongoose models (User, Transaction, Goal)
├── node_modules/
├── public/ # Static files (HTML, JS, CSS)
├── routes/ # Express routes
├── db/ # MongoDB connection file
├── .env # Environment variables (not committed)
├── .gitignore # Ignored files and folders
├── app.js # Main Express server
├── package.json
├── package-lock.json
└── README.md # Project documentation


## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_LIFETIME=30d

Author
Made by Mariia Domarkas
LinkedIn https://www.linkedin.com/in/mariia-domarkas/
