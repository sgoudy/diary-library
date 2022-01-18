import './index.css'

import { Button, Grid, IconButton, InputAdornment, TextField, Typography } from '@material-ui/core'
import { useContext, useState } from 'react'

import Api from '../../Api'
import { AuthContext } from '../../context/AuthContext'
import Visibility from '@material-ui/icons/Visibility'
import VisibilityOff from '@material-ui/icons/VisibilityOff'
import { useHistory } from 'react-router-dom'

export default function EditAccount() {
  const history = useHistory()
  const { user } = useContext(AuthContext)

  // State tracking for password inputs
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState(false)
  const handleClickShowPassword = () => setShowPassword(!showPassword)
  const handleMouseDownPassword = () => setShowPassword(!showPassword)

  // Blank form submission error message!
  const Error = () => (
    <Typography style={{ color: 'red' }} variant="body2">
      Please ensure all fields are complete.
    </Typography>
  )

  /**
   * Form submission handling
   * @param {e} e event handler for form submission
   * @returns breaks out if error
   */
  const handleSubmit = async e => {
    setError(error)
    e.preventDefault()
    const data = new FormData(e.currentTarget)

    // error handling
    if (data.get('name') === '' || data.get('email') === '' || data.get('password') === '') {
      setError(!error)
      return
    }
    data.get('name')
    data.get('email')
    data.get('password')
    data.append('userid', user.id)

    // push to back-end route
    try {
      setError(error)

      // This route does not exist yet but its how I would imagine it looking; send `null` for data not being updated.
      const apiQuery = Api.getBase() + `account/update`

      Api.query(apiQuery, Api.put, data, (response, status, responseCode) => {
        // response will always have .message and .status properties
        if (responseCode !== 200) {
          // You could do something else here like show a warning message on the form.
          console.log('ERROR: ' + response.message)
          return
        }
        // Status was true so the request was successful
        history.push('/login')
      })
    } catch (err) {
      console.log(err)
    }
  }

  /**
   * Cancel button sends user back to their library
   */
  const goHome = () => {
    let path = `/${user.id}/library`
    history.push(path)
  }

  return (
    <Grid container className="container">
      <Grid item xs={12}>
        <Typography variant="h2" className="header-text">
          Edit Account
        </Typography>

        {/* Form  */}
        <Grid container component="form" onSubmit={handleSubmit} noValidate spacing={2}>
          <Grid container item xs={12} justifyContent="center">
            <TextField
              className="name-input"
              label="Name"
              name="name"
              variant="filled"
              placeholder="Enter name"
              defaultValue={user.name}
            />
          </Grid>
          <Grid container item xs={12} justifyContent="center">
            <TextField
              className="email-input"
              label="Email"
              name="email"
              variant="filled"
              placeholder="Enter email"
              defaultValue={user.email}
            />
          </Grid>

          <Grid container item xs={12} justifyContent="center">
            <TextField
              className="password-input"
              label="Password"
              name="password"
              placeholder="Password"
              variant="filled"
              required
              type={showPassword ? 'text' : 'password'}
              InputProps={{
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

          {/* Desired Feature, not required */}
          <Grid container item xs={6} className="delete">
            <Button className="gray">Reset Password</Button>
          </Grid>
          {error ? <Error /> : null}
          <Grid container justifyContent="center">
            <Grid item xs={2}>
              <Button className="button" variant="contained" onClick={goHome}>
                Cancel
              </Button>
            </Grid>
            <Grid item xs={2}>
              <Button className="button" variant="contained" color="primary" type="submit">
                Submit Changes
              </Button>
            </Grid>
          </Grid>
          <Grid container item xs={8} className="delete">
            {/* This will need to delete a user based on their user ID */}
            <Button className="deleteBtn" color="secondary">
              Delete Account
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}
