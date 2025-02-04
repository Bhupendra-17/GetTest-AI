import React from 'react'
import {Link} from 'react-router-dom'

const Login = () => {
  return (
    <div>
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 px-2">
        <div className="bg-cyan-100 dark:bg-gray-700 p-8 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">Login</h2>
          <form>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="email">
              Email ID
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              placeholder="abc@xyz.com"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="Password"
            />
          </div>
          <div className="flex items-baseline justify-between">
            <button
              className="bg-cyan-500 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
            >
              Login
            </button>
            <Link to='/register' className='underline text-gray-700 dark:text-gray-300  font-semibold mb-2'>Register</Link>
          </div>
        </form>
        </div>
      </div>
    </div>
  )
}

export default Login