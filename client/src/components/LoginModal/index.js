import React, { useState } from 'react';
import { Modal, TextField, Button, CircularProgress } from '@material-ui/core';
import './styles.css';

import {
  withRouter,
} from 'react-router-dom';

const LoginModal = ({
  open, onClose, login, history,
}) => {
  const [logging, setLogging] = useState(false);
  const [message, setMessage] = useState('');
  const [username, setUsername] = useState('');

  const sendLogin = (e) => {
    e.preventDefault();
    setLogging(true);
    fetch('/login', {
      method: 'POST',
      body: JSON.stringify({
        user_id: username,
      }),
      headers: {
        'Content-Type': 'application/json'
      },
    })
      .then(response => {
        if (response.status === 200) {
          login(username);
          history.push('/profile');
        } else {
          setLogging(false);
          setMessage('Invalid username.')
        }
      })
      .catch(err => {
        alert(err);
      })
  }
  return (
    <Modal
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      open={open}
      onClose={onClose}
    >
      <div className="modal">
        <div className="modal-contents">
          <h3>
            Log in
          </h3>
          {logging ? (
            <CircularProgress />
          ) : (
            <form className="login-contents">
              <TextField
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                variant="outlined"
                margin="dense"
                placeholder="Type your username..."
                style={{ marginBottom: 20 }}
                helperText={message.length > 0 && message}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={sendLogin}
                type="submit"
              >
                <span>Log in</span>
              </Button>
            </form>
          )}
          
        </div>
      </div>
    </Modal>
  );
}

export default withRouter(LoginModal);
