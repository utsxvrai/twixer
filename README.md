
# 🌐 Twixer - A Modern Twitter Clone

Twixer is a full-stack, modern social media application inspired by Twitter. It features tweet creation, user profiles, following mechanisms, commenting, likes, and more — all built using industry-standard technologies.

---

## 🚀 Features

- 🧑‍💼 User Authentication (Register & Login)
- 📝 Create, Edit, Delete Tweets
- 💬 Comment on Tweets
- ❤️ Like Tweets
- 🔁 Retweet (coming soon)
- 👤 User Profiles with Tweets, Followers & Following
- 🔐 Protected Routes using JWT
- 🛡️ Authentication Middleware
- 📘 Auto-generated Swagger API Documentation
- 📱 Fully Responsive Frontend
- 🌓 Modern Dark/Light UI Switch (optional)

---

## 🛠️ Tech Stack

### 📌 Backend (Node.js + Express + MongoDB)

| Tech               | Purpose                                      |
|--------------------|----------------------------------------------|
| **Node.js**        | JavaScript runtime                           |
| **Express.js**     | Web framework for REST API                   |
| **MongoDB**        | NoSQL database                               |
| **Mongoose**       | ODM for MongoDB                              |
| **JWT**            | Secure token-based authentication            |
| **Bcrypt**         | Password hashing                             |
| **Swagger + swagger-autogen** | API documentation               |
| **Winston**        | Logger                                        |
| **Custom Error Handling** | Consistent error management          |

### 🖥️ Frontend (React + Tailwind CSS)

| Tech                 | Purpose                                       |
|----------------------|-----------------------------------------------|
| **React.js**         | Component-based UI library                    |
| **Tailwind CSS**     | Utility-first CSS framework                   |
| **Axios**            | API requests                                  |
| **React Router**     | SPA routing                                   |
| **React Toastify**   | Notification toasts                           |
| **Context API / Zustand** | Global auth and UI state management    |

---

## 📁 Project Structure

```
/backend
├── src
│   ├── config/           # Server + DB config
│   ├── controllers/      # Request handlers
│   ├── middlewares/      # Auth, validation
│   ├── models/           # Mongoose schemas
│   ├── repositories/     # CRUD abstraction
│   ├── routes/           # All versioned routes
│   ├── services/         # Business logic
│   ├── utils/            # Custom error, logger, etc.
│   └── index.js          # Entry point

/frontend
├── src
│   ├── api/              # Axios instance + endpoints
│   ├── components/       # Reusable UI components
│   ├── context/          # Auth management
│   ├── hooks/            # Custom React hooks
│   ├── pages/            # Register, Login, Home, Profile
│   └── App.jsx           # Main router
```

---

## 📘 API Documentation

Visit Swagger UI at: `http://localhost:4000/api-docs` after starting the backend server.

---

## 🧑‍💻 Author

Built with 💻 by Utsav.
