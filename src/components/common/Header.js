import * as React from 'react'
import PropTypes from 'prop-types'
import Toolbar from '@mui/material/Toolbar'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import SearchIcon from '@mui/icons-material/Search'
import Typography from '@mui/material/Typography'
import Link from '@mui/material/Link'
import { useMoralis } from 'react-moralis'
import { useNavigate } from 'react-router-dom'
import swal from 'sweetalert'

function Header(props) {
  const { title } = props
  const { navigate } = useNavigate()
  const {
    logout,
    authenticate,
    isAuthenticated,
    isAuthenticating,
  } = useMoralis()

  return (
    <React.Fragment>
      <Toolbar sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Button size="small">Subscribe</Button>
        <Typography
          component="h2"
          variant="h5"
          color="inherit"
          align="center"
          noWrap
          sx={{ flex: 1 }}
        >
          {title}
        </Typography>
        <IconButton>
          <SearchIcon />
        </IconButton>
        {!isAuthenticated ? (
          <Button
            variant="outlined"
            size="small"
            onClick={async () =>
              authenticate({
                signingMessage:
                  'Now that you are authenticated you should be able to interact more with the blog, many thanks.',
              })
            }
          >
            Sign up
          </Button>
        ) : (
          <Button variant="outlined" size="small" onClick={logout}>
            Disconnect
          </Button>
        )}
      </Toolbar>
      <Toolbar
        component="nav"
        variant="dense"
        sx={{ justifyContent: 'space-between', overflowX: 'auto' }}
      >
        <Link
          color="inherit"
          noWrap
          key="Home"
          variant="body1"
          href={'/Home'}
          sx={{ p: 1, flexShrink: 0 }}
          onClick={() => navigate('/')}
        >
          Home
        </Link>
        <Link
          color="inherit"
          noWrap
          key="Solidity"
          variant="body1"
          href={'/'}
          sx={{ p: 1, flexShrink: 0 }}
        >
          Solidity
        </Link>
        <Link
          color="inherit"
          noWrap
          key="Web3"
          variant="body1"
          href={'/'}
          sx={{ p: 1, flexShrink: 0 }}
        >
          Web3
        </Link>
        <Link
          color="inherit"
          noWrap
          key="DeFi"
          variant="body1"
          href={'/'}
          sx={{ p: 1, flexShrink: 0 }}
        >
          DeFi
        </Link>
        <Link
          color="inherit"
          noWrap
          key="NewPost"
          variant="body1"
          href={'/NewPost'}
          sx={{ p: 1, flexShrink: 0 }}
        >
          Post a Post
        </Link>
      </Toolbar>
    </React.Fragment>
  )
}

Header.propTypes = {
  sections: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    }),
  ).isRequired,
  title: PropTypes.string.isRequired,
}

export default Header
