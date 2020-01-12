import React, { useState } from 'react';
import { Modal, TextField, Button, CircularProgress } from '@material-ui/core';
import './styles.css';

const LoginModal = ({
  open, onClose, login,
}) => {
  const [logging, setLogging] = useState(false);
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
        } else {
          alert('err')
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

export default LoginModal;
