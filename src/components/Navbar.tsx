import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Menu, X } from 'lucide-react';

interface NavbarProps {
  onSignIn: () => void;
  onSignUp: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onSignIn, onSignUp }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-lg shadow-lg' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-3 cursor-pointer"
          >
            <div className="relative">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="currentColor" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
            </div>
            <span className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-transparent">
              Elyx
            </span>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink href="#features">Features</NavLink>
            <NavLink href="#about">About</NavLink>
            <NavLink href="#contact">Contact</NavLink>
            
            <div className="flex items-center space-x-4 ml-8">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onSignIn}
                className="text-gray-700 hover:text-emerald-600 font-medium transition-colors duration-200"
              >
                Sign In
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onSignUp}
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-6 py-2 rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Get Started
              </motion.button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{
            opacity: isMobileMenuOpen ? 1 : 0,
            height: isMobileMenuOpen ? 'auto' : 0
          }}
          transition={{ duration: 0.3 }}
          className="md:hidden overflow-hidden bg-white/95 backdrop-blur-lg rounded-2xl mt-2 shadow-xl"
        >
          <div className="px-6 py-4 space-y-4">
            <MobileNavLink href="#features">Features</MobileNavLink>
            <MobileNavLink href="#about">About</MobileNavLink>
            <MobileNavLink href="#contact">Contact</MobileNavLink>
            
            <div className="pt-4 border-t border-gray-200 space-y-3">
              <button
                onClick={onSignIn}
                className="w-full text-left text-gray-700 font-medium"
              >
                Sign In
              </button>
              <button
                onClick={onSignUp}
                className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-4 py-2 rounded-full font-medium"
              >
                Get Started
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.nav>
  );
};

const NavLink: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => (
  <motion.a
    whileHover={{ y: -2 }}
    href={href}
    className="text-gray-700 hover:text-emerald-600 font-medium transition-all duration-200 relative group"
  >
    {children}
    <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-500 to-emerald-600 group-hover:w-full transition-all duration-300"></div>
  </motion.a>
);

const MobileNavLink: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => (
  <a
    href={href}
    className="block text-gray-700 hover:text-emerald-600 font-medium transition-colors duration-200"
  >
    {children}
  </a>
);

export default Navbar;