import React from 'react'

function Button(props) {
  return (
    <div className='text-lg text-black font-semibold border border-gray-600 rounded-full px-4 py-1 w-fit cursor-pointer transition transform duration-300 hover:bg-gray-800 hover:text-white shadow-md'>
        {props.title}
    </div>
  )
}

export default Button