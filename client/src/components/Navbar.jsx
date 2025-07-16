import Sidebar from './Sidebar'
import Header from './Header'
const Navbar = () => {
  return (
      <div className='relative top-0 flex items-center justify-between w-full  z-50'>
        <Sidebar />
        <Header />
      </div>
  )
}

export default Navbar