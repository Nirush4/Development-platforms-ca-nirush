# 📰 NewsHub – Development Platforms Course Assignment

## Overview

**NewsHub** is a full-stack news platform where where users can browse, submit, and manage their own news articles. Users have full CRUD (Create, Read, Update, Delete) capabilities over their articles.  
This project demonstrates **modern frontend development practices**, user authentication, and cloud-based data management using **Supabase** as a Backend-as-a-Service (BaaS).

This repository implements **Option 2: Frontend with Supabase**, built using **React, TypeScript, and Tailwind CSS**.

---

## Motivation

I chose **Option 2: Frontend with Supabase** to gain experience building a **full-stack** application while leveraging a BaaS for authentication and database management.

### What I enjoyed:

- Working with **React + TypeScript** for type safety
- Styling with **Tailwind CSS** for responsive and modern UI
- Integrating **Supabase Auth** and managing UI state based on authentication

### Challenges:

- Configuring **Row Level Security (RLS)** correctly
- Protecting frontend routes and conditional rendering based on authentication
- Providing user-friendly error messages

### Reflections:

- Supabase accelerates development and reduces boilerplate
- Custom APIs allow more control, but SaaS solutions are efficient for small/medium projects

---

## 🚀 Live Project & Resources

- **Live Demo:** _(news-hubnet.netlify.app/)_
- **Project Planning (Kanban / GitHub Projects):** _(https://github.com/users/Nirush4/projects/15)_

---

## 🧩 Features

### Public Access

- View all news articles without authentication
- Articles display:
  - Title
  - Body
  - Category
  - Submission date

### User Authentication

- Registration and login with email/password via Supabase
- Conditional UI elements:
  - Login/Register hidden when logged in
  - Create Article link visible only to authenticated users

### Article Management

- Authenticated users can submit articles
- Articles include:
  - Title
  - Body
  - Image url
  - Category
  - Submission date (automatic)
  - Submitter id (user ID automatic)

### UX & Responsiveness

- Responsive design using Tailwind CSS
- Clear error handling and user feedback messages

---

## 🧠 Tech Stack

| Category   | Technology                 |
| ---------- | -------------------------- |
| Frontend   | React + TypeScript         |
| Styling    | Tailwind CSS               |
| Backend    | Supabase (Auth + Database) |
| Database   | PostgreSQL via Supabase    |
| Build Tool | Vite                       |
| Hosting    | Netlify                    |

---

## 🗂️ Project Structure

development-platforms-ca/
│
├─ public/
│ ├─ \_redirects
│ ├─ icon.png
│ └─ logo.png
│
├─ src/
│ ├─ components/ # Reusable UI components: Navbar, ArticleCard, ArticleForm, Footer, Pagination, Skeletons, etc.
│ ├─ lib/ # Supabase client setup (supabaseClient.ts)
│ ├─ types/ # TypeScript type definitions (index.ts)
│ ├─ utils/ # Utility functions and components (confirmModal, Loading, ScrollToTop)
│ ├─ view/ # Page views: Home, Login, Register, CreateArticle, EditArticle, SingleArticle, MyArticles
│ ├─ App.tsx # Main App component
│ └─ main.tsx # Entry point
│
├─ .env # Environment variables
├─ index.html # HTML template
├─ index.css # Global CSS styles (Tailwind imports)
├─ package-lock.json
├─ .eslintrc.cjs
├─ .gitignore
└─ LICENSE

---

## ⚙️ Getting Started

### Prerequisites

- Node.js v18+
- npm
- Supabase account

### 1. Clone the Repository

```bash
git clone https://github.com/Nirush4/Development-platforms-ca-nirush
cd Development-platforms-ca-nirush
```

## Install Dependencies

```bash
npm install
```

## Environment Variables

### Create a .env file in the root:

```bash
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Run the Application

```bash
npm run dev
```

- The app will run locally (default: http://localhost:5173).

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

---

## Author 👨‍💻​

• Nirushan Rajamanoharan (@Nirush4)

**Happy coding!**
