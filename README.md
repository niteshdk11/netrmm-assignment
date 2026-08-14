# NetRMM Assignment: Node.js Authentication Application

This is a full-stack Node.js application featuring user authentication, built for the NetRMM assignment. 

## Features
- **User Authentication:** Secure registration and login functionalities.
- **JWT (JSON Web Tokens):** For stateless, secure user sessions.
- **MongoDB:** Database for storing user credentials securely using `bcrypt`.
- **EJS & Tailwind CSS:** Server-side rendered views styled with modern utility classes.
- **Serverless Ready:** Configured to be deployed seamlessly on Vercel as serverless functions.

## Live Demo
The application is deployed and live on Vercel: 
[https://netrmm-assignment.vercel.app/login](https://netrmm-assignment.vercel.app/login)

## Tech Stack
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas, Mongoose
- **Frontend:** EJS (Embedded JavaScript templates), Tailwind CSS
- **Security:** JWT, bcrypt (for password hashing)

## Local Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/niteshdk11/netrmm-assignment.git
   cd netrmm-assignment
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Create a `.env` file in the root directory and add the following:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```

4. **Run the application:**
   ```bash
   npm run dev
   ```
   The app will run at `http://localhost:5000`.
