# Developer Portfolio Generator (PortGen) 🚀

A full-stack MERN application that allows developers to generate and host their professional portfolios dynamically.

## ✨ Features
- [cite_start]**JWT Authentication**: Secure user login and management[cite: 80].
- [cite_start]**Dynamic Form**: Multi-section form for personal info, skills, projects, and experience[cite: 21, 26].
- [cite_start]**Public Profiles**: Unique shareable URLs for each developer (`/portfolio/:username`)[cite: 34].
- [cite_start]**Dark/Light Mode**: Full theme toggle support using Tailwind CSS[cite: 80].
- [cite_start]**Security**: IDOR protection and URL-safe username validation[cite: 46, 66].
- [cite_start]**Responsive Design**: Fully optimized for mobile and desktop.

## 🛠️ Tech Stack
- [cite_start]**Frontend**: React.js, Tailwind CSS, Axios, React Router[cite: 12].
- [cite_start]**Backend**: Node.js, Express.js[cite: 12].
- [cite_start]**Database**: MongoDB with Mongoose[cite: 12].

## ⚙️ Environment Variables
Create a `.env` file in the `backend` folder and add:
- `MONGO_URI`= your_mongodb_connection_string
- `JWT_SECRET`= your_secret_key
- `PORT`= 5000

## 🚀 Setup Instructions
1. **Clone the repo**: `git clone <repo_url>`
2. **Backend Setup**:
   - `cd backend`
   - `npm install`
   - `npm start`
3. **Frontend Setup**:
   - `cd frontend`
   - `npm install`
   - `npm run dev`
