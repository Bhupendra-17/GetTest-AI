import React from 'react'
import Logo from '../assets/logo1.png'
import Button from './Button'
import { Link } from 'react-router-dom'

const Header = () => {
    return (
        <div className='flex w-full justify-between px-5 bg-amber-50'>
            <img src={Logo} alt=""
                className='flex h-14 justify-center items-center hover:cursor-pointer' />

            <div className='flex gap-4 items-center justify-evenly'>
                <Link to='/login'><Button title='Login'></Button></Link>
                <Link to='/register'><Button title='Sign Up'></Button></Link>
            </div>
        </div >
    )
}

export default Header