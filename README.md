📌 Task Management

A modern full-stack Task Management SaaS application built with React (TypeScript), Laravel API, and clean UI design.
It supports task tracking, filtering, priority system, and real-time UI updates.

🚀 Features
📝 Create / Edit / Delete tasks
⚡ Instant UI updates (Optimistic UI)
📊 Dashboard stats (Pending / In Progress / Completed)
🔍 Search & filtering system
🎯 Priority system (Low / Medium / High)
🎨 Modern glassmorphism UI design
📱 Fully responsive design
🔄 Backend API integration (Laravel)
🧠 State management with React hooks
🧰 Tech Stack
Frontend
React (TypeScript)
Axios
Notiflix (notifications)
CSS (Custom modern styling)
Backend
Laravel
MySQL
REST API
📁 Project Structure
frontend/
│── components/
│   ├── TaskForm.tsx
│   ├── TaskItem.tsx
│
│── pages/
│   ├── TaskList.tsx
│
│── services/
│   ├── api.ts
│
│── App.tsx
│── main.tsx
│── index.css
│── app.css


⚙️ Installation Guide
1️⃣ Clone Project
git clone https://github.com/Shaid1998/task-manager.git
cd task-saas
2️⃣ Install Frontend
npm install
3️⃣ Run Frontend
npm run dev
4️⃣ Backend Setup (Laravel)
cd backend
composer install
php artisan migrate
php artisan serve
🔌 API Endpoints
Method	Endpoint	Description
GET	/tasks	Get all tasks
POST	/tasks	Create task
PUT	/tasks/{id}	Update task
DELETE	/tasks/{id}	Delete task
📊 Task Model
type Task = {
  id: number;
  title: string;
  description?: string;
  status: "pending" | "in_progress" | "completed";
  priority?: "low" | "medium" | "high";
};
🎯 Features Breakdown
✔ Task Management
Create tasks instantly
Edit inline
Delete with instant UI update
✔ Smart Filtering
Search by title
Filter by status
Filter by priority
✔ Dashboard Stats
Total tasks
Pending tasks
In progress tasks
Completed tasks
💡 Future Improvements
🔥 Drag & Drop Kanban Board
🔐 JWT Authentication system
🌙 Dark/Light theme toggle
📈 Admin analytics dashboard
🔔 Real-time notifications (WebSockets)
🖼 UI Preview

Modern glassmorphism UI with responsive layout and smooth UX.

👨‍💻 Developer Notes

This project is built for learning and production-level SaaS structure practice.
Focus is on:

Clean architecture
Optimistic UI updates
API integration
Scalable frontend structure
