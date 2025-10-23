import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX } from 'react-icons/fi';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef(null);

  const toggleSidebar = () => setIsOpen(!isOpen);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const menuItems = [
    { label: 'Home', path: '/' },
    { label: 'Profile', path: '/profile' },
    { label: 'Get Started', path: '/main' },
    { label: 'Pricing', path: '/pricing' },
    { label: 'About', path: '/about' },
  ];

  return (
    <div className="flex items-center">
      {/* Toggle button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleSidebar}
        className="m-4 p-3 text-2xl rounded-full bg-white/20 hover:bg-white/40 text-gray-800 shadow-md backdrop-blur-md transition"
      >
        {isOpen ? <FiX /> : <FiMenu />}
      </motion.button>

      {/* Sidebar Animated Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={sidebarRef}
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 100, damping: 15 }}
            className="fixed top-0 left-0 z-50 h-full w-64 bg-gradient-to-br from-white/70 to-orange-100/80 
                       backdrop-blur-md shadow-2xl rounded-r-2xl border-r border-white/40"
          >
            <div className="flex flex-col h-full justify-between py-6 px-5">
              {/* Header */}
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Get<span className="text-orange-500">Test</span> AI
                </h2>

                {/* Menu Items */}
                <ul className="space-y-3">
                  {menuItems.map((item, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        to={item.path}
                        onClick={() => setIsOpen(false)}
                        className="block px-3 py-2 text-gray-700 font-medium rounded-lg 
                                   hover:bg-gradient-to-r hover:from-orange-400 hover:to-pink-400 
                                   hover:text-white transition-all duration-200"
                      >
                        {item.label}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Footer text */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-center text-sm text-gray-500"
              >
                © {new Date().getFullYear()} GetTest AI
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Sidebar;
