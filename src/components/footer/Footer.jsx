import React from 'react';
import { Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="w-full bg-slate-800/90 backdrop-blur-sm border-t border-slate-700/50 py-4">
      <div className="w-full px-6">
        <div className="flex flex-col md:flex-row items-center justify-between text-center md:text-left space-y-2 md:space-y-0">
          {/* Logo y nombre */}
          <div className="flex items-center justify-center md:justify-start">
            <img 
              src="/Logo_BLFAGS.png" 
              alt="BLFAGS Logo" 
              className="h-6 w-auto mr-2"
              onError={(e) => {
                e.target.style.display = 'none'
              }}
            />
            <span className="text-lg font-bold text-white">BLFAGS</span>
          </div>
          
          {/* Texto de copyright */}
          <p className="text-slate-400 text-xs flex items-center justify-center">
            © 2025 BLFAGS. Hecho con <Heart className="w-3 h-3 mx-1 text-red-400" /> para la comunidad
          </p>
        </div>
      </div>
    </footer>
  );
};
