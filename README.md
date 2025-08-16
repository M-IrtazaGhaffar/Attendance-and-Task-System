Here’s a good `README.md` draft for your **Attendance and Task Management System** project with Docker, Next.js (client), Node.js/Express (servers), PostgreSQL, and Nginx load balancing.

---

# 📌 Attendance & Task Management System

A full-stack web application that allows **Users** and **Admins** to manage **Attendance** and **Tasks**.
Built with **Next.js (frontend)**, **Express + Prisma (backend)**, **PostgreSQL (database)**, and **Docker Compose** with **Nginx load balancing**.

---

## 🚀 Features

### 🔑 Authentication

* User **Sign Up** and **Sign In**
* JWT-based authentication
* Secure cookie storage for tokens

### 👤 User Routes

* View personal tasks
* Mark attendance
* Update profile
* Restricted from accessing other users’ tasks

### 🛠️ Admin Routes

* Create / update / delete tasks
* Manage users
* View attendance logs
* Assign tasks to specific users

---

## 🏗️ Tech Stack

* **Frontend**: Next.js 15, TailwindCSS
* **Backend**: Node.js, Express, Prisma ORM
* **Database**: PostgreSQL
* **Reverse Proxy / Load Balancer**: Nginx
* **Containerization**: Docker & Docker Compose

---

## 📂 Project Structure

```
├── client/          # Next.js frontend
├── server/          # Express backend (Prisma + JWT Auth)
├── nginx/           # Nginx config files
│   ├── nginx.conf
│   ├── default.conf
├── database/        # PostgreSQL persistent volume
├── docker-compose.yml
├── README.md
```

---

## ⚙️ Environment Variables

Create a `.env` file inside the `server/` folder:

```env
PORT=5000
JWT_SECRET=AnySecretHere
JWT_EXPIRES_IN=7d
DATABASE_URL=postgresql://user:user@db:5432/userdb
```

And inside the `client/` folder (if needed):

```env
NEXT_PUBLIC_API_URL=http://localhost/api/v1
```

---

## 🐳 Docker Setup

### 1️⃣ Build & start containers

```bash
docker-compose up --build
```

### 2️⃣ Access services

* Frontend: **[http://localhost](http://localhost)**
* API (via Nginx proxy): **[http://localhost/api/v1/](http://localhost/api/v1/)**
* PostgreSQL: **localhost:5432**

### 3️⃣ Stop containers

```bash
docker-compose down
```

---

## 🔄 Load Balancing

Nginx distributes API requests between **server1, server2, server3**:

```nginx
upstream backend {
    least_conn;
    server server1:5000;
    server server2:5000;
    server server3:5000;
}
```

---

## 🛣️ API Endpoints

### Auth

* `POST /api/v1/auth/signup` → Register
* `POST /api/v1/auth/signin` → Login

### User

* `GET /api/v1/user/tasks` → Get user tasks
* `POST /api/v1/user/attendance` → Mark attendance
* `POST /api/v1/user/gettaskbyidanduserid` → Get task by ID (user restricted)

### Admin

* `POST /api/v1/admin/task` → Create task
* `PUT /api/v1/admin/task/:id` → Update task
* `DELETE /api/v1/admin/task/:id` → Delete task
* `GET /api/v1/admin/users` → List all users

---

## 📝 Notes

* `nginx` handles routing:

  * `/` → Next.js client
  * `/api` → Express servers (load-balanced)
* Database data persists using Docker volume `postgres_data`.
* Prisma migrations run automatically on container startup.

---

✅ Now anyone cloning your repo will be able to understand how to run and use your system.

---

Do you want me to also include **step-by-step instructions** for setting up Prisma migrations + seeding users/admins so someone can test it right away?
