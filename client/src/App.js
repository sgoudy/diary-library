import { Redirect, Route, BrowserRouter as Router, Switch } from 'react-router-dom'

import AuthorizedContainer from './containers/AuthorizedContainer/index.jsx'
import EditAccount from './components/EditAccount/index.jsx'
import Header from './components/Header/index.jsx'
import Landing from './components/Landing/index.jsx'
import Library from './components/Library/index.jsx'
import Register from './components/Register/index.jsx'

const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/login">
          <Landing />
        </Route>
        <Route path="/user-register">
          <Register />
        </Route>
        {/* Authorized Path */}
        <Route path="/edit">
          <AuthorizedContainer>
            <Header />
            <EditAccount />
          </AuthorizedContainer>
        </Route>
        {/* Authorized Path */}
        <Route path="/:id/edit">
          <AuthorizedContainer>
            <Header />
            <EditAccount />
          </AuthorizedContainer>
        </Route>
        {/* Authorized Path */}
        <Route path="/:id/library">
          <AuthorizedContainer>
            <Header />
            <Library />
          </AuthorizedContainer>
        </Route>
        <Route path="*">
          <Landing />
        </Route>
        <Redirect to="/" />
      </Switch>
    </Router>
  )
}

export default App
