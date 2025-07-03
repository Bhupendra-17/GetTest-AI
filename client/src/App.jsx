import React from 'react'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Main from './pages/Main'
import Test from './pages/Test'
import Score from './pages/Score';

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
          <Route path='/test' element = {<Test />}></Route>
          <Route path='/score' element = {<Score />}></Route>
        </Routes>
      </Router>
    </div>
  )
}

export default App