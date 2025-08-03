import { useEffect, useState } from 'react';
import Logo from '/logo.png';
import Button from './Button';
import { Link, useNavigate } from 'react-router-dom';
import { FiLogOut } from 'react-icons/fi';

const Header = () => {
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    setUser(null);
    navigate('/login');
  };

  return (
    <header className="mt-2 w-full rounded-2xl mx-3 bg-[linear-gradient(60deg,_#ffc1cd,_#d3c7f1,_#b7e6f9,_#9ef2ff)]
hover:bg-[linear-gradient(60deg,_#ffb4c1,_#d3c7f1,_#b7e6f9,_#9ef2e6)]

 shadow-md px-3 py-1 flex justify-between items-center">
      <Link to='/'>
        <img src={Logo} alt="Logo" className='h-12 md:h-14 rounded-2xl hover:opacity-90 transition duration-200' />
      </Link>

      {!user ? (
        <div className='flex gap-4 items-center'>
          <Link to='/login'><Button title='Login' /></Link>
          <Link to='/register'><Button title='Sign Up' /></Link>
        </div>
      ) : (
        <div className='relative'>
          <div className='flex items-center gap-3 cursor-pointer' onClick={() => setDropdownOpen(!dropdownOpen)}>
            <img
              src={`https://ui-avatars.com/api/?name=${user.name}`}
              alt="profile"
              className='w-10 h-10 rounded-full border-2 border-orange-400 hover:scale-105 transition'
            />
          </div>

          {dropdownOpen && (
            <div className='absolute right-0 mt-2 p-3 bg-white rounded-lg shadow-xl z-20 text-sm'>
              <div className='text-lg text-center text-gray-900 '>
                <h1>{user.name}</h1>
              </div>
              <Link
                to='/profile'
                className='block px-4 py-2 text-gray-800 hover:bg-orange-100'
                onClick={() => setDropdownOpen(false)}
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className='flex items-center w-full px-4 py-2 text-red-600 hover:bg-orange-100'
              >
                <FiLogOut className='mr-2' /> Logout
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;