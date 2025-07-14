import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  HomeIcon,
  FireIcon,
  ClockIcon,
  HeartIcon,
  UserGroupIcon,
  Cog6ToothIcon,
  PlayIcon,
} from '@heroicons/react/24/outline';
import {
  HomeIcon as HomeIconSolid,
  FireIcon as FireIconSolid,
  ClockIcon as ClockIconSolid,
  HeartIcon as HeartIconSolid,
  UserGroupIcon as UserGroupIconSolid,
  PlayIcon as PlayIconSolid,
} from '@heroicons/react/24/solid';
import { cn } from '../../utils/cn';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const navigation = [
    {
      name: 'Home',
      href: '/',
      icon: HomeIcon,
      iconSolid: HomeIconSolid,
      current: location.pathname === '/',
    },
    {
      name: 'Trending',
      href: '/trending',
      icon: FireIcon,
      iconSolid: FireIconSolid,
      current: location.pathname === '/trending',
    },
  ];

  const authenticatedNavigation = [
    {
      name: 'Subscriptions',
      href: '/subscriptions',
      icon: UserGroupIcon,
      iconSolid: UserGroupIconSolid,
      current: location.pathname === '/subscriptions',
    },
    {
      name: 'Your Videos',
      href: '/your-videos',
      icon: PlayIcon,
      iconSolid: PlayIconSolid,
      current: location.pathname === '/your-videos',
    },
    {
      name: 'Watch Later',
      href: '/watch-later',
      icon: ClockIcon,
      iconSolid: ClockIconSolid,
      current: location.pathname === '/watch-later',
    },
    {
      name: 'Liked Videos',
      href: '/liked-videos',
      icon: HeartIcon,
      iconSolid: HeartIconSolid,
      current: location.pathname === '/liked-videos',
    },
  ];

  const NavItem = ({ item }) => {
    const Icon = item.current ? item.iconSolid : item.icon;
    
    return (
      <Link
        to={item.href}
        onClick={onClose}
        className={cn(
          'flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200',
          item.current
            ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
        )}
      >
        <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
        {item.name}
      </Link>
    );
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full pt-20 lg:pt-4">
          {/* Navigation */}
          <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
            {/* Main Navigation */}
            <div className="space-y-1">
              {navigation.map((item) => (
                <NavItem key={item.name} item={item} />
              ))}
            </div>

            {/* Authenticated Navigation */}
            {isAuthenticated && (
              <>
                <div className="border-t border-gray-200 dark:border-gray-700 my-4" />
                <div className="space-y-1">
                  {authenticatedNavigation.map((item) => (
                    <NavItem key={item.name} item={item} />
                  ))}
                </div>
              </>
            )}

            {/* Settings */}
            <div className="border-t border-gray-200 dark:border-gray-700 my-4" />
            <div className="space-y-1">
              <Link
                to="/settings"
                onClick={onClose}
                className={cn(
                  'flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200',
                  location.pathname === '/settings'
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                )}
              >
                <Cog6ToothIcon className="mr-3 h-5 w-5 flex-shrink-0" />
                Settings
              </Link>
            </div>

            {/* User Info */}
            {isAuthenticated && user && (
              <div className="border-t border-gray-200 dark:border-gray-700 my-4 pt-4">
                <Link
                  to={`/channel/${user.username}`}
                  onClick={onClose}
                  className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200"
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.fullName}
                      className="mr-3 h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="mr-3 h-8 w-8 bg-primary-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {user.fullName?.charAt(0)?.toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{user.fullName}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      @{user.username}
                    </p>
                  </div>
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;