import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
} from 'react-router-dom';


import './App.css';
import Header from './components/Header';
import Index from './pages/index';
import Profile from './pages/profile';

import LoginModal from './components/LoginModal';

const App = () => { 
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [openModal, setOpenModal] = useState(false);

  const handleLogin = ($username) => {
    setLoggedIn(true);
    setUsername($username);
    setOpenModal(false);
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setUsername('');
  };

  return (
    <Router>
      <div className="App">
        <Header
          loggedIn={loggedIn}
          username={username}
          openModal={() => setOpenModal(true)}
          handleLogout={handleLogout}
        />
        <Switch>
          <Route exact path="/">
            <Index
              username={username}
              loggedIn={loggedIn}
            />
          </Route>
          <Route path="/profile">
            <Profile
              username={username}
              loggedIn={loggedIn}
            />
          </Route>
        </Switch>

        <LoginModal
          open={openModal}
          onClose={() => setOpenModal(false)}
          login={handleLogin}
        />
        
      </div>
    </Router>
    
    
  );
};

export default App;
