# 🎨 Frontend – Event Booking System

This is the **frontend** of the Full-Stack Event Booking System built with **React + Vite**. It provides an intuitive, responsive web interface for users to browse and book events, as well as an admin panel for managing them.

---

## 🌟 Features

-   🔐 **Authentication**  
    Users can register and log in to access the system.

-   🏠 **Home Page (Event Listings)**

    -   Display all events in a responsive grid layout.
    -   Booked events show a "Booked" label instead of "Book Now".

-   📄 **Event Details Page**

    -   Shows full event information (name, date, venue, price, etc.).
    -   Includes a "Book Now" button that books a ticket and redirects to a Congratulations screen.

-   🧾 **Admin Panel**

    -   Admin users can create, edit, delete, and view all events.
    -   Secure access based on user role.

-   📱 **Responsive Design**  
    Optimized for desktop and tablet screens using modern CSS practices.

---

## ⚙️ Getting Started

These instructions will help you run the frontend locally.

### 📦 Prerequisites

Make sure you have the following installed:

-   [Node.js](https://nodejs.org/) (v16 or higher recommended)
-   [npm](https://www.npmjs.com/)

### 🚀 Installation & Run

1. **Navigate to the frontend directory:**

    ```
    cd frontend
    ```

2. **Install dependencies:**

    ```
    npm install
    ```

3. **Run the development server:**

    ```
    npm run dev
    ```

4. **Open in Browser:**
    ```
    Visit `http://localhost:5173` to view the app.
    ```
---
## 🔗 Backend Connection
The frontend connects to a **deployed backend** via REST API endpoints.

---

## 🧠 AI Tools Used
ChatGPT – Used for development planning, component generation, and bug fixing.
GitHub Copilot – Used for autocompleting code and boosting productivity.

---

## 📁 Project Structure (Frontend Only)

```
frontend/
├── public/
├── src/
│   ├── components/
│   ├── pages/
│   ├── context/
│   ├── layout/
│   ├── routes/
│   ├── hooks/
│   ├── utils/
│   └── App.jsx
├── index.html
├── package.json
└── vite.config.js
```
