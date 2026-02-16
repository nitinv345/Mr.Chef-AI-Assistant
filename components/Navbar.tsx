import React from 'react';
import { Home, Heart, ChefHat, Settings } from 'lucide-react';
import { ViewState } from '../types';

interface NavbarProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, setView }) => {
  const navItems = [
    { id: 'HOME', label: 'Home', icon: Home },
    { id: 'FAVOURITE', label: 'Favourite', icon: Heart },
    { id: 'MAKER', label: 'Recipe Maker', icon: ChefHat },
    { id: 'SETTINGS', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-md border-t border-gray-200 z-50 md:top-0 md:bottom-auto md:border-b md:border-t-0 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-around md:justify-center md:space-x-12 h-16 items-center">
          {navItems.map((item) => {
            const isActive = currentView === item.id || (item.id === 'HOME' && currentView === 'RECIPE_DETAIL');
            const Icon = item.icon;
            
            return (
              <button
                key={item.id}
                onClick={() => setView(item.id as ViewState)}
                className={`relative group flex flex-col md:flex-row items-center p-2 rounded-lg transition-all duration-300 ease-in-out
                  ${isActive ? 'text-orange-600 scale-110' : 'text-gray-500 hover:text-orange-400 hover:scale-105'}
                `}
              >
                <Icon size={24} className={`mb-1 md:mb-0 md:mr-2 transition-transform duration-300 ${isActive ? 'animate-bounce-subtle' : ''}`} />
                <span className={`text-xs md:text-sm font-medium ${isActive ? 'font-bold' : ''}`}>
                  {item.label}
                </span>
                
                {/* Hover indicator */}
                <span className={`absolute -bottom-1 left-1/2 w-0 h-0.5 bg-orange-500 transition-all duration-300 group-hover:w-full group-hover:left-0 transform -translate-x-1/2 group-hover:translate-x-0 ${isActive ? 'w-full left-0' : ''}`}></span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
