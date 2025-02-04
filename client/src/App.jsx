import React from 'react'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Main from './pages/Main'

const App = () => {
  return (
    <div className=' min-h-screen '>
      <Router>
        <Routes>
          <Route path ='/' element = {<Home/>}></Route>
          <Route path='/register' element = {<Register />}></Route>
          <Route path='/login' element = {<Login />}></Route>
          <Route path='/register' element = {<Register />}></Route>
          <Route path='/main' element = {<Main />}></Route>
        </Routes>
      </Router>
    </div>
  )
}

export default App