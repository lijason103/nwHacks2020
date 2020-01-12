import React from 'react';
import { Modal, Button } from '@material-ui/core';

const DeleteModal = ({
  open, onClose, handleDelete,
}) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
    >
      <div className="modal">
        <div className="modal-contents" style={{ textAlign: 'center', padding: '10px 20px 30px 20px' }}>
          <h3>Are you sure you want to delete the tracker?</h3>
          <div>
            <Button onClick={handleDelete} variant="contained" color="secondary" style={{ marginRight: 30 }}>Delete</Button>
            <Button onClick={onClose} variant="contained" color="primary">No</Button>
          </div>
          
        </div>
      </div>
    </Modal>
  );
}

export default DeleteModal;
