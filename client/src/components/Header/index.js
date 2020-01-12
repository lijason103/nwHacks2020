import React , { useState } from 'react';
import {
  AppBar, MenuItem, Menu,
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

import {
  withRouter,
} from 'react-router-dom';
import './styles.css';

const Header = ({
  loggedIn, username, history, openModal
}) => {
  
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenu = (e) => setAnchorEl(e.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);
  const navigateToProfile = () => {
    history.push('/profile');
    setAnchorEl(null);
  };
  const navigateToHome = () => {
    history.push('/');
  };
  return (
    <AppBar>
      <div className="header">
        <div className="title" onClick={navigateToHome}>
          <SearchIcon />
          <h3>Watch Doge</h3>
        </div>
        
        {loggedIn ? (
          <div className="navigate">
            <div className="navigate-contents" onClick={handleMenu}>
              <AccountCircleIcon style={{ marginRight: 5 }}/>
              {username}
            </div>
            <Menu
              open={open}
              onClose={handleCloseMenu}
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
            >
              <MenuItem onClick={navigateToProfile}>View Trackers</MenuItem>
              <MenuItem>Log out</MenuItem>
            </Menu>
          </div>
        ) : (
          <div className="signUp" onClick={openModal}>
            <h4>
              Log in
            </h4>
            
          </div>
        )}
      </div>
      
    </AppBar>
  )
};

export default withRouter(Header);
