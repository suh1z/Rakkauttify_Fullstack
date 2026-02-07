# 🎮 CS2 Analytics Dashboard

A full-stack web application for Counter-Strike 2 player and team analytics, featuring scouting reports, match statistics, and league data visualization.

**Live Demo:** [https://lovecanal.onrender.com/](https://lovecanal.onrender.com/)

![CS2](https://img.shields.io/badge/CS2-Analytics-orange?style=flat-square)
![React](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-green?style=flat-square&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-green?style=flat-square&logo=mongodb)

## ✨ Features

- **📊 Player Statistics** - Detailed player performance metrics and analytics
- **👥 Team Scouting** - Head-to-head comparisons and team roster analysis
- **🗺️ Map Statistics** - Win rates and performance data across different maps
- **📅 Match Calendar** - Upcoming matches and schedule tracking
- **🏆 League Integration** - Pappaliiga division data (Div 6, 12, 16)
- **🔐 User Authentication** - JWT-based secure login system
- **📱 Responsive Design** - CS2-themed dark UI that works on all devices

## 🛠️ Tech Stack

### Frontend
- **React 18** with Vite
- **Redux Toolkit** for state management
- **Material-UI (MUI)** for components
- **React Router** for navigation
- **D3.js** for data visualization

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Helmet** for security headers
- **Rate limiting** for API protection

### Data Sources
- **MongoDB** - User data and authentication
- **Azure** - CS2 match and player data via [Zooze](https://github.com/z00ze)
- **FACEIT API** - Player profiles and statistics

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB database
- npm or yarn

### Environment Variables

Create a `.env` file in the root directory:

```env
MONGODB_URI=your_mongodb_connection_string
SECRET=your_jwt_secret
PORT=3003
FRONTEND_URL=http://localhost:5173
```

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/your-repo-name.git
   cd your-repo-name
   ```

2. **Install backend dependencies**
   ```bash
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   cd ..
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

   The backend runs on `http://localhost:3003` and frontend on `http://localhost:5173`

### Production Build

```bash
npm run build:ui    # Build frontend and copy to dist
npm start           # Start production server
```

## 📁 Project Structure

```
├── app.js                 # Express app configuration
├── index.js               # Server entry point
├── controllers/           # Route handlers
│   ├── inhouse.js         # Inhouse game routes
│   ├── leagueStats.js     # League statistics routes
│   ├── login.js           # Authentication routes
│   └── users.js           # User management routes
├── models/                # Mongoose schemas
│   ├── queue.js
│   └── user.js
├── utils/                 # Utilities
│   ├── config.js          # Environment configuration
│   ├── logger.js          # Logging utility
│   └── middleware.js      # Express middleware
└── frontend/              # React application
    └── src/
        ├── components/    # React components
        ├── reducers/      # Redux slices
        ├── services/      # API service functions
        └── utils/         # Frontend utilities
```

## 🔒 Security Features

- **Helmet** - Secure HTTP headers
- **CORS** - Origin restriction
- **Rate Limiting** - Request throttling
- **JWT Authentication** - Secure token-based auth
- **Input Sanitization** - MongoDB injection prevention

## 📝 API Routes

| Route | Description |
|-------|-------------|
| `POST /api/login` | User authentication |
| `GET /api/players` | Player statistics |
| `GET /api/matches` | Match data |
| `GET /api/months` | Monthly statistics |
| `GET /api/faceit-profile` | FACEIT player data |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Zooze](https://github.com/z00ze) - CS2 data pipeline
- [FACEIT](https://www.faceit.com/) - Player statistics API
- [Pappaliiga](https://www.pappaliiga.fi/) - Finnish CS2 league
