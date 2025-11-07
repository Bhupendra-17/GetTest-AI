import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
// import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Main from './pages/Main'
import Test from './pages/Test'
import Score from './pages/Score';
import AuthCallback from './pages/AuthCallback'
import Profile from './pages/Profile'
import ScorewithId from './pages/Scorewithid'
import PaymentPlans from './pages/PaymentPlans'
import PaymentSuccess from './pages/PaymentSuccess'
import PaymentFailure from './pages/PaymentFailure'
import About from './pages/About';

const App = () => {
  return (
    <div className=' min-h-screen '>
      <Router>
        <Routes>
          <Route path ='/' element = {<Home/>}></Route>
          <Route path='/login' element = {<Login />}></Route>
          <Route path='/register' element = {<Register />}></Route>
          <Route path='/main' element = {<Main />}></Route>
          <Route path='/test' element = {<Test />}></Route>
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path='/score' element = {<Score />}></Route>
          <Route path='/score/:testId' element = {<ScorewithId />}></Route>
          <Route path='/profile' element = {<Profile />}></Route>
          <Route path='/pricing' element = {<PaymentPlans />}></Route>
          <Route path='/about' element = {<About />}></Route>
          <Route path='/payment-success' element = {<PaymentSuccess />}></Route>
          <Route path='/payment-failure' element = {<PaymentFailure />}></Route>
        </Routes>
      </Router>
    </div>
  )
}

export default App