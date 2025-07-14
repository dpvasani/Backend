# YouTweet Frontend

A modern, responsive frontend application for the YouTweet platform - a combination of YouTube-like video sharing and Twitter-style social features.

## Features

### 🎥 Video Features
- **Video Upload & Management**: Upload videos with thumbnails, titles, and descriptions
- **Video Player**: Custom video player with controls, fullscreen, and volume management
- **Video Discovery**: Browse, search, and filter videos
- **Video Interactions**: Like, share, and comment on videos

### 👥 User Features
- **Authentication**: Secure login and registration with JWT tokens
- **User Profiles**: Customizable profiles with avatars and cover images
- **Channel Management**: Personal channels with video management
- **Subscriptions**: Subscribe to channels and manage subscriptions

### 🐦 Social Features
- **Tweet System**: Create, edit, and delete tweets
- **Social Interactions**: Like tweets and videos
- **Real-time Updates**: Live updates for likes and subscriptions

### 🎨 UI/UX Features
- **Modern Design**: Clean, intuitive interface based on Figma designs
- **Dark Mode**: Full dark mode support
- **Responsive**: Mobile-first responsive design
- **Animations**: Smooth transitions and micro-interactions
- **Loading States**: Skeleton loaders and progress indicators

## Tech Stack

- **Frontend Framework**: React 18 with Vite
- **State Management**: Redux Toolkit
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form with validation
- **HTTP Client**: Axios with interceptors
- **Icons**: Heroicons & Lucide React
- **Notifications**: React Hot Toast
- **Date Handling**: date-fns

## Getting Started

### Prerequisites
- Node.js 16+ and npm
- Backend API running (see backend repository)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd youtweet-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   Update the `.env` file with your backend API URL:
   ```
   VITE_API_BASE_URL=http://localhost:4000/api/v1
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout/         # Layout components (Header, Sidebar)
│   ├── Video/          # Video-related components
│   └── ProtectedRoute.jsx
├── pages/              # Page components
│   ├── Auth/           # Authentication pages
│   ├── Home.jsx        # Home page
│   ├── VideoWatch.jsx  # Video player page
│   └── Upload.jsx      # Video upload page
├── store/              # Redux store and slices
│   ├── slices/         # Redux slices
│   └── store.js        # Store configuration
├── config/             # Configuration files
│   └── api.js          # API configuration
├── utils/              # Utility functions
└── App.jsx             # Main app component
```

## Key Features Implementation

### Authentication Flow
- JWT token-based authentication
- Automatic token refresh
- Protected routes
- Persistent login state

### Video Management
- File upload with preview
- Video player with custom controls
- Thumbnail generation
- Video metadata management

### State Management
- Redux Toolkit for global state
- Async thunks for API calls
- Optimistic updates for better UX
- Error handling and loading states

### Responsive Design
- Mobile-first approach
- Flexible grid layouts
- Touch-friendly interactions
- Adaptive navigation

## API Integration

The frontend integrates with the YouTweet backend API:

- **Authentication**: `/users/login`, `/users/register`, `/users/logout`
- **Videos**: `/videos`, `/videos/:id`, `/videos/upload`
- **Users**: `/users/profile`, `/users/update`
- **Social**: `/likes`, `/subscriptions`, `/tweets`

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Performance Optimizations

- **Code Splitting**: Route-based code splitting
- **Image Optimization**: Lazy loading and responsive images
- **Bundle Optimization**: Tree shaking and minification
- **Caching**: API response caching and browser caching
- **Virtual Scrolling**: For large video lists

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Design inspiration from modern video platforms
- Icons from Heroicons and Lucide
- UI components built with Tailwind CSS
- Backend API integration with YouTweet backend