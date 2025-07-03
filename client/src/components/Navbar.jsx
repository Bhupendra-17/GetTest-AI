import Sidebar from './Sidebar'
import Header from './Header'
const Navbar = () => {
  return (
      <div className='flex items-center'>
        <Sidebar />
        <Header />
      </div>
  )
}

export default Navbar