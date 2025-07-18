import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import VideoWatch from './pages/VideoWatch';
import Upload from './pages/Upload';
import Tweets from './pages/Tweets';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="watch/:videoId" element={<VideoWatch />} />
            <Route path="tweets" element={<Tweets />} />
            <Route
              path="upload"
              element={
                <ProtectedRoute>
                  <Upload />
                </ProtectedRoute>
              }
            />
            <Route
              path="your-videos"
              element={
                <ProtectedRoute>
                  <div className="text-center py-16">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Your Videos</h2>
                    <p className="text-gray-600 dark:text-gray-400">Manage your uploaded videos here.</p>
                  </div>
                </ProtectedRoute>
              }
            />
            <Route
              path="subscriptions"
              element={
                <ProtectedRoute>
                  <div className="text-center py-16">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Subscriptions</h2>
                    <p className="text-gray-600 dark:text-gray-400">Videos from channels you've subscribed to.</p>
                  </div>
                </ProtectedRoute>
              }
            />
            <Route
              path="liked-videos"
              element={
                <ProtectedRoute>
                  <div className="text-center py-16">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Liked Videos</h2>
                    <p className="text-gray-600 dark:text-gray-400">Videos you've liked.</p>
                  </div>
                </ProtectedRoute>
              }
            />
            <Route
              path="history"
              element={
                <ProtectedRoute>
                  <div className="text-center py-16">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Watch History</h2>
                    <p className="text-gray-600 dark:text-gray-400">Videos you've watched recently.</p>
                  </div>
                </ProtectedRoute>
              }
            />
            <Route path="trending" element={
              <div className="text-center py-16">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Trending</h2>
                <p className="text-gray-600 dark:text-gray-400">Popular videos trending right now.</p>
              </div>
            } />
          </Route>
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;