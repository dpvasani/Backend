# YouTweet - Full Stack Application

A modern full-stack application combining YouTube-like video sharing with Twitter-style social features.

## 🚀 Project Overview

YouTweet is a comprehensive platform that allows users to:
- Upload and share videos with custom thumbnails
- Create and manage personal channels
- Post tweets and interact socially
- Subscribe to channels and build communities
- Like, comment, and engage with content

## 📁 Project Structure

```
youtweet-frontend/
├── backend/                 # Backend API (Node.js + Express + MongoDB)
│   ├── src/
│   │   ├── controllers/     # API controllers
│   │   ├── models/         # MongoDB models
│   │   ├── routes/         # API routes
│   │   ├── middlewares/    # Custom middlewares
│   │   └── utils/          # Utility functions
│   ├── package.json
│   └── README.md
├── src/                    # Frontend React Application
│   ├── components/         # Reusable UI components
│   ├── pages/             # Page components
│   ├── store/             # Redux store and slices
│   ├── config/            # Configuration files
│   └── utils/             # Utility functions
├── package.json
└── README.md
```

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT tokens
- **File Upload**: Multer + Cloudinary
- **Security**: bcrypt, CORS

### Frontend
- **Framework**: React 18 with Vite
- **State Management**: Redux Toolkit
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form
- **HTTP Client**: Axios
- **UI Components**: Heroicons, Lucide React

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm
- MongoDB database
- Cloudinary account (for file storage)

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.sample .env
   ```
   
   Update `.env` with your configuration:
   ```env
   PORT=4000
   MONGODB_URL=mongodb://localhost:27017/youtweet
   CORS_ORIGIN=http://localhost:5173
   ACCESS_TOKEN_SECRET=your_access_token_secret
   ACCESS_TOKEN_EXPIRY=1d
   REFRESH_TOKEN_SECRET=your_refresh_token_secret
   REFRESH_TOKEN_EXPIRY=10d
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_key
   CLOUDINARY_API_SECRET=your_cloudinary_secret
   ```

4. **Start backend server**
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Navigate to project root**
   ```bash
   cd ..
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env`:
   ```env
   VITE_API_BASE_URL=http://localhost:4000/api/v1
   ```

4. **Start frontend development server**
   ```bash
   npm run dev
   ```

## 📱 Features

### 🎥 Video Management
- **Upload Videos**: Upload videos with thumbnails and metadata
- **Video Player**: Custom video player with full controls
- **Video Discovery**: Browse, search, and filter videos
- **Channel Management**: Organize videos in personal channels

### 👤 User System
- **Authentication**: Secure registration and login
- **User Profiles**: Customizable profiles with avatars
- **Channel Subscriptions**: Subscribe to favorite channels
- **Watch History**: Track viewing history

### 🐦 Social Features
- **Tweet System**: Post and manage tweets
- **Interactions**: Like videos, tweets, and comments
- **Comments**: Comment on videos and engage
- **Social Feed**: Discover content from subscriptions

### 🎨 UI/UX
- **Responsive Design**: Mobile-first responsive layout
- **Dark Mode**: Full dark theme support
- **Modern Interface**: Clean, intuitive design
- **Real-time Updates**: Live notifications and updates

## 🔧 API Endpoints

### Authentication
- `POST /api/v1/users/register` - User registration
- `POST /api/v1/users/login` - User login
- `POST /api/v1/users/logout` - User logout
- `POST /api/v1/users/refresh-token` - Refresh access token

### Videos
- `GET /api/v1/videos` - Get all videos
- `POST /api/v1/videos` - Upload video
- `GET /api/v1/videos/:id` - Get video by ID
- `PATCH /api/v1/videos/:id` - Update video
- `DELETE /api/v1/videos/:id` - Delete video

### Users
- `GET /api/v1/users/current-user` - Get current user
- `GET /api/v1/users/c/:username` - Get user channel
- `PATCH /api/v1/users/update-account` - Update user details

### Social
- `POST /api/v1/likes/toggle/v/:videoId` - Toggle video like
- `POST /api/v1/subscriptions/c/:channelId` - Toggle subscription
- `POST /api/v1/tweets` - Create tweet
- `GET /api/v1/tweets/user/:userId` - Get user tweets

## 🧪 Testing

Use the provided Postman collection (`Backend.postman_collection.json`) to test API endpoints.

## 📦 Deployment

### Backend Deployment
1. Set up MongoDB Atlas or your preferred MongoDB hosting
2. Configure Cloudinary for file storage
3. Deploy to platforms like Heroku, Railway, or DigitalOcean
4. Update environment variables for production

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy to platforms like Vercel, Netlify, or AWS S3
3. Update API base URL for production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Design inspiration from modern video platforms
- MongoDB for database solutions
- Cloudinary for media management
- The React and Node.js communities

## 📞 Support

For support, email support@youtweet.com or create an issue in the repository.

---

**Happy Coding! 🚀**