import { useEffect, useState, useRef } from 'react';
import Logo from '/logo.png';
import Button from './Button';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiLogOut, FiUser, FiZap, FiChevronDown } from 'react-icons/fi';

const Header = () => {
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        setUser(null);
      }
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    localStorage.removeItem('id');
    setUser(null);
    setDropdownOpen(false);
    navigate('/login');
  };

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Generate Test', path: '/main' },
    { label: 'Pricing', path: '/pricing' },
    { label: 'About', path: '/about' },
  ];

  return (
    <header className="w-full bg-white/85 backdrop-blur-md border border-slate-200/80 shadow-xs rounded-2xl px-4 py-2 my-2 mr-3 flex justify-between items-center transition-all duration-200">
      {/* Brand Logo */}
      <Link to="/" className="flex items-center gap-2 group">
        <img
          src={Logo}
          alt="GetTest AI Logo"
          className="h-10 md:h-11 w-auto rounded-xl object-contain transition duration-200 group-hover:scale-105"
        />
      </Link>

      {/* Desktop Navigation Links */}
      <nav className="hidden md:flex items-center gap-1 lg:gap-2">
        {navLinks.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition duration-150 ${
                isActive
                  ? 'text-orange-600 bg-orange-50/80 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Right Side Actions */}
      {!user ? (
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            to="/login"
            className="text-sm font-medium text-slate-700 hover:text-slate-900 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition"
          >
            Log In
          </Link>
          <Link to="/register">
            <Button variant="primary" title="Get Started" className="!text-xs sm:!text-sm !py-1.5 sm:!py-2 !px-4" />
          </Link>
        </div>
      ) : (
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 p-1 pl-2 pr-3 rounded-full border border-slate-200 bg-white hover:bg-slate-50 transition cursor-pointer"
          >
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                user.name || 'User'
              )}&background=fed7aa&color=c2410c&bold=true`}
              alt="profile"
              className="w-8 h-8 rounded-full border border-orange-300 object-cover"
            />
            <span className="text-xs font-semibold text-slate-700 max-w-[100px] truncate hidden sm:inline">
              {user.name}
            </span>
            <FiChevronDown className="text-slate-400 text-xs" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-200/80 py-2 z-50 text-sm animate-in fade-in-50 duration-150">
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="text-xs text-slate-400 font-medium">Signed in as</p>
                <p className="font-semibold text-slate-800 truncate">{user.name}</p>
                {user.email && <p className="text-xs text-slate-500 truncate">{user.email}</p>}
              </div>

              <div className="py-1">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:bg-slate-50 hover:text-orange-600 transition"
                  onClick={() => setDropdownOpen(false)}
                >
                  <FiUser className="text-slate-400" />
                  <span>My Profile</span>
                </Link>

                <Link
                  to="/main"
                  className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:bg-slate-50 hover:text-orange-600 transition"
                  onClick={() => setDropdownOpen(false)}
                >
                  <FiZap className="text-slate-400" />
                  <span>Create Test</span>
                </Link>
              </div>

              <div className="pt-1 border-t border-slate-100">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-4 py-2 text-red-600 hover:bg-red-50 text-left transition"
                >
                  <FiLogOut className="text-red-500" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;