import '../Landing/index.css'

import { Button, Grid, IconButton, InputAdornment, TextField, Typography } from '@material-ui/core'

import Api from '../../Api'
import Visibility from '@material-ui/icons/Visibility'
import VisibilityOff from '@material-ui/icons/VisibilityOff'
import diaryLogo from '../../assets/logo.png'
import { useHistory } from 'react-router-dom'
import { useState } from 'react'

export default function Landing() {
  // State tracking for password inputs
  const [showPassword, setShowPassword] = useState(false)
  const handleClickShowPassword = () => setShowPassword(!showPassword)
  const handleMouseDownPassword = () => setShowPassword(!showPassword)

  const history = useHistory()

  // Blank form submission error message!
  const [error, setError] = useState(false)

  const getErrorText = () => (
    <Grid item xs={12}>
      <Typography variant="body2" style={{ color: 'red' }}>
        All fields must be complete.
      </Typography>
    </Grid>
  )

  // invalid errors from server response
  const [invalid, setInvalid] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const getInvalidText = message => (
    <Grid item xs={12}>
      <Typography variant="body2" style={{ color: 'red' }}>
        {message ?? 'Invalid username/ password.'}
      </Typography>
    </Grid>
  )

  /**
   * Routes to user registration.
   */
  const goSignup = () => {
    let path = '/user-register'
    history.push(path)
  }

  /**
   * Submit user information to DB. Upon successful registration, re-routes to Login page.
   * @param {e} event listener.
   */
  const handleSubmit = async e => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const email = data.get('email') || null
    const password = data.get('password') || null

    // check for empty fields
    if (email === null || password === null) {
      setError(!error)
    } else {
      const apiQuery = Api.getBase() + `login`

      // Make a virtual form to submit.
      const form = document.createElement('FORM')
      const body = new FormData(form)
      body.append('email', email)
      body.append('password', password)
      Api.query(apiQuery, Api.post, body, (response, status, responseCode) => {
        if (responseCode !== 200) {
          setInvalid(!invalid)
          setErrorMessage(response.message)
        } else {
          sendUserToLibraryPage(response.id)
        }
      })
    }
  }

  const sendUserToLibraryPage = id => {
    history.push(`/${id}/library`)
  }

  return (
    <Grid className="containerLanding">
      <Grid item xs={12}>
        <img src={diaryLogo} alt="diary-libary-logo" />
      </Grid>
      <Grid className="welcome-message">
        <Typography variant="h2" className="header-text">
          Welcome to the Diary Library
        </Typography>
        <Typography variant="subtitle2" className="sub-text">
          All your notes in books. Secured.
        </Typography>

        {/* FORM  */}
        <Grid container component="form" onSubmit={handleSubmit} noValidate spacing={2}>
          <Grid container item xs={12} justifyContent="center">
            <TextField
              title="email"
              name="email"
              className="email-input"
              id="email-input"
              label="Email"
              variant="filled"
              placeholder="Enter email"
            />
          </Grid>

          <Grid container item xs={12} justifyContent="center">
            <TextField
              title="password"
              name="password"
              className="password-input"
              id="password-input"
              label="Password"
              variant="filled"
              placeholder="Enter password"
              inputProps={{ autoComplete: 'off' }}
              defaultValue=""
              type={showPassword ? 'text' : 'password'} // <-- This is where the magic happens
              InputProps={{
                // <-- This is where the toggle button is added.
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          {invalid && getInvalidText(errorMessage)}
          {error && getErrorText()}
          <Grid container justifyContent="center">
            <Grid item xs={2}>
              <Button className="button" variant="contained" onClick={goSignup}>
                New User?
              </Button>
            </Grid>
            <Grid item xs={2}>
              <Button className="button" variant="contained" color="primary" type="submit">
                Login
              </Button>
            </Grid>
          </Grid>
        </Grid>
        {/* </Grid> */}
      </Grid>
    </Grid>
  )
}
