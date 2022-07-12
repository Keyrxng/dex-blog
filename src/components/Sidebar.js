import './Sidebar.css'
import { Link } from 'react-router-dom'
import { useMoralis } from 'react-moralis'
import HomeIcon from '@mui/icons-material/Home'
import BookIcon from '@mui/icons-material/Book'
import RateReviewIcon from '@mui/icons-material/RateReview'
import LogoutIcon from '@mui/icons-material/Logout'
import logo from '../images/m.png'

const Sidebar = () => {
  const { logout } = useMoralis()
  const logOut = async () => {
    await logout()
  }
  return (
    <>
      <div className="siderContent">
        <img className="logo" src={logo}></img>
        <div className="menu">
          <Link to="/" className="link">
            <div className="menuItems">
              <HomeIcon />
            </div>
          </Link>
          <Link to="/" className="link">
            <div className="menuItems">
              <BookIcon />
            </div>
          </Link>
          <Link to="/" className="link">
            <div className="menuItems">
              <RateReviewIcon />
            </div>
          </Link>
          <div className="logout" onClick={logOut}>
            <LogoutIcon />
          </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar
