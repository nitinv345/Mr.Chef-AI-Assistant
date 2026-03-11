import React from 'react';
import { Home, Heart, ChefHat, Settings, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ViewState } from '../types';

interface NavbarProps {
  currentView: ViewState;
}

const Navbar: React.FC<NavbarProps> = ({ currentView }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const navItems = [
    { id: 'HOME', path: '/', label: 'Home', icon: Home },
    { id: 'FAVOURITE', path: '/favourite', label: 'Favourite', icon: Heart },
    { id: 'MAKER', path: '/maker', label: 'Recipe Maker', icon: ChefHat },
    { id: 'SETTINGS', path: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-md border-t border-gray-200 z-50 md:top-0 md:bottom-auto md:border-b md:border-t-0 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-around md:justify-center md:space-x-8 h-16 items-center">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            const Icon = item.icon;
            
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`relative group flex flex-col md:flex-row items-center p-2 rounded-lg transition-all duration-300 ease-in-out
                  ${isActive ? 'text-orange-600 scale-110' : 'text-gray-500 hover:text-orange-400 hover:scale-105'}
                `}
              >
                <Icon size={20} className={`mb-1 md:mb-0 md:mr-2 transition-transform duration-300 ${isActive ? 'animate-bounce-subtle' : ''}`} />
                <span className={`text-[10px] md:text-sm font-medium ${isActive ? 'font-bold' : ''}`}>
                  {item.label}
                </span>
                
                {/* Hover indicator */}
                <span className={`absolute -bottom-1 left-1/2 w-0 h-0.5 bg-orange-500 transition-all duration-300 group-hover:w-full group-hover:left-0 transform -translate-x-1/2 group-hover:translate-x-0 ${isActive ? 'w-full left-0' : ''}`}></span>
              </button>
            );
          })}

          <button
            onClick={handleLogout}
            className="flex flex-col md:flex-row items-center p-2 rounded-lg text-red-500 hover:text-red-600 hover:scale-105 transition-all duration-300"
          >
            <LogOut size={20} className="mb-1 md:mb-0 md:mr-2" />
            <span className="text-[10px] md:text-sm font-medium">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
