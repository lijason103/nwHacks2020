import React , { useState } from 'react';
import {
  AppBar, MenuItem, Menu,
} from '@material-ui/core';
import {
  Link, withRouter,
} from 'react-router-dom';
import './styles.css';

const Header = ({
  loggedIn, username, history,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenu = (e) => setAnchorEl(e.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);
  const navigateToProfile = () => {
    history.push('/profile');
    setAnchorEl(null);
  }
  return (
    <AppBar>
      <div className="header">
        <p>WebPage Change Tracker</p>
        {loggedIn ? (
          <div>
            <span onClick={handleMenu}>{username}</span>
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
          <p>Log in</p>
        )}
      </div>
      
    </AppBar>
  )
};

export default withRouter(Header);
