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

const App = () => { 
  const [loggedIn, setLoggedIn] = useState(true);
  const [username, setUsername] = useState('Hello');
  return (
    <Router>
      <div className="App">
        <Header
          loggedIn={loggedIn}
          username={username}
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
              loggedIn={loggedIn}
            />
          </Route>
        </Switch>
      </div>
    </Router>
    
    
  );
};

export default App;
