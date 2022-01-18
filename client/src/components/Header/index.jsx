import '../Header/index.css'

import {
  AppBar,
  Avatar,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from '@material-ui/core'
import { useContext, useState } from 'react'

import { AccountCircle } from '@material-ui/icons'
import { AuthContext } from '../../context/AuthContext'
import Cookies from 'universal-cookie'
import diaryLogo from '../../assets/logo.png'
import { useHistory } from 'react-router-dom'

const cookies = new Cookies()

export default function Header() {
  const history = useHistory()
  const { user } = useContext(AuthContext)

  const [anchorEl, setAnchorEl] = useState(null)

  const handleMenu = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const goEdit = () => {
    // let path = `/${user.id}/edit`;
    let path = '/edit'
    history.push(path)
  }

  const goLogin = () => {
    let path = '/'
    cookies.remove('diary-user')
    history.push(path)
  }

  const goLibrary = () => {
    let path = `/${user.id}/library`
    history.push(path)
  }

  return (
    <Grid>
      <AppBar className="topbarContainer">
        <Toolbar className="header">
          <img src={diaryLogo} alt="diary-library-logo" className="logo" onClick={goLibrary} />

          <Typography variant="h6" component="div">
            Diary Library
          </Typography>

          <IconButton
            size="medium"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            align-items="right"
            onClick={handleMenu}
            color="inherit"
          >
            {user ? (
              <Avatar alt={user.name}> {user?.name?.[0].toUpperCase()}</Avatar>
            ) : (
              <AccountCircle />
            )}
          </IconButton>

          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={goEdit}>Edit Account</MenuItem>
            <MenuItem onClick={goLogin}>Sign Out</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
    </Grid>
  )
}
