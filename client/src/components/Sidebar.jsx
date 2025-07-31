import React, { useState, useEffect, useRef } from 'react';
import {Link} from 'react-router-dom';
const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef(null); // Reference to the sidebar

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Close the sidebar when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside); // Cleanup on unmount
    };
  }, [isOpen]);

  return (
    <div className="flex">
      {/* Sidebar */}
      <div
        ref={sidebarRef} // Attach the ref to the sidebar div
        className={`fixed top-0 left-0 z-10 h-full w-64 backdrop-blur-sm bg-slate-100/30 py-6 pl-4 transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out`}
      >
        <button
          onClick={toggleSidebar}
          className="p-3 mb-2 text-2xl  rounded-full hover:bg-gray-500 hover:cursor-pointer transition"
        >
          <i className="fa-solid fa-bars"></i>
        </button>
        <ul>
          <li className="py-1.5 -ml-2 px-2 w-full hover:text-gray-900 hover:font-semibold">
            <Link to='/'>Home</Link>
          </li>
          <li className="py-1.5 -ml-2 px-2 w-full hover:text-gray-900 hover:font-semibold">
            <Link to='/profile'>Profile</Link>
          </li>
          <li className="py-1.5 -ml-2 px-2 w-full hover:text-gray-900 hover:font-semibold">
            <Link to='/main'>Get Started</Link>
          </li>
          <li className="py-1.5 -ml-2 px-2 w-full hover:text-gray-900 hover:font-semibold">
            <Link to='/pricing'>Pricing</Link>
          </li>
          <li className="py-1.5 -ml-2 px-2 w-full hover:text-gray-900 hover:font-semibold">
            <Link to='/'>About</Link>
          </li>
        </ul>
      </div>

      {/* Main content */}
      <div className="flex ">
        <button
          onClick={toggleSidebar}
          className="m-4 p-3 text-2xl rounded-full hover:bg-gray-500 hover:cursor-pointer transition"
        >
          <i className="fa-solid fa-bars"></i>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
