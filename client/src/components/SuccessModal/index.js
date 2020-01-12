import React from 'react';
import { Modal, Button } from '@material-ui/core';

const SuccessModal = ({
  open, onClose
}) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
    >
      <div className="modal">
        <div className="modal-contents" style={{ textAlign: 'center' }}>
          <h3>Track successfully created!</h3>
          <Button onClick={onClose} variant="contained" color="primary">Close</Button>
        </div>
      </div>
    </Modal>
  );
}

export default SuccessModal;
