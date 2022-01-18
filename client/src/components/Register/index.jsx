import '../Register/index.css'

import { Button, Grid, IconButton, InputAdornment, TextField, Typography } from '@material-ui/core'

import Api from '../../Api'
import Cookies from 'universal-cookie'
import Visibility from '@material-ui/icons/Visibility'
import VisibilityOff from '@material-ui/icons/VisibilityOff'
import diaryLogo from '../../assets/logo.png'
import jwt from 'jsonwebtoken'
import { useHistory } from 'react-router-dom'
import { useState } from 'react'

const cookies = new Cookies()

const sessionExpires = Date.now() + 4320000 //milliseconds = 12 hours

export default function Register() {
  const history = useHistory()

  // State tracking for password inputs
  const [showPassword, setShowPassword] = useState(false)

  const goHome = () => {
    history.push('/login')
  }

  // Blank form submission error message
  const [error, setError] = useState(false)

  // invalid errors from server response
  const [invalid, setInvalid] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const getErrorText = (
    <Grid item xs={12}>
      <Typography variant="body2" style={{ color: 'red' }}>
        {errorMessage}
      </Typography>
    </Grid>
  )

  const getInvalidText = message => (
    <Grid item xs={12}>
      <Typography variant="body2" style={{ color: 'red' }}>
        {message ?? 'Error registering.'}
      </Typography>
    </Grid>
  )

  const sendUserToLibraryPage = user => {
    const newUserToken = jwt.sign(user, 'be70416c-2bb4-11ec-8d3d-0242ac130003', {
      expiresIn: '12h',
    })
    cookies.set('diary-user', newUserToken, { expires: new Date(sessionExpires) })

    history.push(`/${user.id}/library`)
  }

  const makeRequest = apiQuery => {
    Api.query(apiQuery, Api.post, (response, status, responseCode) => {
      if (responseCode !== 200) {
        setInvalid(true)
        setErrorMessage(response.message)
      } else {
        sendUserToLibraryPage(response.user)
      }
    })
  }

  /**
   * Submit user information to DB. Upon successful registration, re-routes to Login page.
   * @param {e} event listener.
   */
  const handleSubmit = e => {
    // reset errors
    setError(false)
    e.preventDefault()
    const data = new FormData(e.currentTarget)

    const name = data.get('name') || null
    const email = data.get('email') || null
    const password = data.get('password') || null

    // email validation
    // eslint-disable-next-line
    const regex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/

    if (name === null || email === null || password === null) {
      setError(true)
      setErrorMessage('All fields must be complete.')
    } else if (!regex.test(email)){
      setError(true)
      setErrorMessage('Please enter a valid email address.')
    } else{
      const apiQuery = Api.getBase() + `register/${name}/${email}/${password}`
      makeRequest(apiQuery)
    }
  }

  return (
    <Grid container alignItems="center" justifyContent="center" className="register-container">
      <Grid container item xs={6}>
        <Grid container item xs={12} justifyContent="center" spacing={2}>
          <Typography variant="h2" className="header-text">
            Create an Account
          </Typography>
        </Grid>

        <Grid container component="form" onSubmit={handleSubmit} noValidate spacing={2}>
          <Grid container item xs={12} justifyContent="center" className="login-fields">
            <TextField
              className="name-input"
              name="name"
              label="Name"
              variant="filled"
              placeholder="Enter name"
              inputProps={{ autoComplete: 'off' }}
            />
          </Grid>
          <Grid container item xs={12} justifyContent="center" className="login-fields">
            <TextField
              className="email-input"
              name="email"
              label="Email"
              variant="filled"
              placeholder="Enter email"
              inputProps={{ autoComplete: 'off' }}
            />
          </Grid>
          <Grid container item xs={12} justifyContent="center" className="login-fields">
            <TextField
              className="password-input"
              name="password"
              label="Password"
              variant="filled"
              inputProps={{ autoComplete: 'off' }}
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          {invalid && getInvalidText(errorMessage)}
          {error && getErrorText}
          <Grid container justifyContent="center">
            <Grid item xs={2}>
              <Button className="button" variant="contained" onClick={goHome}>
                Cancel
              </Button>
            </Grid>

            <Grid item xs={2}>
              <Button className="button" variant="contained" color="primary" type="submit">
                Submit
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={6}>
        <img src={diaryLogo} alt="diary-library-logo" />
      </Grid>
    </Grid>
  )
}
